import json
import os
import boto3
import logging
from botocore.config import Config

# Set up logging
logging.basicConfig(level=logging.INFO)

# Create an AWS Secrets Manager client
def get_secret():
    secret_name = "adam-system-prompt-bedrock"  
    region_name = "us-east-1"  

    client = boto3.client(service_name='secretsmanager', region_name=region_name)

    try:
        # Retrieve the secret
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except Exception as e:
        logging.error("Error fetching secret: %s", str(e))
        raise e

    # Read and return the secret in JSON format
    secret = get_secret_value_response['SecretString']
    return json.loads(secret)

# Retrieve data from Secrets Manager
secrets = get_secret()
SYSTEM_PROMPT = secrets.get("SYSTEM_PROMPT")
MODEL_ID = secrets.get("MODEL_ID")
BEDROCK_API_KEY = secrets.get("BEDROCK_API_KEY")

# Bedrock client
bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("REGION", "us-east-1"),
    config=Config(retries={"max_attempts": 3, "mode": "standard"})
)

# Function to invoke Bedrock
def call_bedrock_claude(user_msg: str) -> str:
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 220,          # shorter replies
        "temperature": 0.3,         # a bit more natural
        "top_p": 0.9,
        "stop_sequences": ["\n\nUser:"],  # prevents rambling into the next turn
        "system": [
            {
                "type": "text",
                "text": (
                    f"{SYSTEM_PROMPT}\n\n"
                    "Style:\n"
                    "- Be concise (usually 2–3 sentences).\n"
                    "- Avoid lists unless the user asks.\n"
                    "- If helpful, end with one short next-step suggestion."
                )
            }
        ],
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": user_msg}]
            }
        ]
    }

    try:
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            accept="application/json",
            contentType="application/json",
            body=json.dumps(body)
        )
        payload = json.loads(response["body"].read().decode("utf-8"))
        logging.info("API Response: %s", payload)

        # Claude on Bedrock: payload["content"] = [{"type": "text", "text": "..."}]
        if "content" in payload and payload["content"]:
            reply = payload["content"][0].get("text", "")
        else:
            reply = "I couldn't parse the model response."

        # Optional hard cap: trim to ~3 sentences if it gets too long
        sentences = [s.strip() for s in reply.split(". ") if s.strip()]
        if len(sentences) > 3:
            reply = ". ".join(sentences[:3]).rstrip(".") + "."

    except Exception as e:
        logging.error("Error invoking model: %s", str(e))
        reply = f"Error invoking model: {str(e)}"

    return reply


def lambda_handler(event, context):
    try:
        # Retrieve the request body
        body = json.loads(event.get("body", "{}"))
        user_message = body.get("message", "").strip()

        # Validate the message
        if not user_message:
            reply = "Please ask a question about Adam's projects or skills."
        else:
            # Call the function with the user's query
            reply = call_bedrock_claude(user_message)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"reply": reply})
        }
    except Exception as e:
        logging.error("Server error: %s", str(e))  # Log server errors
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": f"Server error: {str(e)}"})
        }
