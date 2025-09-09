import json
import os
import re
import time
import boto3
import logging
from botocore.config import Config
from typing import Dict, Tuple

# -------------------------------------------------------------------
# Logging setup – INFO level is enough for Lambda diagnostics.
# -------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)

# -------------------------------------------------------------------
# Rate limiting configuration
# -------------------------------------------------------------------
RATE_TABLE        = os.getenv("RATE_TABLE", "chat_rate_limits")  # DynamoDB table name
RATE_WINDOW_SEC   = int(os.getenv("RATE_WINDOW_SEC", "60"))      # length of the fixed window (in seconds)
RATE_MAX_REQUESTS = int(os.getenv("RATE_MAX_REQUESTS", "12"))    # max requests per IP per window

# -------------------------------------------------------------------
# Application-level guards
# -------------------------------------------------------------------
MAX_INPUT_CHARS = 800  # prevent oversized prompts
BLOCKLIST = {"fuck", "shit", "kurwa"}  # simple blocklist for abusive inputs

ALLOWED_TOPICS_HINT = (
    "Only answer questions about Adam Wrona’s skills, projects, certifications, and experience. "
    "If the user asks about unrelated topics, politely say you only cover Adam’s professional profile "
    "and suggest a relevant question."
)

# -------------------------------------------------------------------
# Secrets Manager: used to store system prompt and model ID
# -------------------------------------------------------------------
def get_secret() -> Dict[str, str]:
    secret_name = "adam-system-prompt-bedrock"
    region_name = "us-east-1"
    client = boto3.client("secretsmanager", region_name=region_name)
    try:
        resp = client.get_secret_value(SecretId=secret_name)
        return json.loads(resp["SecretString"])
    except Exception as e:
        logging.error("Error fetching secret: %s", e)
        raise

secrets = get_secret()
SYSTEM_PROMPT = secrets.get("SYSTEM_PROMPT", "")
MODEL_ID      = secrets.get("MODEL_ID", "")
# Note: Bedrock Runtime does not require an API key → do not store it

# -------------------------------------------------------------------
# AWS clients
# - Bedrock Runtime: to call Anthropic Claude
# - DynamoDB: to persist rate-limiting counters
# -------------------------------------------------------------------
bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("REGION", "us-east-1"),
    config=Config(
        retries={"max_attempts": 3, "mode": "standard"},
        connect_timeout=2,   # short timeout to avoid hanging
        read_timeout=8,
    ),
)
dynamodb = boto3.client("dynamodb", region_name=os.getenv("REGION", "us-east-1"))

# -------------------------------------------------------------------
# Helper functions
# -------------------------------------------------------------------
def normalize_text(s: str) -> str:
    """Collapse whitespace and trim input text."""
    return re.sub(r"\s+", " ", (s or "")).strip()

def is_blocked(s: str) -> bool:
    """Return True if input contains any word from the blocklist."""
    low = s.lower()
    return any(b in low for b in BLOCKLIST)

def get_client_ip(event) -> str:
    """
    Extract client IP from common headers.
    API Gateway and CloudFront typically forward it via X-Forwarded-For.
    """
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    xff = headers.get("x-forwarded-for") or ""
    if xff:
        return xff.split(",")[0].strip()
    return headers.get("cf-connecting-ip") or headers.get("x-real-ip") or "0.0.0.0"

# -------------------------------------------------------------------
# Rate limiting using DynamoDB (fixed window counter with TTL)
# Each IP gets a counter per window_start (e.g. per 60s).
# TTL ensures DynamoDB cleans up automatically after expiry.
# -------------------------------------------------------------------
def check_rate_limit(ip: str) -> Tuple[bool, int]:
    """
    Returns (allowed, remaining).
    allowed = True if request is under limit, False if limit exceeded.
    remaining = how many requests left in the current window.
    """
    now = int(time.time())
    window_start = now - (now % RATE_WINDOW_SEC)
    ttl = window_start + RATE_WINDOW_SEC + 60  # extra 60s to allow cleanup

    try:
        resp = dynamodb.update_item(
            TableName=RATE_TABLE,
            Key={"ip": {"S": ip}, "ws": {"N": str(window_start)}},
            UpdateExpression="SET cnt = if_not_exists(cnt, :zero) + :one, ttl = :ttl",
            ExpressionAttributeValues={
                ":zero": {"N": "0"},
                ":one":  {"N": "1"},
                ":ttl":  {"N": str(ttl)},
            },
            ReturnValues="UPDATED_NEW",
        )
        count = int(resp["Attributes"]["cnt"]["N"])
        remaining = max(RATE_MAX_REQUESTS - count, 0)
        return (count <= RATE_MAX_REQUESTS, remaining)
    except Exception as e:
        # Fallback: if DynamoDB fails, do not block user but log error
        logging.error("rate-limit ddb error: %s", e)
        return (True, RATE_MAX_REQUESTS)

# -------------------------------------------------------------------
# Bedrock: call Anthropic Claude via invoke_model
# Includes:
#   - enforced max input length
#   - blocklist filter
#   - style constraints (concise answers, user’s language)
#   - hard cap of ~3 sentences in the output
# -------------------------------------------------------------------
def call_bedrock_claude(user_msg: str) -> str:
    user_msg = normalize_text(user_msg)[:MAX_INPUT_CHARS]
    if not user_msg:
        return "Please ask a question about Adam's projects or skills."
    if is_blocked(user_msg):
        return "I can’t process that request. Please keep it professional and ask about Adam’s work."

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 220,
        "temperature": 0.3,
        "top_p": 0.9,
        "stop_sequences": ["\n\nUser:"],
        "system": [
            {
                "type": "text",
                "text": (
                    f"{SYSTEM_PROMPT}\n\n"
                    f"{ALLOWED_TOPICS_HINT}\n"
                    "Style:\n"
                    "- Be concise (usually 2–3 sentences).\n"
                    "- Avoid lists unless the user asks.\n"
                    "- End with one short next-step suggestion when helpful.\n"
                    "- Always reply in the user's language."
                ),
            }
        ],
        "messages": [
            {"role": "user", "content": [{"type": "text", "text": user_msg}]}
        ],
    }

    try:
        t0 = time.time()
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            accept="application/json",
            contentType="application/json",
            body=json.dumps(body),
        )
        latency_ms = int((time.time() - t0) * 1000)
        payload = json.loads(response["body"].read().decode("utf-8"))
        logging.info("bedrock ok | ms=%s | in_len=%s", latency_ms, len(user_msg))

        reply = ""
        if isinstance(payload, dict) and payload.get("content"):
            reply = payload["content"][0].get("text", "")

        if not reply:
            return "I couldn’t parse the model response."

        # Hard trim: keep at most 3 sentences
        sentences = [s.strip() for s in reply.split(". ") if s.strip()]
        if len(sentences) > 3:
            reply = ". ".join(sentences[:3]).rstrip(".") + "."

        return reply
    except Exception as e:
        logging.error("bedrock error: %s", e)
        return "Temporary error. Please try again in a moment."

# -------------------------------------------------------------------
# Lambda handler
# Responsibilities:
#   - Handle CORS preflight
#   - Enforce per-IP rate limit
#   - Validate input
#   - Call Bedrock for reply
#   - Return safe JSON with CORS + security headers
# -------------------------------------------------------------------
def lambda_handler(event, context):
    try:
        # --- CORS preflight (OPTIONS request) ---
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 204,
                "headers": {
                    "Access-Control-Allow-Origin": os.getenv("CORS_ORIGIN", "*"),
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                "body": ""
            }

        body = json.loads(event.get("body", "{}"))
        user_message = normalize_text(body.get("message", ""))

        # --- Rate limiting per IP ---
        ip = get_client_ip(event)
        allowed, remaining = check_rate_limit(ip)
        if not allowed:
            origin = os.getenv("CORS_ORIGIN", "*")
            return {
                "statusCode": 429,
                "headers": {
                    "Content-Type": "application/json; charset=utf-8",
                    "Access-Control-Allow-Origin": origin,
                    "Retry-After": str(RATE_WINDOW_SEC),
                },
                "body": json.dumps({
                    "error": f"Rate limit exceeded. Try again in ~{RATE_WINDOW_SEC} seconds."
                }),
            }

        # --- Main logic ---
        reply = call_bedrock_claude(user_message) if user_message else \
                "Please ask a question about Adam's projects or skills."

        origin = os.getenv("CORS_ORIGIN", "*")
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": origin,
                "Vary": "Origin",
                "X-Content-Type-Options": "nosniff",
                "Referrer-Policy": "no-referrer",
                # Rate-limit headers help client-side UX
                "X-RateLimit-Limit": str(RATE_MAX_REQUESTS),
                "X-RateLimit-Remaining": str(max(remaining, 0)),
                "X-RateLimit-Window": str(RATE_WINDOW_SEC),
            },
            "body": json.dumps({"reply": reply}),
        }
    except Exception as e:
        logging.error("lambda error: %s", e)
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": os.getenv("CORS_ORIGIN", "*"),
            },
            "body": json.dumps({"error": "Server error"}),
        }
