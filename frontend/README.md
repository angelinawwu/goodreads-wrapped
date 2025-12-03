# Goodreads Wrapped - Next.js Frontend

A story-inspired interface for visualizing your Goodreads reading year, built with Next.js 16.

## Features

- 🎬 14 auto-advancing story slides with smooth animations
- 📱 Mobile-first responsive design (works on desktop too)
- 🎨 Earth-tone color palette with Unbounded display font
- ⌨️ Navigation: Arrow keys, Space bar, or screen taps
- 📊 Interactive charts and personalized reading insights
- 💾 Exportable recap image for social sharing

## Getting Started

### Prerequisites

**The backend server must be running first!**

```bash
# In a separate terminal, start the backend
cd ../backend
npm install
npm start
```

Backend should be running on `http://localhost:3001`

### Running the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

The `.env.local` file should contain:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:3001

# Production (configure in Vercel dashboard)
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Usage

1. **Enter username**: Type your Goodreads username on the landing page
2. **Wait for data**: Loading takes a few minutes as the backend scrapes Goodreads
3. **Navigate slides**:
   - **Mobile**: Tap left/right sides of screen
   - **Desktop**: Click arrow buttons or use ← → keys
   - **Both**: Press Space bar to advance
4. **Auto-advance**: Slides automatically advance 3 seconds after animations complete
5. **Export**: Download your recap image from the final slide

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with fonts
│   ├── globals.css                 # Design system & colors
│   └── wrapped/[username]/
│       ├── page.tsx                # Story viewer route
│       ├── loading.tsx             # Loading state
│       └── error.tsx               # Error boundary
├── components/
│   ├── StoryViewer.tsx             # Main orchestrator
│   ├── ui/                         # Reusable components
│   │   ├── AnimatedCounter.tsx
│   │   ├── Decor.tsx
│   │   ├── Navigation.tsx
│   │   └── ProgressBar.tsx
│   └── slides/                     # 14 story slides
├── hooks/                          # Custom React hooks
├── lib/                            # Utils, types, config, API
└── public/decor/                   # 10 decorative images
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Fonts**: Unbounded (Google Fonts)
- **Export**: html-to-image

## Key Design Decisions

- **Mobile-first**: Touch zones (50% screen width) for navigation
- **Auto-advance**: Pauses for 10s after manual interaction
- **Staged animations**: Text elements reveal sequentially with drift-up effect
- **Color rotation**: Background colors change per slide for visual variety
- **Decor system**: Position-based decorative overlays (top/bottom/corners/center)
