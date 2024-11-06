# Multi-Tier Web Application on AWS

This project is a portfolio piece designed to showcase my skills in building a multi-tier web application deployed on AWS. The project leverages various AWS services such as EC2, S3, Route 53, and a basic database to demonstrate my abilities in cloud architecture, deployment, and full-stack development.

## Project Overview

The goal of this project is to create a simple web application using the multi-tier architecture approach, which includes:

- **Frontend**: HTML, CSS, and JavaScript to provide a responsive user interface.
- **Backend**: Deployed on an EC2 instance to handle business logic.
- **Database**: A basic database (e.g., MySQL) hosted on AWS RDS to store data.
- **Storage**: S3 buckets to store static assets like images and other media.
- **Domain**: Route 53 used for DNS management and linking the custom domain.

## Features

- **Multi-Tier Architecture**: Separating the frontend, backend, and database layers to demonstrate scalable and maintainable architecture.
- **CI/CD Pipeline**: Automated deployment using AWS services like CodePipeline and CodeBuild.
- **Responsive Design**: The web application is fully responsive and designed to work on both desktop and mobile devices.
- **Secure**: Using AWS security features like IAM, VPC, and security groups to ensure a secure environment for the application.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js or Python (depending on your choice)
- **AWS Services**:
  - EC2 (Elastic Compute Cloud)
  - S3 (Simple Storage Service)
  - Route 53
  - RDS (Relational Database Service)
  - IAM (Identity and Access Management)
  - VPC (Virtual Private Cloud)
  - CloudWatch
- **CI/CD**: CodePipeline, CodeBuild

## Getting Started

To set up and deploy this project on your AWS account, follow these steps:

### 1. Clone the Repository
First, clone the repository to your local machine:

git clone https://github.com/cloudcr0w/multi-tier-web-app.git

### 2. Set Up AWS Resources
EC2: Launch an EC2 instance and configure it with the necessary security group to allow HTTP/HTTPS traffic.
RDS: Set up a MySQL or PostgreSQL database on RDS to handle the backend storage.
S3: Create an S3 bucket to store static files like images, stylesheets, and JavaScript files.
Route 53: Set up DNS to point to the application hosted on EC2.
### 3. Set Up CI/CD
Use AWS CodePipeline and CodeBuild for automated deployment. You can set up your pipeline by following AWS documentation to integrate GitHub with these services.

### 4. Deploy the Application
Once all services are set up, you can deploy the application by pushing changes to GitHub, which will automatically trigger the pipeline.

Contact
Feel free to reach out to me if you have any questions or want to connect!

Email: adamwronowy@gmail.com
GitHub: cloudcr0w
LinkedIn: www.linkedin.com/in/adam-wrona-111ba728b
