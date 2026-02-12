# Real Prop Realty

A modern real estate website built with Next.js, Prisma, and Supabase.

## Features

- Property listings with 360° virtual tours
- Admin dashboard for property management
- Responsive design with dark mode support
- PWA support for mobile devices
- Supabase PostgreSQL database
- Image upload and management

## Environment Variables

Required environment variables:
- `DATABASE_URL` - Supabase database connection (use pooler URL for production)
- `SESSION_SECRET` - Secret key for admin sessions
- `ADMIN_EMAIL` - Admin account email
- `ADMIN_PASSWORD` - Admin account password
- `NEXT_PUBLIC_SITE_URL` - Public site URL

## Deployment

This project is deployed on Vercel with automatic deployments from the main branch.

## Admin Access

Access the admin panel at `/admin/login` with your configured credentials.
