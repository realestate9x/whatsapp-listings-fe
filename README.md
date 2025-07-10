# Real Estate Frontend Application

A modern, responsive real estate web application built with React, TypeScript, and Supabase for property management and discovery.

## Features

- 🏠 **Property Management**: Browse and manage real estate listings
- 🔐 **Authentication**: Secure user authentication with Supabase
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Beautiful interface using shadcn/ui components
- ⚡ **Fast Performance**: Built with Vite for optimal development and build performance

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone <YOUR_GIT_URL>
cd realestate-fe
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Tech Stack

This project is built with modern technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS for utility-first styling
- **Backend**: Supabase for authentication and database
- **State Management**: React Context API
- **Routing**: React Router for navigation
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Layout.tsx      # Main layout wrapper
│   └── AppSidebar.tsx  # Application sidebar
├── contexts/           # React context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase configuration
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   └── NotFound.tsx    # 404 error page
└── services/           # API service functions
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Deployment

The application can be deployed to various platforms:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your Git repository
- **Supabase**: Use Supabase hosting
- **GitHub Pages**: Configure GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
