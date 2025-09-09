# Multi-Tier Web Application

📄 [🇵🇱 Zobacz wersję po polsku](README_PL.md)

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=cloudcr0w.multi-tier-web-app)

This project is a portfolio application showcasing a multi-tier architecture on AWS:

- Backend: **Node.js** & **Express** on **EC2**
- Database: **MySQL on RDS**
- Frontend: **Static website** on **S3 + CloudFront**
- Domain: **Route 53 + SSL via ACM**
- IaC: **CloudFormation**
- Monitoring: **CloudWatch + SNS**
- Custom domain: [https://crow-project.click](https://crow-project.click)

---

## 🚀 Features

- ✅ RESTful API (Express)
- ✅ MySQL on AWS RDS
- ✅ Static frontend on S3 with CloudFront
- ✅ SSL certificate (HTTPS)
- ✅ Visitor tracking with API Gateway + Lambda
- ✅ Dockerized backend
- ✅ CloudWatch alarms & dashboard
- 🛠️ Planned: CI/CD, WAF, ECS/EKS, Secrets Manager

---

## 📊 Architecture Diagram *(coming soon)*

![Architecture](./diagram-projekt.png)

---

## 📦 Infrastructure as Code

Includes **CloudFormation** templates for:

- EC2 alarm + SNS: `cpu-alarm.yml`
- Frontend CDN: `cloudfront-distribution.yml`
- Demo S3 site: `demo-infra.yml`
- Visitor tracker (API Gateway + Lambda): `visit-tracker.yml`

---

## 📈 Monitoring & Observability

CloudWatch Dashboard includes:

- EC2 CPU usage
- API response times (`MultiTierApp/ResponseTime`)
- Lambda `trackVisit` metrics:
  - Invocations
  - Errors
  - Duration
- API Gateway metrics:
  - 5XX Errors
  - Latency
  - Count
- SNS alerts for CPU spikes
<!-- screenshots from cloudwatch would be available soon  -->
<!-- Defined in [`cloudwatch-dashboard.yml`](infrastructure/cloudformation/cloudwatch-dashboard.yml) -->

<!-- > Example view:
> ![CloudWatch Dashboard Preview](./dashboard-preview.png) -->


## 🐳 Docker

```bash
docker build -t my-backend-app .
docker run -p 3000:3000 my-backend-app
```

Then visit: http://localhost:3000


## 🌐 Live Demo
Website: https://crow-project.click
Try it: Contact form submits data to RDS via backend API.

##🔧 AWS Services Used

EC2 – Backend hosting

S3 – Static frontend

CloudFront – CDN for frontend

Route 53 – DNS & domain

RDS – MySQL DB

ACM – SSL certificates

API Gateway + Lambda – Visitor tracking

CloudWatch + SNS – Metrics, alerts

CloudFormation – Infrastructure as Code

## 🤖 AI Chatbot

Integrated **AI chatbot** on the frontend – deployed via **AWS Lambda + API Gateway** with **Bedrock Claude** model.  

- Responds to questions about my skills and projects  
- Dynamically styled chat window with animations  
- Input always visible & auto-scroll for messages  
- Security features: request normalization, blocklist, CORS, API Gateway throttling  

👉 Try it live: [https://crow-project.click](https://crow-project.click)  


## 📌 What's Next?
See FUTURE_PLANS.md for upcoming improvements:

Auto Scaling, ALB

GitHub Actions (CI/CD)

ECS or EKS deployment

WAF rule sets

Secrets Manager or Parameter Store

## 🧠 Project Goals
Showcase AWS multi-tier design

Demonstrate backend + infrastructure skills

Emphasize real integrations with IaC, monitoring, and SSL

---

## 🍃 About the Author

**Adam Wrona** – aspiring DevOps Engineer passionate about building cloud-native solutions with **AWS**, **Terraform**, and real-world automation.  
Certified in AWS, fueled by coffee, and building hands-on projects to break into IT from scratch.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Adam%20Wrona-blue?logo=linkedin&style=flat-square)](https://www.linkedin.com/in/adam-wrona-111ba728b/)  
🌍 [GitHub – @cloudcr0w](https://github.com/cloudcr0w)  
📫 adamwronowy@gmail.com

---

> ☁️ *"You can’t learn DevOps from videos — only from fixing what breaks at 2AM."*  
> — someone who ran `terraform apply` in prod
