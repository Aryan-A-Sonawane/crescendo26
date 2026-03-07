# CRESCENDO'26 - Landing Page

Welcome to the CRESCENDO'26 website project! This is the landing page for our inter-college cultural fest.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main landing page
│   └── globals.css       # Global styles
├── components/
│   ├── Navbar.tsx        # Navigation bar component
│   ├── Hero.tsx          # Hero section component
│   ├── About.tsx         # About Crescendo section
│   ├── Events.tsx        # Events showcase section
│   ├── FAQs.tsx          # FAQs accordion section
│   └── Footer.tsx        # Footer component
└── public/               # Static assets
```

## 👥 Component Assignments

Each team member can work on their assigned component independently:

### 1. Navbar Component (`components/Navbar.tsx`)
**Features:**
- Responsive navigation menu
- Mobile hamburger menu
- Smooth scroll links
- Register button

**Tasks:**
- [ ] Add logo/brand image
- [ ] Customize colors and styling
- [ ] Add sticky scroll behavior
- [ ] Test mobile responsiveness

### 2. Hero Section (`components/Hero.tsx`)
**Features:**
- Eye-catching headline
- Event date and venue info
- CTA buttons
- Statistics display

**Tasks:**
- [ ] Update dates and venue
- [ ] Add background image/gradient
- [ ] Update statistics
- [ ] Add animations

### 3. About Section (`components/About.tsx`)
**Features:**
- Festival description
- Feature highlights
- Grid layout with icons

**Tasks:**
- [ ] Update content and description
- [ ] Add real images
- [ ] Customize feature cards
- [ ] Add animations on scroll

### 4. Events Section (`components/Events.tsx`)
**Features:**
- Category tabs (Music, Dance, Drama, Literary)
- Event cards with details
- Responsive grid layout

**Tasks:**
- [ ] Add more event categories
- [ ] Update event details
- [ ] Add event images
- [ ] Create event detail pages

### 5. FAQs Section (`components/FAQs.tsx`)
**Features:**
- Accordion-style FAQ items
- Smooth expand/collapse
- Contact CTA

**Tasks:**
- [ ] Add more FAQs
- [ ] Update answers with real info
- [ ] Style improvements
- [ ] Add search functionality (optional)

### 6. Footer (`components/Footer.tsx`)
**Features:**
- Multi-column layout
- Social media links
- Contact information
- Quick links

**Tasks:**
- [ ] Update contact details
- [ ] Add real social media links
- [ ] Update event list
- [ ] Add newsletter signup (optional)

## 🎨 Customization Guide

### Colors
The site uses a purple theme. Main colors:
- Primary: `purple-600` (#9333EA)
- Secondary: `pink-600` (#DB2777)
- Accent: Various purple/pink gradients

To change colors, update Tailwind classes throughout components.

### Fonts
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To change fonts:
1. Update font imports in `app/layout.tsx`
2. Modify font variables

### Content
Update content directly in each component file. Look for text strings and replace with actual Crescendo information.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Development Workflow

1. **Pick your component** from the assignments above
2. **Create a new branch**: `git checkout -b feature/your-component-name`
3. **Make your changes** to your assigned component
4. **Test locally**: Run `npm run dev` and check your changes
5. **Commit your work**: `git commit -m "Update [Component]: description"`
6. **Push and create PR**: `git push origin feature/your-component-name`

## 🎯 Best Practices

- Keep components modular and reusable
- Use Tailwind CSS for styling
- Ensure mobile responsiveness
- Test across different browsers
- Comment complex logic
- Follow the existing code structure

## 🚧 Next Steps

- [ ] Add registration form
- [ ] Create event detail pages
- [ ] Add image gallery
- [ ] Integrate backend API
- [ ] Add animations (Framer Motion)
- [ ] Implement dark mode
- [ ] Add sponsors section
- [ ] Create team/organizers page

## 📞 Need Help?

If you have questions or run into issues:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check out [the Next.js GitHub repository](https://github.com/vercel/next.js)
- Reach out to the project lead
- Create an issue in the repository

## 🌟 Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Hooks** - State management

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Happy Coding! Let's make CRESCENDO'26 amazing! 🎉**

