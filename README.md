# SankirtanHub — Devotional Artist & Event Services Platform

SankirtanHub is a web platform for discovering devotional artists and event service providers for spiritual and cultural events across India.

Users can explore singers, musicians, sound providers, and other devotional event services, view artist profiles, submit booking requests, and contact SankirtanHub through a responsive web interface.

## Features

* **Home Page** — Hero search, service categories, featured artists, and booking-focused sections
* **Artist Listings** — Browse singers, musicians, and sound providers with search, filtering, sorting, and pagination
* **Artist Profiles** — Detailed artist information, images, experience, specialties, ratings, location, and booking options
* **Booking Requests** — Logged-in users can submit event and contact details to request a booking
* **Authentication** — User sign-up, sign-in, password validation, and protected user features
* **Favorites** — Save artists for quick access
* **User Dashboard** — View profile information and submitted booking requests
* **Contact Us** — Visitors can send inquiries directly to the SankirtanHub team
* **Responsive Design** — Optimized for desktop, tablet, and mobile devices
* **Privacy & Terms Pages** — Dedicated Privacy Policy and Terms of Service pages
* **Responsive Modals & Forms** — Booking, contact, validation, loading, and success/error feedback
* **Devotional UI Theme** — Warm saffron, cream, white, and gold visual design

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Lucide React

### Application Services

* Supabase Authentication
* EmailJS for booking and contact email delivery

### Development Tools

* ESLint
* npm
* Git & GitHub

## Project Structure

```text
SankirtanHub/
├── public/
│   ├── artists/
│   ├── musicians/
│   ├── sounds/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── shared/
│   │   │   ├── ArtistCard.tsx
│   │   │   ├── ArtistListingPage.tsx
│   │   │   └── ScrollToTop.tsx
│   │   └── ui/
│   │       ├── Modal.tsx
│   │       ├── Pagination.tsx
│   │       ├── Rating.tsx
│   │       └── Spinner.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── data/
│   │   └── sampleData.ts
│   │
│   ├── hooks/
│   │   ├── useAsync.ts
│   │   └── useFavorites.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── localApi.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── ArtistDetails.tsx
│   │   ├── Contact.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Musicians.tsx
│   │   ├── NotFound.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── Register.tsx
│   │   ├── Singers.tsx
│   │   ├── SoundProviders.tsx
│   │   └── TermsOfService.tsx
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── supabase/
│   └── migrations/
│
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

* Node.js 18+
* npm
* Git

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/SankirtanHub.git
cd SankirtanHub
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local Vite development URL.

## Environment Variables

Create a `.env` file in the project root and provide the required environment variables.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Do not commit `.env` or other files containing private credentials to GitHub.

## Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

SankirtanHub can be deployed using modern frontend hosting platforms such as Vercel or Netlify.

Typical deployment configuration:

```text
Build Command: npm run build
Output Directory: dist
```

The required environment variables must also be configured in the hosting provider's project settings.

## Booking & Contact Flow

### Booking

1. User browses available artists
2. User opens an artist profile
3. User selects the booking option
4. User provides event and contact details
5. Booking request is submitted
6. SankirtanHub receives the booking request by email
7. The user receives booking updates through the confirmation process

### Contact

The Contact Us form is available to both authenticated and unauthenticated visitors.

Visitors can submit:

* Name
* Email
* Phone
* Subject
* Message

Contact messages are delivered to the SankirtanHub team through the configured email service.

## Responsive Design

The application is designed and tested across:

* Desktop
* Tablet
* Mobile
* iPhone-sized viewport layouts

Special attention is given to responsive navigation, forms, cards, modals, dashboards, and artist profile pages.

## Development Workflow

```bash
npm run dev
```

Use the development server while making changes.

Before deployment:

```bash
npm run build
npm run preview
```

This helps verify the production build before publishing changes.

## License

© 2026 SankirtanHub. All rights reserved.
