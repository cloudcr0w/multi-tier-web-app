# 🤖 Chatbot – Portfolio Assistant

This chatbot is part of my **multi-tier web app portfolio**.  
It integrates a custom frontend widget with an AWS Lambda backend that connects to **AWS Bedrock (Claude)** to provide short, natural answers about my professional skills and projects.

---

## 🎯 Purpose
- Make my portfolio site **interactive** – visitors can ask about my AWS/DevOps projects.  
- Practice building **serverless, AI-powered applications** on AWS.  
- Learn how to control **costs, security and reliability** in a real-world AI integration.

---

## 🏗️ Architecture
- **Frontend**:  
  - Custom HTML/CSS/JS chat widget.  
  - Input validation, typing indicator, inactivity auto-collapse.  

- **Backend**:  
  - **AWS API Gateway** → **Lambda (`chatbot.py`)** → **Bedrock Runtime (Claude)**.  
  - Rate limiting stored in **DynamoDB** (per-IP counters).  
  - Secrets and system prompt stored in **AWS Secrets Manager**.  

---

## 🔒 Security & Cost Controls
To avoid abuse and unexpected costs, several safeguards were added:

- **Frontend**:
  - Input limited to **300 characters**.  
  - **Cooldown (2 seconds)** between requests to block spam.  
  - Warnings for too long questions or repeated sends.  

- **Lambda / Backend**:
  - **Rate limiting**: max 12 requests / 60 seconds per IP (stored in DynamoDB).  
  - **Blocklist** for offensive input.  
  - **Max input length** enforced server-side.  
  - **Bedrock config**:  
    - `max_tokens=20` (short answers only).  
    - `stop_sequences=[".", "?", "!"]` to cut answers at first sentence.  
    - `temperature=0.2` for concise replies.  
  - **Output cap**: force reply ≤ 30 characters, max 2 sentences.  
  - Strict **system prompt**: answers only about Adam’s skills, projects, and certifications.  

- **AWS Infrastructure**:
  - **Secrets Manager** → API keys and system prompt not exposed.  
  - **CloudWatch logs** for monitoring usage.  
  - **AWS Budgets** to track monthly spend.  

---

## 💰 Cost Awareness
- Default Bedrock settings can generate long outputs → costly.  
- With limits applied (20 tokens, 300 char input, per-IP throttling), cost is predictable and safe for a public portfolio site.  
- RDS originally tested for the contact form was replaced with lighter solutions to avoid unnecessary baseline cost.

---

## 📚 Lessons Learned
- AI integrations need **strict guardrails** to be production-ready.  
- Cost optimization is as important as functionality.  
- Frontend + backend both need validation to prevent misuse.  
- Bedrock is powerful, but without `max_tokens` and stop sequences, it may output essays that burn through credits.

---

## 🚀 Next Steps
- Add **caching** for common questions (e.g., “Who is Adam?”).  
- Optional **SES integration** for direct contact via email.  
- More polished UI (gradients, animations, dark/light theme).  

---

_This project is part of my DevOps & Cloud portfolio – demonstrating AWS Bedrock, Lambda, API Gateway, DynamoDB, and cost-aware design._
