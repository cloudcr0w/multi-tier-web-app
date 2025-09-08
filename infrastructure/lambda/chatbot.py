import json

def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    user_message = body.get("message", "")

    reply = f"🤖 Mock reply: You said '{user_message}'. Adam is great at AWS & Terraform! 🚀"

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"  
        },
        "body": json.dumps({"reply": reply})
    }
