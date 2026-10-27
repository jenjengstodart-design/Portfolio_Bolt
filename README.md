# Jen Jeng - AI-Powered Portfolio Website

A modern, professional portfolio website for Jen Jeng - Innovation Partner specializing in human-centred, AI-enhanced innovation management and transformation strategy.

## Features

### 🎨 Design System
- **Custom Color Palette**: Clean white design with Spica Red (#E60000) accent
- **Typography**: League Spartan font family from Google Fonts
- **Responsive**: Mobile-first design optimized for all screen sizes
- **Animations**: Smooth Framer Motion animations throughout

### 📄 Pages

1. **Home**: Hero section, services overview, featured projects, approach pillars, and CTA
2. **Services**: Detailed service offerings with related projects
3. **Work**: Portfolio with category filtering (Experience Design, Operating Model Design, AI Discovery, etc.)
4. **Project Detail**: Individual case studies with challenges, approach, and impact
5. **About**: Personal story, skills, certifications, experience, and volunteer work
6. **Contact**: Contact form with inquiry type selection

### 🤖 AI Chat Widget
- Floating chat button in bottom-right corner
- Stores conversations in Supabase database
- Tracks popular questions and analytics
- Ready for Anthropic Claude API integration

### 💾 Content Management
- All content stored in JSON files in `/src/content/`
- Easy to edit without touching code:
  - `profile.json` - Personal information and career details
  - `skills.json` - Skills and certifications
  - `experience.json` - Work history and volunteer work
  - `projects.json` - Detailed project case studies
  - `services.json` - Service offerings
  - `faq.json` - Pre-written answers and AI behavior rules

### 🗄️ Database (Supabase)
- **chat_conversations**: Stores chat sessions
- **chat_messages**: Individual messages within conversations
- **popular_questions**: Tracks frequently asked questions
- **analytics_events**: User interaction tracking

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`:
   - `VITE_SUPABASE_URL` - Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Customization Guide

### Updating Content

All content is stored in JSON files under `/src/content/`. Simply edit these files to update:

- **Profile Information**: Edit `profile.json`
- **Skills & Certifications**: Edit `skills.json`
- **Work Experience**: Edit `experience.json`
- **Project Case Studies**: Edit `projects.json`
- **Services**: Edit `services.json`
- **FAQ & AI Behavior**: Edit `faq.json`

### Adding Project Images

1. Add images to `/public/images/projects/`
2. Update the `image` field in `projects.json` with the path
3. Images should be optimized for web (recommended: 1200x800px)

### Enabling AI Chat

The AI chat widget is fully implemented and ready to use. To enable it:

The chat widget posts to `/api/chat`, a Cloudflare Pages Function that lives in
`functions/api/chat.ts` and ships with the site. The Anthropic key stays on the
server and never reaches the browser.

#### Step 1: Get an Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Open "API Keys" and create one

#### Step 2: Add it to Cloudflare Pages

Cloudflare dashboard → Workers & Pages → `jenjeng-portfolio` → Settings →
Environment variables. Add `ANTHROPIC_API_KEY` for Production (and Preview if
you want previews to work), then redeploy so the new value is picked up.

Never put this key in `.env` or anything prefixed `VITE_`. Vite inlines every
`VITE_*` variable into the public bundle, so that would publish the key.

#### Step 3: Run it locally

```bash
npm run build
npx wrangler pages dev dist --binding ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Full detail, including rate limiting, is in `AI_CHAT_SETUP.md`.

### Customizing Colors

Edit `/tailwind.config.js` to change the color scheme:
```js
colors: {
  'accent-red': '#E60000',  // Primary CTA color
  'accent-red-dark': '#CC0000',  // Hover state
  // ... other colors
}
```

### Customizing Fonts

Edit `/src/index.css` to change the font:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@400;500;600;700&display=swap');
```

Then update `tailwind.config.js`:
```js
fontFamily: {
  primary: ['Your Font', 'sans-serif'],
}
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Database**: Supabase
- **AI**: Anthropic Claude (optional)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ChatWidget.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── Work.tsx
│   ├── ProjectDetail.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── content/            # JSON content files
│   ├── profile.json
│   ├── skills.json
│   ├── experience.json
│   ├── projects.json
│   ├── services.json
│   └── faq.json
├── lib/                # Utilities
│   └── supabase.ts
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features Highlights

### Hybrid Content Approach
- **Static Content**: Easily editable JSON files for all portfolio content
- **Dynamic Features**: AI chat and analytics powered by Supabase

### Professional Design
- Clean, modern aesthetic with generous whitespace
- Consistent design system with custom components
- Smooth animations and micro-interactions
- Fully responsive across all devices

### Performance Optimized
- Code splitting by route
- Optimized asset loading
- Production build under 530KB

### SEO Ready
- Semantic HTML structure
- Proper heading hierarchy
- Meta tags for social sharing

## Support & Maintenance

### Updating Projects
1. Edit `/src/content/projects.json`
2. Add new project objects with all required fields
3. Set `featured: true` for homepage display

### Tracking Analytics
View analytics in Supabase:
- Chat conversations and messages
- Popular questions
- Page views and interactions

### Adding New Services
1. Edit `/src/content/services.json`
2. Add service object with all fields
3. Link related projects by project ID

## License

This project is proprietary and confidential.

## Recent Changes

See [CHANGELOG.md](./CHANGELOG.md) for detailed change history.

## Contact

For questions or support, contact Jen Jeng:
- LinkedIn: https://www.linkedin.com/in/jenjeng/
- Email: jen.jengstodart@gmail.com
