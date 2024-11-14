# Multi-Tier Web Application

This project is a portfolio application built on AWS to demonstrate a multi-tier architecture. 
The backend is built with Node.js and Express, and the application is hosted on AWS infrastructure, including services like EC2, S3, CloudFront, Route 53, and RDS.

## Features:
- **Backend**: Node.js with Express
- **Database**: MySQL on AWS RDS
- **CDN**: CloudFront for content distribution
- **Domain**: Custom domain configured with Route 53
- **SSL**: Secure connection with an SSL certificate from AWS ACM

## Architecture:
- **Frontend**: Static website served from S3 and distributed through CloudFront.
- **Backend**: Express API hosted on an EC2 instance that connects to a MySQL database on AWS RDS.
- **Security**: SSL certificates from AWS ACM for HTTPS support.

## Setup Instructions

### 1. Clone the repository:
```bash
git clone https://github.com/cloudcr0w/multi-tier-web-app.git
cd multi-tier-web-app
