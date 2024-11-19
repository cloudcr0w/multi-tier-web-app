# Multi-Tier Web Application

This project is a portfolio application designed to showcase a multi-tier architecture using AWS. The backend is built with Node.js and Express, and the entire application is deployed on AWS Cloud Infrastructure, utilizing services like EC2, S3, CloudFront, Route 53, and RDS.

## Features

- **Backend**: RESTful API built with Node.js and Express.
- **Database**: MySQL database hosted on AWS RDS.
- **Frontend**: Static website hosted on S3 and served through CloudFront.
- **Domain**: Custom domain integrated with Route 53 for DNS management.
- **CDN**: CloudFront for fast and secure content delivery.
- **Security**: End-to-end encryption with SSL certificates provided by AWS Certificate Manager (ACM).

## Architecture

### Frontend

- Hosted on AWS S3 as a static website.
- Distributed globally using AWS CloudFront for faster loading times.

### Backend

- RESTful API built with Express.js.
- Hosted on an AWS EC2 instance.
- Communicates with AWS RDS for data storage.

### Database

- MySQL relational database hosted on AWS RDS.
- Configured for secure and reliable data management.

### Security

- All traffic is encrypted using SSL certificates issued by AWS ACM.
- API endpoint is served over HTTPS to ensure secure communication.

## Services Used

- **AWS EC2**: Hosting the backend application.
- **AWS S3**: Storing and serving static assets for the frontend.
- **AWS CloudFront**: Content Delivery Network for fast and secure access.
- **AWS Route 53**: Domain registration and DNS management.
- **AWS RDS**: Managed MySQL database service.
- **AWS ACM**: SSL certificate for secure HTTPS connections.
- **GitHub**: Version control and collaboration.

## Usage

1. **Visit the Website**: The application is live at [https://crow-project.click](https://crow-project.click).
2. **Try the Contact Form**: Submit a message, and it will be stored securely in the MySQL database.
3. **Explore the Code**: Browse the source code in this repository to understand the implementation.

## Project Goals

- Demonstrate a multi-tier architecture with AWS services.
- Highlight skills in cloud development, backend programming, and infrastructure deployment.
- Showcase integration of various AWS services for a fully functional web application.

---

This project highlights my ability to design and deploy cloud-based web applications and serves as a showcase of my skills in cloud computing, backend development, and AWS services.
