# CRM Client v2

Modern CRM Client built with React 19, TypeScript, Redux Toolkit, and Tailwind CSS 4.

## Tech Stack

- **React 19** - Latest React with improved performance
- **TypeScript** - Type safety and better developer experience
- **Redux Toolkit** - State management with RTK Query
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Axios** - HTTP client

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your API base URL

4. Start development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── layout/     # Layout components
│   ├── modules/    # Feature-specific components
│   └── ui/         # shadcn/ui components
├── pages/          # Page components
├── redux/          # Redux store and slices
├── routes/         # Route configuration
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
└── constants/      # Application constants
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

Private
