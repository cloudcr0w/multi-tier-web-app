# 🛡️ CloudFront Failover Monitoring

This folder contains the **AWS Lambda function** and health-check utilities used to monitor
**origin failovers** in the CloudFront distribution of the CrowProject.

## Overview
The monitoring system captures **real-time logs** from CloudFront → Kinesis → Lambda,
detects any failover events, and pushes a custom metric to **CloudWatch**.

If a failover occurs (for example, when the primary S3 origin is down),
a **CloudWatch Alarm** triggers an email notification via **SNS**.

---

## Architecture

```bash
CloudFront
│
├── Real-time logs (RT)
│
▼
AWS Kinesis Stream
│
▼
AWS Lambda (crow-rt-failover-detector)
│
▼
CloudWatch Custom Metric → SNS Email Alert
```
## Files

| File |                     Description |
|---------------------------|-------------------------------------------------------------------------------------------------------------|
| `lambda_index.py`         | Lambda function that counts `sr-reason=Failover:*` from CloudFront RT logs and pushes metrics to CloudWatch |
| `healthz.txt`             | Simple health-check file (`/healthz`) used for monitoring availability |
| `README.md`               | This file |

---

## Deployment Notes

1. **Region:** `us-east-1`  
2. **Lambda Role:** `crow-rt-failover-role`  
3. **Metric Namespace:** `CrowProject/CloudFront`  
4. **Alarm:** `CF-OriginFailover-Detected`  
5. **SNS Topic:** `crowproject-alerts`  
6. **Sampling Rate:** 10% (adjustable)

---

## Example CloudWatch Metric

| Metric | Namespace | Description |
|---------|------------|--------------|
| `OriginFailovers` | `CrowProject/CloudFront` | Number of failover events detected in the last minute |

---