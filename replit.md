# Oakline Bank

## Overview

Oakline Bank is a modern, full-stack web banking application built with Next.js and Supabase. The application provides comprehensive banking services including account management, transactions, loans, investments, and crypto trading. It features a mobile-first design with both customer and admin interfaces, implementing secure authentication, real-time notifications, and compliance tracking. The platform is designed for scalability and follows modern banking security standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14.2.3 with React 18.2.0
- **Styling**: CSS Modules with global styles, mobile-first responsive design
- **Pages Structure**: 
  - Customer pages (`/pages/*.js`) for banking operations
  - Admin dashboard (`/pages/admin/*.js`) for management functions
  - API routes (`/pages/api/*.js`) for backend logic
- **Components**: Modular, reusable React components in `/components/`
- **State Management**: React hooks with local state management

### Backend Architecture
- **API Layer**: Next.js API routes providing RESTful endpoints
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with email/password and optional MFA
- **Email Service**: Nodemailer with SMTP (Zoho) for transactional emails
- **Server-side Operations**: Service role key for admin operations

### Database Design
Core tables include:
- **Users**: Authentication, profile, and KYC data
- **Accounts**: Account types, balances, and statuses
- **Transactions**: Transaction history and references
- **Loans**: Loan applications and approvals
- **Investments**: User investment portfolios
- **Crypto**: Cryptocurrency trading data
- **Notifications**: User messages and alerts
- **Audit**: Comprehensive action logging
- **Compliance**: KYC documents and verification

### Security Implementation
- **Data Protection**: Server-side validation, encrypted sensitive data
- **Authentication**: Role-based access control (customer/admin)
- **HTTPS**: Enforced SSL/TLS for all communications
- **Environment Variables**: Secure credential management via Vercel
- **Rate Limiting**: API endpoint protection against abuse

### Business Logic Flow
1. **User Registration**: Application → Email verification → Account creation
2. **Authentication**: Login → Dashboard access based on role
3. **Banking Operations**: Balance checks → Transaction processing → Audit logging
4. **Admin Functions**: User management → Transaction oversight → Compliance reporting

## External Dependencies

### Database & Authentication
- **Supabase**: Primary database, authentication, and real-time features
- **PostgreSQL**: Relational database engine via Supabase

### Email Services
- **Nodemailer**: Email sending library
- **Zoho SMTP**: Email delivery service for transactional emails

### Hosting & Deployment
- **Vercel**: Frontend hosting and serverless functions
- **GitHub**: Source code repository and CI/CD integration

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Next.js**: Full-stack React framework with API routes

### Third-party Integrations
- **Chart.js**: Data visualization for financial charts and analytics
- **Domain Management**: GoDaddy for DNS and domain configuration

### Environment Configuration
- Production deployment via Vercel with environment variables
- SMTP configuration for automated email communications
- Supabase project configuration for database and auth services