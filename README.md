# Education Glory - University & Institute Listing Platform

A bilingual (Arabic/English) university listing and application platform built with Next.js, Prisma (MongoDB), TailwindCSS, and Cloudinary.

## Features

- **Bilingual Support**: Full Arabic (RTL) and English support with language switcher
- **University Types**: Support for Private (جامعات خاصة), Foreign (جامعات أجنبية), and Government (جامعات حكومية) universities
- **Public Site**: Browse universities/institutes, view details, and submit applications
- **Admin Dashboard**: Manage universities, specializations, and view applications
- **Rich Text Editor**: TipTap editor for university content
- **Image Upload**: Cloudinary integration for image management
- **Rate Limiting**: Protection against application spam
- **CSV Export**: Export applications data

## Tech Stack

- Next.js 15 (App Router)
- Prisma 6 with MongoDB
- TailwindCSS
- Cloudinary
- TipTap Editor
- JWT Authentication

## Environment Variables

Create a `.env` file with the following variables:

\`\`\`env
# Database - MongoDB connection string
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"

# Authentication - Secret key for JWT tokens (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Admin Seed Password - Password for the default admin user created during seeding
ADMIN_SEED_PASSWORD="admin123"

# Cloudinary - Image upload service credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_SECRET="your-api-secret"
\`\`\`

## Setup Instructions

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set environment variables**
   Copy `.env.example` to `.env` and fill in your values.

3. **Generate Prisma client**
   \`\`\`bash
   npx prisma generate
   \`\`\`

4. **Push database schema**
   \`\`\`bash
   npx prisma db push
   \`\`\`

5. **Seed the database**
   \`\`\`bash
   npm run seed
   \`\`\`

6. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Default Admin Credentials

- Email: admin@edupath.com
- Password: admin123 (or ADMIN_SEED_PASSWORD if set)

## University Types

Universities are categorized into three types:
- **جامعات خاصة (Private Universities)**: Privately funded institutions
- **جامعات أجنبية (Foreign Universities)**: International university branches
- **جامعات حكومية (Government Universities)**: Public/state universities

Institutes are a separate category without sub-types.

## Project Structure

\`\`\`
├── app/
│   ├── [lang]/           # Localized public pages (ar/en)
│   ├── admin/            # Admin dashboard
│   └── api/              # API routes
├── components/
│   ├── admin/            # Admin components
│   └── ui/               # UI components (shadcn)
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication utilities
│   ├── i18n.ts           # Internationalization
│   └── validation.ts     # Zod schemas
├── locales/              # Translation files (ar.json, en.json)
├── prisma/
│   └── schema.prisma     # Database schema
└── scripts/
    └── seed.tsx          # Database seed script
\`\`\`

## API Endpoints

### Public
- `GET /api/universities` - List all universities
- `POST /api/applications` - Submit application

### Protected (Admin)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/universities` - Create university
- `PUT /api/universities/[id]` - Update university
- `DELETE /api/universities/[id]` - Delete university
- `POST /api/universities/[id]/specializations` - Add specialization
- `PUT /api/specializations/[id]` - Update specialization
- `DELETE /api/specializations/[id]` - Delete specialization
- `GET /api/applications` - List applications
- `GET /api/applications/export` - Export CSV
- `POST /api/upload` - Upload image to Cloudinary

## Color Scheme

- Primary: #032848 (Dark Blue)
- Secondary: #1d97c1 (Cyan)
- Background: #fbf9ed (Cream)

## Deployment (Vercel)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
