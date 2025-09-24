# TODO – Contact Form Migration

## 🎯 Goal
Replace the legacy **RDS + EC2 backend** contact form with a **serverless solution** that reduces costs and simplifies maintenance.

---

## 🛠 Current State (before Sept 2025)
- Form submissions handled by **Express backend on EC2**.
- Data stored in **MySQL on RDS**.
- Notifications delivered via **SNS (email subscription)**.
- Monthly cost ~27 USD.

---

## 🚀 Target State (after migration)
- **Frontend (S3 + CloudFront)** sends form data to **API Gateway**.
- **Lambda (Python)** processes request:
  - Saves form data to **S3** (JSON archive).
  - Publishes notification to **SNS** (email).
- **No RDS / EC2** required.
- Monthly cost ~3 USD.

---

## ✅ Migration Steps
1. Create **S3 bucket** (`contact-form-submissions`) for storing form data.
2. Create **SNS topic** (`contact-form-topic`) and subscribe target email address.
3. Implement **Lambda function**:
   - Input: POST request from API Gateway (JSON: name, email, message).
   - Save submission to S3 (`contact-forms/yyyy-mm-dd-uuid.json`).
   - Publish notification to SNS with sender info + message.
4. Deploy **API Gateway HTTP API** to expose endpoint for frontend.
5. Update frontend form → send requests to new API Gateway endpoint.
6. Test end-to-end (form submit → S3 archive + email notification).
7. Remove old EC2 + RDS resources permanently.

---

## 📉 Expected Benefits
- Save ~20+ USD/month (RDS + EC2 costs).
- Simplify architecture (fully serverless).
- Preserve both history (S3) and notifications (SNS).
- Showcase real-world **cost governance** skills on AWS.
