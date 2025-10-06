# Aplikacja wielowarstwowa (Multi-Tier Web Application)

📄 [🇬🇧 Read in English](README.md)

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=cloudcr0w.multi-tier-web-app)
![AWS](https://img.shields.io/badge/Cloud-AWS-FF9900?logo=amazon-aws)
![CI/CD](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?logo=githubactions)

Ten projekt to aplikacja portfolio prezentująca architekturę wielowarstwową w AWS:

- Backend: **Node.js** & **Express** na **EC2** *(wyłączony we wrześniu 2025)*
- Baza danych: **MySQL na RDS** *(usunięta we wrześniu 2025 w ramach optymalizacji kosztów)*
- Frontend: **Statyczna strona** na **S3 + CloudFront**
- Domeny: **Route 53 + SSL (ACM)**
- IaC: **CloudFormation**
- Monitoring: **CloudWatch + SNS**
- Własna domena: [https://crow-project.click](https://crow-project.click)

---

## 🚀 Funkcjonalności

- ✅ RESTful API (Express)
- ✅ MySQL na AWS RDS *(usunięty)*
- ✅ Statyczny frontend na S3 z CloudFront
- ✅ Certyfikat SSL (HTTPS)
- ✅ Śledzenie wizyt z API Gateway + Lambda
- ✅ Backend w kontenerze Docker
- ✅ Alarmy i dashboard CloudWatch
- 🛠️ Planowane: CI/CD, ECS/EKS, Secrets Manager

---

## 💻 Wdrożenie

Na dzień **wrzesień 2025** aplikacja została zoptymalizowana pod kątem kosztów:

- **Frontend** działa na **S3 + CloudFront** (z Route 53 + ACM dla domeny i SSL).
- **Backend i RDS** zostały wyłączone, aby ograniczyć koszty — funkcjonalność ma być odtworzona poprzez usługi serverless (Lambda + SNS/S3 dla formularza kontaktowego).
- **CloudFront** serwuje wszystkie statyczne zasoby i wymusza HTTPS.
- **Domena**: wciąż dostępna 👉 [https://crow-project.click](https://crow-project.click).

---

## 💰 Optymalizacja kosztów

We wrześniu 2025 koszty AWS wzrosły ze względu na instancje **RDS** i **EC2** działające poza Free Tier.  
Aby je zminimalizować:

- ❌ **Usunięto RDS (MySQL)** → planowane zastąpienie rozwiązaniami serverless (S3/DynamoDB/SES).  
- ❌ **Wyłączono backend EC2** → frontend statyczny działa teraz na **S3 + CloudFront**.  
- ❌ **Usunięto WAF** → zbędny dla projektu portfolio.  
- ❌ **Usunięto NAT Gateway** → zastąpiony przez **VPC Endpoints** tam, gdzie potrzebne.  
- ✅ **Pozostawiono Route 53 + ACM** → domena i certyfikat SSL nadal aktywne.  

**Efekt:**  
Miesięczne koszty spadły z ~27 USD → ~3 USD, a aplikacja jest nadal publicznie dostępna.

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

- Użycie CPU na EC2 *(legacy)*
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

### Zrzuty ekranu *(wkrótce)*
![Monitoring Screenshot Placeholder](./monitoring-dashboard.png)

---

## 🖥️ Uruchomienie lokalne

Sklonuj repozytorium i zainstaluj zależności:

```bash
git clone https://github.com/cloudcr0w/multi-tier-web-app.git
cd multi-tier-web-app/frontend
npm install
npm start
```

Domyślnie aplikacja działa pod adresem http://localhost:3000

---

## 🌐 Demo online

Strona: https://crow-project.click  
Obecnie działa statyczny frontend na **S3 + CloudFront**.  
*Trwa migracja backendu formularza kontaktowego do Lambda + S3 + SNS.*

---

## 🤖 Chatbot AI

Zintegrowany chatbot AI na froncie – wdrożony w **AWS Lambda + API Gateway** z modelem **Bedrock Claude**.  

- Odpowiada na pytania o moje umiejętności i projekty  
- Dynamiczne okienko czatu z animacjami  
- Pole input zawsze widoczne na dole + auto-scroll wiadomości  
- Funkcje bezpieczeństwa: normalizacja tekstu, blocklist, CORS, throttling API Gateway  

👉 Demo: [https://crow-project.click](https://crow-project.click)  

---

## 🔮 Co dalej?

Patrz **FUTURE_PLANS.md** dla nadchodzących usprawnień:

- Auto Scaling, ALB
- GitHub Actions (CI/CD)
- ECS lub EKS
- Reguły WAF
- Secrets Manager lub Parameter Store
- Serverless contact form (Lambda + S3 + SNS/SES)

---

## 🧠 Cele projektu

- Pokazanie architektury multi-tier w AWS  
- Demonstracja backendu + umiejętności w obszarze infrastruktury  
- Podkreślenie integracji z IaC, monitoringiem i SSL  
- Wyróżnienie optymalizacji kosztów i praktyk cloud governance  

---

## 🍃 O autorze

**Adam Wrona** – początkujący DevOps Engineer pasjonujący się budowaniem rozwiązań chmurowych z użyciem **AWS**, **Terraform** i automatyzacją w praktyce.  
Certyfikowany w AWS, napędzany kawą ☕ i tworzący projekty hands-on, aby wejść do branży IT od zera.  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Adam%20Wrona-blue?logo=linkedin&style=flat-square)](https://www.linkedin.com/in/adam-wrona-111ba728b/)  
🌍 [GitHub – @cloudcr0w](https://github.com/cloudcr0w)  
📫 adamwronowy@gmail.com  

---

> ☁️ *"DevOpsu nie nauczysz się z filmików — tylko naprawiając to, co padnie o 2 w nocy.”*  
> — ktoś, kto raz odpalił `terraform apply` na produkcji
