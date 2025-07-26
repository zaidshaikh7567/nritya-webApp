# Nritya WebApp - Next.js Migration

This project has been migrated from Create React App to Next.js 13+ with Server-Side Rendering (SSR) for the landing page and Client-Side Rendering (CSR) for the rest of the application.

## Architecture

### SSR (Server-Side Rendering)
- **Landing Page** (`/`): Rendered on the server for better SEO and initial load performance
- Uses React Server Components (RSC) with Next.js 13+ App Router
- Custom card sliders and modern UI built from scratch
- Real images from the assets folder

### CSR (Client-Side Rendering)
- **All other routes**: Rendered on the client for dynamic functionality
- Uses existing React components with dynamic imports
- Maintains the same header and footer across both SSR and CSR

## File Structure

```
app/
├── layout.js              # Root layout with providers
├── page.js                # SSR Landing page
├── providers.js           # Redux and context providers
├── globals.css           # Global styles
├── components/
│   ├── LandingPage.js    # SSR Landing page component
│   ├── ClientHeader.js   # Client-side header wrapper
│   └── ClientFooter.js   # Client-side footer wrapper
├── (csr)/                # Client-side routes group
│   ├── layout.js         # CSR layout
│   ├── search/[entity]/page.js
│   ├── studio/[studioId]/page.js
│   ├── workshop/[entityId]/page.js
│   └── login/page.js
└── api/                  # API routes
    └── placeholder/[...params]/route.js

src/                      # Existing React components (CSR)
├── Components/
├── Screens/
├── context/
├── redux/
└── ...
```

## Key Features

### Landing Page (SSR)
- **Hero Section**: Gradient background with call-to-action buttons
- **Dance Forms**: Interactive cards with icons and hover effects
- **Featured Studios**: Card slider with studio information
- **Featured Workshops**: Card slider with workshop details
- **Call to Action**: Bottom section encouraging user engagement

### Custom Components
- **CardSlider**: Reusable component for displaying card collections
- **StudioCard**: Displays studio information with ratings and dance forms
- **WorkshopCard**: Shows workshop details with instructor and pricing
- **DanceFormCard**: Interactive dance form selection cards

### Styling
- Uses Material-UI components for consistent design
- Responsive grid layout
- Hover animations and transitions
- Color-coded dance forms with icons

## Development

### Running the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## Migration Notes

1. **Next.js Configuration**: Updated `next.config.js` for image optimization and static assets
2. **Package.json**: Updated scripts and dependencies for Next.js
3. **Routing**: Implemented hybrid routing with SSR for landing page and CSR for other routes
4. **Assets**: Moved images to `public/assets/images/` for proper serving
5. **Providers**: Wrapped existing Redux and context providers for Next.js compatibility

## Benefits

- **SEO**: Landing page is server-rendered for better search engine optimization
- **Performance**: Faster initial page load for the landing page
- **User Experience**: Maintains interactive functionality for other pages
- **Maintainability**: Clear separation between SSR and CSR components
- **Scalability**: Easy to add more SSR pages in the future

## Future Enhancements

- Add more SSR pages for better SEO
- Implement data fetching on the server for dynamic content
- Add caching strategies for better performance
- Implement progressive web app features 