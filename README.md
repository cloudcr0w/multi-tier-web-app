# Multi-Tier Web Application

This project is a portfolio application designed to showcase a multi-tier architecture on AWS. The backend is built with **Node.js** and **Express**, the database runs on **AWS RDS (MySQL)**, and the frontend is a static website hosted on **S3** and distributed through **CloudFront**. A custom domain is managed via **Route 53**, and SSL certificates are provided by **AWS Certificate Manager (ACM)**.

---

## Features

- **Backend**  
  RESTful API built with Node.js and Express.
  
- **Database**  
  MySQL database hosted on AWS RDS.

- **Frontend**  
  Static website hosted on AWS S3, served through CloudFront for global distribution.

- **Domain**  
  Custom domain integrated with Route 53 for DNS management.

- **CDN**  
  CloudFront used for fast and secure content delivery.

- **Security**  
  End-to-end encryption with SSL certificates from AWS ACM.

- :construction: **AWS WAF**, **AWS CloudFormation**, **GitHub Actions / AWS CodePipeline** (planned integrations)

---

## Architecture Diagram

![Architecture Diagram](./diagram.jpg)

### Frontend

- Hosted on **AWS S3** as a static website.
- Distributed globally using **CloudFront** for faster loading times.

### Backend

- RESTful API powered by **Express.js**.
- Hosted on an **AWS EC2** instance.
- Communicates with **AWS RDS** for data storage.

### Database

- **MySQL** database on **AWS RDS**.
- Configured for secure and reliable data management.

### Security

- All traffic encrypted using **SSL certificates** (AWS ACM).
- API endpoint served over **HTTPS** for secure communication.

---

## Services Used

- **AWS EC2** – Hosting the backend application
- **AWS S3** – Storing and serving static assets for the frontend
- **AWS CloudFront** – Content Delivery Network for fast, global access
- **AWS Route 53** – Domain registration and DNS management
- **AWS RDS** (MySQL) – Managed relational database service
- **AWS ACM** – SSL certificate for secure HTTPS connections
- :construction: **AWS CloudWatch** – Monitoring and high availability (planned)
- :construction: **AWS KMS** – Encryption for data at rest (planned)
- **GitHub** – Version control and collaboration

---

## Usage

1. **Visit the Website**  
   The application is live at [https://crow-project.click](https://crow-project.click).

2. **Try the Contact Form**  
   Submit a message through the form, which will be securely stored in the MySQL database.

3. **Explore the Code**  
   Browse this repository for a deeper look into the Node.js/Express backend, database setup, and infrastructure components.

4. ## CloudFormation Demo

As part of demonstrating Infrastructure as Code (IaC), this repository includes a simple CloudFormation template:

- **Location**: [`infrastructure/cloudformation/demo-infra.yml`](infrastructure/cloudformation/demo-infra.yml)  
- **Purpose**: Creates a demo S3 bucket for hosting static content.

### How to Deploy

1. Make sure you have the AWS CLI installed and configured.  
2. Run the following command from the project's root directory:

```bash
aws cloudformation create-stack \
  --stack-name demo-infra-stack \
  --template-body file://infrastructure/cloudformation/demo-infra.yml \
  --capabilities CAPABILITY_NAMED_IAM 
  ```
3. Wait for the stack to reach the CREATE_COMPLETE status (check in AWS Console or via CLI).
You can then verify that the bucket is created in your AWS S3 console.
If you want to remove the bucket afterward, delete the stack:

```bash
aws cloudformation delete-stack --stack-name demo-infra-stack
```

## Project Goals

- **Demonstrate a Multi-Tier Architecture**  
  Show how various AWS services integrate to create a secure and scalable web application.

- **Highlight Cloud & Backend Skills**  
  Emphasize experience in Node.js, AWS services, and cloud-based deployments.

- **End-to-End Integration**  
  Illustrate how a custom domain, SSL, CDN, and database come together for a production-ready setup.

---

This project demonstrates my ability to design, build, and deploy cloud-based applications. It serves as a comprehensive showcase of my skills in **cloud computing**, **backend development**, and **AWS services**.
