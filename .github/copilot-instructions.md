# Crescendo'2026 - The Indian Odyssey
## Design System & Development Guidelines

---

## 🎨 Theme Overview

**Event:** Crescendo'2026 - Intercollege Technical, Cultural & Sports Fest  
**Theme:** "The Indian Odyssey"  
**Design Philosophy:** Celebrate India's rich cultural heritage through vibrant colors, traditional patterns, and authentic Indian design elements.

---

## 📝 Typography

### Primary Fonts

1. **Nishtha (निष्ठा)**
   - **Usage:** Headings, titles, decorative text
   - **Source:** Google Fonts
   - **Import:** `@import url('https://fonts.googleapis.com/css2?family=Nishtha:wght@400;500;600;700&display=swap');`
   - **CSS Variable:** `--font-nishtha`
   - **Description:** Traditional Indian font with decorative Devanagari-inspired styling

2. **Poppins**
   - **Usage:** Body text, navigation, buttons
   - **Source:** Google Fonts
   - **Import:** `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`
   - **CSS Variable:** `--font-poppins`
   - **Description:** Clean, modern sans-serif for readability

3. **Cinzel Decorative**
   - **Usage:** Special headings, event titles
   - **Source:** Google Fonts
   - **Import:** `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');`
   - **CSS Variable:** `--font-cinzel`
   - **Description:** Elegant decorative font for premium feel

---

## 🎨 Color Palette

### Primary Colors

```css
--primary-maroon: #8B1538;        /* Primary brand color - deep maroon */
--primary-gold: #D4A017;          /* Golden accents - festive */
--primary-orange: #FF6B35;        /* Vibrant orange - energy */
--primary-yellow: #F7B32B;        /* Bright yellow - celebration */

/* Navbar Specific Colors */
--navbar-bg: #e87700;             /* Navbar background - vibrant orange */
--navbar-border: #a71d16;         /* Navbar border - deep red */

/* Page Background */
--page-bg: #f3ba35;               /* Home screen background - golden yellow */
```

### Secondary Colors

```css
--secondary-burgundy: #6B0F1A;    /* Dark burgundy - depth */
--secondary-rust: #B85042;        /* Rust orange - warmth */
--secondary-cream: #FFF8E7;       /* Cream - backgrounds */
--secondary-terracotta: #E07A5F;  /* Terracotta - earthy */
```

### Accent Colors

```css
--accent-turquoise: #3AAFA9;      /* Turquoise - fresh contrast */
--accent-pink: #F72585;           /* Vibrant pink - cultural */
--accent-green: #2D6A4F;          /* Deep green - balance */
--accent-blue: #1B4965;           /* Navy blue - stability */
```

### Neutral Colors

```css
--neutral-white: #FFFFFF;
--neutral-off-white: #FFF8F0;
--neutral-light: #F5F1E8;
--neutral-medium: #8B8680;
--neutral-dark: #3E3B36;
--neutral-black: #1A1816;
```

### Gradient Definitions

```css
--gradient-sunset: linear-gradient(135deg, #8B1538 0%, #FF6B35 50%, #F7B32B 100%);
--gradient-festival: linear-gradient(to right, #D4A017, #FF6B35, #F72585);
--gradient-warm: linear-gradient(180deg, #FFF8E7 0%, #FFE5B4 100%);
--gradient-overlay: linear-gradient(to bottom, rgba(139, 21, 56, 0.8), rgba(247, 179, 43, 0.6));
```

---

## 🖼️ Design Elements

### Indian Cultural Motifs

1. **Truck Art Patterns**
   - Use colorful geometric patterns inspired by Indian truck art
   - Floral motifs (marigolds, lotuses)
   - Peacock feathers
   - Traditional "jharokha" window designs

2. **Musical Instruments**
   - Tabla, sitar, veena illustrations
   - Use as decorative elements in headers/footers
   - Consider as section dividers

3. **Border Patterns**
   - Rangoli-inspired decorative borders
   - Mandala patterns for section breaks
   - Paisley motifs for subtle backgrounds

4. **Textures**
   - Fabric textures (silk, khadi)
   - Hand-painted illustrations
   - Block print patterns

---

## 📐 Component Guidelines

### Navigation Bar

- **Background:** Ornate yellow/gold with decorative border pattern
- **Font:** Cinzel Decorative for menu items
- **Menu Items:** Home, Events, Competitions, Partner, Team
- **Style:** Incorporate traditional Indian border designs (top border with repeating floral/geometric patterns)
- **Layout:** Center-aligned navigation with decorative frame

### Buttons

- **Primary:** Rounded with gradient (sunset or festival)
- **Hover:** Slight elevation with shadow
- **Border:** Consider traditional Indian textile-inspired borders

### Cards/Sections

- **Borders:** Use decorative patterns
- **Shadows:** Warm tones (orange/yellow shadows)
- **Backgrounds:** Cream or off-white with subtle pattern overlays

### Icons

- Prefer custom Indian-inspired iconography
- Use traditional art styles where possible

---

## 🎯 Animation & Interactions

- **Entrance Animations:** Fade + slide (like a scroll unfurling)
- **Hover Effects:** Subtle glow/shadow with warm colors
- **Transitions:** Smooth (300-500ms) with ease-in-out
- **Scroll Effects:** Parallax for background patterns
- **Loading:** Consider diya (lamp) or peacock feather animations

---

## 📱 Responsive Design

- **Mobile First:** Ensure all Indian decorative elements scale appropriately
- **Breakpoints:**
  - Mobile: 0-640px
  - Tablet: 641px-1024px
  - Desktop: 1025px+
- **Pattern Visibility:** Simplify patterns on mobile for performance

---

## 🔤 Font Guidelines for Agents

### Adding New Fonts

When adding a new font to the project, follow these steps:

1. **Document in this file:**
   ```markdown
   ### [Font Name]
   - **Usage:** [Describe where/when to use]
   - **Source:** [Google Fonts / Custom / etc.]
   - **Import:** [Full import statement]
   - **CSS Variable:** [Variable name]
   - **Description:** [Brief description]
   ```

2. **Add to globals.css:**
   - Add the import statement at the top of the file
   - Define CSS variable in `:root`
   - Example:
     ```css
     @import url('[FONT_URL]');
     
     :root {
       --font-[name]: '[Font Family]', sans-serif;
     }
     ```

3. **Update tailwind.config:**
   - Add font family to theme.extend.fontFamily
   - Use the CSS variable

4. **Test across browsers:**
   - Chrome, Firefox, Safari, Edge
   - Check font fallbacks

### Font Combination Rules

- **Headings:** Nishtha or Cinzel Decorative
- **Body:** Poppins
- **Special Elements:** Mix Nishtha with Poppins for bilingual content
- **Avoid:** More than 3 font families on a single page

---

## 📦 Asset Organization

### Directory Structure

```
public/
  ├── images/
  │   ├── hero/
  │   ├── events/
  │   ├── patterns/       # Indian patterns, borders
  │   ├── motifs/         # Cultural decorative elements
  │   └── instruments/    # Musical instrument illustrations
  ├── fonts/             # Custom fonts if needed
  └── icons/
```

---

## ✅ Development Checklist

- [ ] All components use defined color variables
- [ ] Fonts loaded and applied consistently
- [ ] Indian cultural elements present in design
- [ ] Responsive on all devices
- [ ] Performance optimized (images, fonts)
- [ ] Accessibility standards met (WCAG AA)
- [ ] Cross-browser tested
- [ ] Cultural authenticity reviewed

---

## 🎭 Cultural Sensitivity

- Ensure all Indian cultural elements are used respectfully
- Avoid stereotypical representations
- Celebrate diversity of Indian culture (regional variations)
- Use authentic color combinations from Indian festivals and traditions

---

## 🚀 Best Practices

1. **Consistency:** Always reference this file for design decisions
2. **Updates:** Keep this file updated when new patterns emerge
3. **Communication:** Discuss major design changes with team
4. **Assets:** Optimize all images (WebP format preferred)
5. **Performance:** Lazy load decorative elements
6. **A11y:** Ensure sufficient color contrast despite vibrant palette

---

**Last Updated:** March 7, 2026  
**Maintained By:** Crescendo'2026 Development Team
