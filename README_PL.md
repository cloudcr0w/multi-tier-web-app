# Aplikacja wielowarstwowa (Multi-Tier Web Application)

📄 [🇬🇧 Read in English](README.md)

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=cloudcr0w.multi-tier-web-app)
![AWS](https://img.shields.io/badge/Cloud-AWS-FF9900?logo=amazon-aws)
![CI/CD](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?logo=githubactions)


Ten projekt to aplikacja portfolio prezentująca architekturę wielowarstwową w AWS:

- Backend: **Node.js** & **Express** na **EC2**
- Baza danych: **MySQL na RDS**
- Frontend: **Statyczna strona** na **S3 + CloudFront**
- Domeny: **Route 53 + SSL (ACM)**
- IaC: **CloudFormation**
- Monitoring: **CloudWatch + SNS**
- Własna domena: [https://crow-project.click](https://crow-project.click)

---

## 🚀 Funkcjonalności

- ✅ RESTful API (Express)
- ✅ MySQL na AWS RDS
- ✅ Statyczny frontend na S3 z CloudFront
- ✅ Certyfikat SSL (HTTPS)
- ✅ Śledzenie wizyt z API Gateway + Lambda
- ✅ Backend w kontenerze Docker
- ✅ Alarmy i dashboard CloudWatch
- 🛠️ Planowane: CI/CD, WAF, ECS/EKS, Secrets Manager

---

## 📊 Diagram architektury *(wkrótce)*

![Architecture](./diagram-projekt.png)

---

## 📦 Infrastruktura jako kod

Repozytorium zawiera szablony **CloudFormation**:

- Alarm EC2 + SNS: `cpu-alarm.yml`
- Frontend CDN: `cloudfront-distribution.yml`
- Demo strona na S3: `demo-infra.yml`
- Śledzenie wizyt (API Gateway + Lambda): `visit-tracker.yml`

---

## 📈 Monitoring i obserwowalność

Dashboard w CloudWatch zawiera m.in.:

- Użycie CPU na EC2
- Czas odpowiedzi API (`MultiTierApp/ResponseTime`)
- Metryki Lambdy `trackVisit`:
  - Liczba wywołań
  - Błędy
  - Czas wykonania
- Metryki API Gateway:
  - Błędy 5XX
  - Latencja
  - Liczba requestów
- Alerty SNS dla skoków CPU
<!-- zrzuty ekranu z CloudWatch pojawią się wkrótce  -->
<!-- Zdefiniowane w [`cloudwatch-dashboard.yml`](infrastructure/cloudformation/cloudwatch-dashboard.yml) -->

---

## 🐳 Docker

```bash
docker build -t my-backend-app .
docker run -p 3000:3000 my-backend-app
```

Następnie odwiedź: http://localhost:3000

## 🌐 Demo online

Strona: https://crow-project.click

Wypróbuj: formularz kontaktowy przesyła dane do RDS przez backend API.

## 🔧 Usługi AWS użyte w projekcie

EC2 – hosting backendu

S3 – statyczny frontend

CloudFront – CDN dla frontendu

Route 53 – DNS i domena

RDS – baza danych MySQL

ACM – certyfikaty SSL

API Gateway + Lambda – śledzenie wizyt

CloudWatch + SNS – monitoring i alerty

CloudFormation – Infrastructure as Code

## 🤖 Chatbot AI

Zintegrowany chatbot AI na froncie – wdrożony w AWS Lambda + API Gateway z modelem Bedrock Claude.

Odpowiada na pytania o moje umiejętności i projekty

Dynamiczne okienko czatu z animacjami

Pole input zawsze widoczne na dole + auto-scroll wiadomości

Funkcje bezpieczeństwa: normalizacja tekstu, blocklist, CORS, throttling API Gateway

👉 Demo: https://crow-project.click

## 🔮 Plany rozwoju

 GitHub Actions lub AWS CodePipeline do automatycznych wdrożeń

 Przechowywanie sekretów w AWS Secrets Manager / SSM Parameter Store

 Rozszerzenie reguł AWS WAF dla lepszej ochrony

 Dodanie ALB + Auto Scaling Group dla backendu

 Migracja kontenerów do ECS Fargate lub Amazon EKS

 Ograniczanie zapytań do chatbota w DynamoDB (rate-limiting z TTL)

 Dodanie pamięci/dysku do dashboardu CloudWatch

 Śledzenie błędów 5xx i latencji API

 Rozszerzone śledzenie odwiedzin (DynamoDB + dashboard analityczny)

## 🧠 Cele projektu

Pokazanie architektury multi-tier w AWS

Demonstracja backendu + umiejętności w obszarze infrastruktury

Podkreślenie integracji z IaC, monitoringiem i SSL

🍃 O autorze

**Adam Wrona** – początkujący DevOps Engineer pasjonujący się budowaniem rozwiązań chmurowych z użyciem **AWS**, **Terraform** i automatyzacją w praktyce.
Certyfikowany w AWS, napędzany kawą ☕ i tworzący projekty hands-on, aby wejść do branży IT od zera.


🌍 GitHub – @cloudcr0w

📫 adamwronowy@gmail.com

---

>- *"DevOpsu nie nauczysz się z filmików — tylko naprawiając to, co padnie o 2 w nocy.”*
>- — ktoś, kto raz odpalił terraform apply na produkcji