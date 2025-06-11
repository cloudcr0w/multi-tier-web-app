# 🛠️ Future Plans for Multi-Tier Web Application

## CI/CD
- GitHub Actions or AWS CodePipeline for automatic deployments

## Security Enhancements
- Store secrets in AWS Secrets Manager / SSM Parameter Store
- Extend AWS WAF rules for better threat mitigation

## Scaling and High Availability
- Add ALB + Auto Scaling Group for backend
- Migrate containers to ECS Fargate or Amazon EKS

## Monitoring
- Add memory/disk usage to CloudWatch Dashboard
- Track 5xx errors and API latency
- Include API Gateway metrics

## Visitor Tracking
- New Lambda + API Gateway stack for tracking visits (`visit-tracker.yml`)
- Add DynamoDB storage for analytics
- Dashboard for visit metrics

---

> These additions will make the project more production-ready and robust.