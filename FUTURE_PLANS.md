# 🛠️ Future Plans for Multi-Tier Web Application

## CI/CD
- GitHub Actions or AWS CodePipeline for automatic deployments
- Add automated tests before deploy
- Include Terraform plan & apply stages
- Notify via Slack on deployment status

## Security Enhancements
- Store secrets in AWS Secrets Manager / SSM Parameter Store
- Extend AWS WAF rules for better threat mitigation
- Store secrets in AWS Secrets Manager / SSM Parameter Store
  - Rotate API keys automatically
  - Use KMS encryption for sensitive values
- Extend AWS WAF rules for better threat mitigation
  - Block common OWASP Top 10 attacks
  - Add rate limiting for API Gateway

## Scaling and High Availability
- Add ALB + Auto Scaling Group for backend
- Migrate containers to ECS Fargate or Amazon EKS

## 🤖 Chatbot MVP
- Frontend UI + AWS Lambda + API Gateway

## Monitoring
- Add memory/disk usage to CloudWatch Dashboard
- Track 5xx errors and API latency
- Include API Gateway metrics

## Visitor Tracking
- New Lambda + API Gateway stack for tracking visits (`visit-tracker.yml`)
- Add DynamoDB storage for analytics
- Dashboard for visit metrics

## 💰 Cost Optimization
- Evaluate DynamoDB on-demand vs provisioned capacity
- Use CloudFront caching policies to reduce Lambda/API Gateway invocations
- Consider Graviton2/3 instances for backend (if re-enabled)

---

> These additions will make the project more production-ready and robust.