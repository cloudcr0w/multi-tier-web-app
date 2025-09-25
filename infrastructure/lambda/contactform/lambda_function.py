import json
import boto3
import os
from datetime import datetime
import uuid

s3 = boto3.client("s3")
sns = boto3.client("sns")

BUCKET_NAME = os.environ["BUCKET_NAME"]
SNS_TOPIC_ARN = os.environ["SNS_TOPIC_ARN"]

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        name = body.get("name", "Anonymous")
        email = body.get("email", "No email")
        message = body.get("message", "")

        # 1. Save to S3
        filename = f"contact-forms/{datetime.utcnow().strftime('%Y-%m-%d')}-{uuid.uuid4()}.json"
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=json.dumps(body, indent=2),
            ContentType="application/json"
        )

        # 2. Notify via SNS
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject="New Contact Form Submission",
            Message=f"From: {name} <{email}>\n\n{message}"
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"success": True, "message": "Message received"})
        }

    except Exception as e:
        print("Error:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"success": False, "error": str(e)})
        }
