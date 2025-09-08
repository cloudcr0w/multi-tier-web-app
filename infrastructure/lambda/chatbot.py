import json
import os
import boto3
from botocore.config import Config

# Bedrock client
bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("REGION", "us-east-1"),
    config=Config(retries={"max_attempts": 3, "mode": "standard"})
)

SYSTEM_PROMPT = (
    "You are Adam's AI assistant. Answer ONLY about Adam Wrona's skills, projects, "
    "certifications, and cloud/DevOps experience. If asked about unrelated topics, "
    "politely decline and redirect to Adam's portfolio topics. Be concise."
)

# Function to invoke Bedrock
def call_bedrock_claude(user_msg):
    body = {
        "anthropic_version": "bedrock-2023-05-31",  # Use Claude version
        "max_tokens": 350,
        "temperature": 0.2,
        "messages": [
            {
                "role": "user",
                "content": f"{SYSTEM_PROMPT}\nUser: {user_msg}"
            }
        ]
    }

    model_id = os.getenv("MODEL_ID", "anthropic.claude-4:0")
    response = bedrock.invoke_model(
        modelId=model_id,
        accept="application/json",
        contentType="application/json",
        body=json.dumps(body)
    )
    payload = json.loads(response["body"].read().decode("utf-8"))

    # Extract reply from Claude
    try:
        reply = payload["content"][0]["text"]
    except Exception as e:
        reply = f"Error in processing: {str(e)}"

    return reply

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        user_message = body.get("message", "").strip()

        # Validate the message
        if not user_message:
            reply = "Please ask a question about Adam's projects or skills."
        else:
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
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": f"Server error: {str(e)}"})
        }
