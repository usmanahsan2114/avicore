# AviCore Simulation Technologies Website Conversion (Deep Research & Plan)

This answer provides a comprehensive plan to convert the Aigocy HTML template into a premium aviation-simulation website for **AviCore** (using “AviCore Simulation Technologies”, “AviCore Simulation”, or “AviCore Sim” as needed). It covers inventory of template sections, legal/IP review, page requirements, exact HTML/CSS/JS changes preserving the existing design, and includes a detailed Codex prompt plus deliverables (mapping table, sitemap, JSON-LD examples, responsive and accessibility checklists, timeline, etc.) as requested. The plan follows best practices for SEO/AEO (answer-engine optimization), WCAG 2.2 accessibility, and Core Web Vitals.

## 1. Template Inventory and Section Mapping

We first map each Aigocy template section to the new AviCore content or page:

| **Template Section (Aigocy)** | **AviCore Section / Page**                                                                           |
|-----------------------------|------------------------------------------------------------------------------------------------------|
| **Hero**                    | Home hero banner (headline + subheadline + CTAs). Retain layout; replace AI copy with aviation.   |
| **About Us**                | Use as main **About** page content (company profile). Replace AI agency text with AviCore mission. |
| **Services**                | Reuse for **Services/Capabilities** overview. Replace AI-related services with aviation hardware/software services (3D printing, controls, IOS, etc.).   |
| **Works / Featured Projects**  | Use for **Projects / Case Studies**. Replace AI case-study titles with simulator hardware examples.    |
| **Process / Timeline**      | Adapt for “From Requirement to Delivery” (Requirement, Design, Prototype, Delivery) process. Update labels accordingly. (Original steps Discover, Prototype, Validate.) |
| **Benefits / Why Choose Us**  | Repurpose as **Benefits** (Rapid Manufacturing, Custom Design, etc.). Align with training and simulator themes. |
| **All Features**            | Could be integrated into Benefits/Services pages (highlight key features like USB HID, plug-and-play, simulation-ready). |
| **FAQs**                    | Use as general **FAQ** page. Replace AI questions with relevant aviation-sim Q&A (supported by AI assistants and chat engines).  |
| **Contact Form**            | Keep contact form layout; change labels (Name, Email, Message, file upload for drawings).   |
| **Footer**                  | Update with AviCore branding and links. Include simulation-use disclaimer.                           |

**New sections/pages needed (not in Aigocy):**  
- **Products pages:** products.html (catalog overview), usb-flight-controls.html, custom-joystick.html, printed-parts.html, avionics-bezels.html, cockpit-panels.html, ios-software.html, soft-gauges.html. Each uses existing card/feature styles (e.g. service cards, project sliders) to list products with CTA.  
- **Solutions pages:** solutions.html overview, plus flight-schools.html, simulator-builders.html, defense-training.html, universities.html, maintenance-training.html, hobbyists.html. These use card layouts (similar to Services) for each sector with tailored content.  
- **Engineering Capabilities:** capabilities.html detailing CAD, 3D printing, integration, etc., reusing the Services or features layout.  
- **Quote and Configure forms:** quote.html (multi-section quote form) and configure-joystick.html (configurator form). Use existing form styles and accordions.  
- **Downloads & Support:** downloads.html (static brochure links), support.html (help topics, troubleshooting cards).  
- **Blog:** convert blog-standard, grid pages to aviation article listings, and blog-single to content pages.  
- **Legal & Aux:** faq.html (complete FAQ page), privacy.html, terms.html, disclaimer.html, sitemap.html, plus sitemap.xml and robots.txt.

**Source examples:** The original Aigocy site shows the “Featured Works” and “Process” sections which we will adapt. For example, Aigocy’s Process (Discover, Prototype, Validate) will become AviCore’s Requirement, Design, Prototype, Delivery. The Featured Works section provides case study cards that we’ll replace with AviCore project examples (G1000 panel, cyclic grips, etc.).

## 2. Legal/IP and Wording

- Use **careful language** for aviation products. Do NOT claim any certification or OEM affiliation. For example, say “*G1000-style glass cockpit training display*” rather than “Garmin G1000”.  
- Include the disclaimer prominently (footer and product pages):  
  > “Products are intended for simulation, training, cockpit familiarization, prototyping and enthusiast use only. They are *not* certified aircraft parts and are not for installation in real aircraft.”  
- Also clarify trademarks: e.g. *“All trademarks belong to their owners. AviCore products are simulation hardware and not official OEM parts.”*  
- Avoid banned terms like “FAA approved” or “EASA certified.” Use “future-ready” or “qualification support” only if necessary.  
- Replace any residual Aigocy references (e.g. “Aigocy”, AI-agency phrasing) with AviCore content.  

## 3. Content & Page Requirements

### Key Product & Feature Content
- **USB Flight Controls:** Describe aircraft-specific joystick grips (fixed-wing and helicopter), pilot yokes, side-sticks; mention USB HID, plug-and-play and platform compatibility.  
- **Custom Joystick:** Flagship page for joysticks (see section 8 below).  
- **3D Printed Parts:** List knobs, handles, bezels, mounts, etc., and rapid-prototyping process.  
- **Avionics Bezels:** G1000-style and IDU-680-style panel bezels for training displays. Stress “style” and “training” use.  
- **Simulator Panels:** Electrical switch panels, autopilot/radio panels, annunciator panels, etc. Custom layouts with USB/MIDI interface.  
- **IOS Software:** Instructor Operating Station features (scenario control, failures, debrief).  
- **Soft Gauges:** PFD/MFD screens, engine gauge panels, compatible with Air Manager or SimConnect.  

Each product category page should use existing **card layouts** or **tables**. For example, reuse the Aigocy Services cards to list products with images, short descriptions, and “View Details / Request Quote” buttons. Add compatibility chips/icons (e.g. MSFS, P3D, X-Plane logos) on cards.

### Navigation (Desktop & Mobile)
- **Home**  
- **Products** (dropdown with product category pages)  
- **Solutions** (dropdown with each sector page)  
- **Capabilities** (Engineering capabilities page)  
- **Works** (Projects/Case Studies page)  
- **Resources** (Blog, Downloads, FAQ, Support pages)  
- **Company** (About, Contact)  
- **CTA Button:** “Request a Quote” (always visible in header).  

Ensure *sticky* header and functioning mobile off-canvas menu with these links (no broken links). For example, the Aigocy site’s nav (as seen in footer snippet) will be adapted:
```html
<nav class="navbar ...">
  <a href="index.html" class="navbar-brand">AviCore</a>
  <ul class="navbar-nav">
    <li><a href="index.html">Home</a></li>
    <li class="dropdown">
      <a href="#">Products</a>
      <ul class="dropdown-menu">
        <li><a href="usb-flight-controls.html">USB Flight Controls</a></li>
        <!-- more product items -->
      </ul>
    </li>
    <!-- Similar for Solutions, Works, etc. -->
  </ul>
  <button class="btn btn-primary">Request a Quote</button>
</nav>
```
*(Example: show how to update navigation structure and include CTA.)*

### Home Page Layout
Reuse the existing Aigocy one-page home layout, replacing content:
- **Hero**: Aviation-focused headline, subheadline, CTA buttons (“Request a Quote”, “Explore Products”, “Configure Joystick”).
- **Trust Bar**: Under hero, add icons/text (USB Plug-and-Play, Aircraft-specific, etc.).
- **Sections**:
  1. **Product Categories:** Card grid (use Aigocy “Services” or “Features” card style). Each card links to a product page.
  2. **Flagship Product (Joystick):** Prominent banner/section highlighting custom joystick with feature chips (USB HID, Hall sensors, etc.) and CTA “Configure Joystick”.
  3. **3D Printed Parts:** Feature section listing example parts (knobs, handles, bezels, etc.) and CTA “Send Part Reference”.
  4. **Solutions:** Use card sections for Flight Schools, Simulator Builders, Defense, etc. (reuse Services layout style).
  5. **Process (From Requirement to Delivery):** Adapt Aigocy’s “Process” timeline (three steps) to four steps (Requirement, Design, Prototype, Delivery).
  6. **Benefits:** Use Aigocy’s benefits/feature columns (“Why Choose Us” or “All Features”) to highlight advantages (Rapid, Cost-effective, Modular, Simulation-ready).
  7. **Featured Works/Case Studies:** Replace example AI projects with generic sim projects (use Aigocy’s project card style).
  8. **FAQ Teaser:** A few key Q&A (short, under collapsible or static headings).
  9. **CTA Banner:** “Need an aircraft-specific control?” with buttons (Request Quote, Configure, Send Drawing).
  10. **Contact Preview:** Short form section (Name, Email, Interest, Simulator Platform, Message) – style as Aigocy’s contact form but with aviation labels.

Each section must use the **exact same CSS classes and layout** as the template. For example, if Aigocy’s feature cards use `class="service-box"`, reuse it and only change the inner text/icons. Don’t introduce new frameworks or break Bootstrap/GSAP/Swiper functionality.

### New Product/Service Pages
Create new HTML files matching the theme:

- **products.html (Catalog):** Hero + intro text + filterable product grid (use Bootstrap tabs or buttons to filter categories). Reuse card design (e.g. from Services or Works). Include a comparison table (Basic/Standard/Pro/Custom) that collapses on mobile.
- **usb-flight-controls.html:** List joystick and stick product images/descriptions (reuse product card style). Include feature list and options table. CTA “Configure Joystick”.
- **custom-joystick.html:** Full product page (hero banner, features list, build options, compatibility, config form, FAQ, disclaimers). Use question headings and bullet features.
- **printed-parts.html, avionics-bezels.html, cockpit-panels.html, ios-software.html, soft-gauges.html:** Each with similar layout: hero + description + product examples/options + CTA. Use existing grid or card sections from template’s blog or services to list items.
- **solutions.html:** Overview of sectors (cards or icons for each industry).
  - Then create subpages **flight-schools.html**, **simulator-builders.html**, **defense-training.html**, **universities.html**, **maintenance-training.html**, **hobbyists.html**. Each using a header + sector-specific content + product/service recommendations + quote CTA.
- **capabilities.html:** Sections on CAD, 3D printing, electronics, software integration, etc. Possibly reuse Aigocy’s Services layout, but with custom content.
- **quote.html:** Multi-step quote form (customer info, project details, attachments). Use Bootstrap forms and accordions (like Aigocy’s FAQ style for sections). Add **TODO** comments for backend.
- **configure-joystick.html:** Similar to custom-joystick page, but focused on an interactive configurator form.
- **downloads.html:** Cards or list of PDF downloads (company profile, datasheets).
- **support.html:** FAQ and troubleshooting topics (cards for common issues, link to contact).
- **faq.html:** Categorized list (use the same accordion style as Aigocy’s FAQ).
- **privacy.html, terms.html, disclaimer.html:** Plain content pages (use simple layout, maybe reuse Contact or Blog style).
- **sitemap.html:** List all links in site structure (for humans).
- **sitemap.xml & robots.txt:** Standard files (robots allow all, reference sitemap).

### Forms and Buttons
- Retain Aigocy’s form styles. Ensure each input has proper `<label>` and `placeholder`. E.g.:
  ```html
  <form action="#" method="post">
    <label for="quote-name">Full Name</label>
    <input type="text" id="quote-name" name="name" required>
    <!-- more fields -->
    <button type="submit" class="btn btn-primary">Submit Quote Request</button>
  </form>
  <!-- TODO: Connect this form to backend (Laravel/PHP or Formspree) -->
  ```
- Include `<input type="file">` for attachments (with comment to handle backend).  
- Add hidden fields or URL parameters if needed to track page source.

## 4. Exact Code Changes (HTML/CSS/JS)

The **Codex prompt** (below) will specify each needed edit. In summary:

- **Branding:** Change text/logo to “AviCore”. Example:
  ```html
  <!-- In header -->
  <a href="index.html" class="logo">AviCore</a>
  ```
- **Navigation:** Replace Aigocy menu items with AviCore menu structure (including the CTA button). Example:
  ```html
  <ul class="navbar-nav">
    <li><a href="index.html">Home</a></li>
    <li class="dropdown">
      <a href="#">Products</a>
      <ul class="dropdown-menu">
        <li><a href="usb-flight-controls.html">USB Flight Controls</a></li>
        <!-- etc. -->
      </ul>
    </li>
    <!-- ... -->
    <li class="nav-btn"><a href="quote.html" class="btn">Request a Quote</a></li>
  </ul>
  ```
- **Footer:** Update copyright:
  ```html
  © 2026 AviCore Simulation Technologies. All Rights Reserved.
  ```
  Include disclaimer link or text.
- **Content Sections:** Use existing HTML blocks; update headings/text. For example, repurpose Aigocy’s “Services” section HTML but replace the text/labels:
  ```html
  <div class="service-box">
    <i class="icon-plane"></i>
    <h4>Aircraft-Specific USB Joysticks</h4>
    <p>Plug-and-play flight controls designed for specific aircraft simulators.</p>
    <a href="usb-flight-controls.html">View Product</a>
  </div>
  ```
- **Hero Images:** Keep existing `<img>` or video tags but change `alt` and source comments:
  ```html
  <!-- TODO: Replace with custom cockpit image -->
  <img src="assets/images/hero-sim.jpg" alt="Simulator cockpit with custom avionics panel">
  ```
- **Lazy Loading:** Add `loading="lazy"` to non-critical images. E.g.:
  ```html
  <img src="assets/images/product-card.jpg" alt="3D printed cockpit knob" loading="lazy">
  ```
- **CSS:** Add custom rules in `assets/css/avicore.css`. E.g. branding colors or button tweaks with comment:
  ```css
  /* AviCore Custom Styles */
  .navbar .btn-primary { background-color: #0093D2; } /* Brand accent color */
  ```
- **JS:** If needed, include `assets/js/avicore.js` after `main.js` for any custom scripts (e.g. menu adjustments or form validation placeholders).

Do **not** remove or disable existing scripts (Swiper, GSAP, Slick). For example, maintain the `data-swiper` sliders for projects. Keep the off-canvas mobile menu logic.

## 5. SEO and AEO Enhancements

- **Titles & Meta:** Each page needs a unique `<title>` and `<meta name="description">`. E.g.:
  ```html
  <title>AviCore Simulation Technologies | Custom Aviation Simulator Hardware</title>
  <meta name="description" content="AviCore designs custom USB joysticks, 3D printed cockpit parts, and simulation software for MSFS, Prepar3D, X-Plane, and professional pilot training.">
  ```
- **Canonical & OG Tags:** Add `<link rel="canonical" href="https://www.avicoresim.com/page.html">` (placeholder domain) and Open Graph `<meta>` tags for social sharing.
- **Headings:** Ensure one H1 per page, structured H2/H3 sections (for AEO, answers pages). For example, the joystick page might start:
  ```html
  <h1>Aircraft-Specific USB Joysticks for Flight Simulation</h1>
  ```
- **Answer Blocks:** On product/solution pages, add a short “**In short:**” or FAQ box at top to answer common questions. E.g.:
  ```html
  <p><strong>What is an aircraft-specific USB joystick?</strong> An aircraft-specific joystick is a simulator control designed to match the grip and button layout of a real aircraft’s controls. AviCore builds these with USB HID electronics for plug-and-play use in MSFS, Prepar3D, X-Plane, and training sims.</p>
  ```
- **FAQs & Schema:** Place FAQs in accordions and add JSON-LD. Example snippet:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "Are AviCore products certified aircraft parts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. AviCore products are intended for simulation and training use only and are not certified for real aircraft."
      }
    }]
  }
  </script>
  ```
- **Organization Schema:** On Home/About pages, embed Org schema:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AviCore Simulation Technologies",
    "url": "https://www.avicoresim.com",
    "logo": "https://www.avicoresim.com/logo.png",
    "contactPoint": { "@type": "ContactPoint", "email": "info@avicoresim.com", "contactType": "customer service" },
    "sameAs": [
      "https://www.linkedin.com/company/avicore",
      "https://twitter.com/avicore_sim",
      "https://www.facebook.com/avicore.simtech"
    ]
  }
  ```
- **Breadcrumbs Schema:** Add on product/inner pages to enhance structure.  
- **Core Web Vitals:** Defer non-critical JS, lazy-load images, specify image dimensions, avoid layout shifts (e.g. sticky header height reserved).  
  - E.g. add `width`/`height` to hero images.  
  - Ensure CSS is minimized (we keep template’s CSS; add only small custom file).  

**Sources:** Google’s SEO Starter Guide recommends unique titles/OG, sitemaps, and accessible content. AEO guides advise clear question/answer sections and structured content for AI search.

## 6. Accessibility (WCAG 2.2 AA)

- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<form>` with `<label>`).  
- **Color contrast:** Ensure text/background >= 4.5:1 (7:1 for large text).  
- **Keyboard navigation:** Verify all menus, dropdowns, accordions are operable via keyboard.  
- **Form labels:** Each input has a `<label>`. Mark `required`.  
- **ARIA:** Add `aria-label` or `role="button"` where icons-only (e.g. social links).  
- **Focus styles:** Ensure visible focus outline on links/buttons.  
- **Images:** Provide meaningful `alt` text. Mark decorative images with `alt=""`.  
- **Reduced motion:** Add `@media (prefers-reduced-motion: reduce)` to disable animations if possible.  

E.g.: 
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## 7. Deliverables

### a) Final Codex Prompt (HTML Edits List)
*(See below for the full prompt text to feed to a code model.)*

### b) Mapping Table (Template → AviCore)
| Aigocy Section           | AviCore Section/Page                    | Notes                                         |
|--------------------------|-----------------------------------------|-----------------------------------------------|
| Hero (AI Sprint)         | Home hero (Custom Avionics & Controls)  | Update text/images to simulators.             |
| About Us                 | About page                              | Rewrite as company mission/tech capabilities. |
| Services (AI Strategy, etc.) | Services/Capabilities overview           | Replace with product/service types.           |
| Featured Works           | Projects/Case Studies                   | Replace content with AviCore project examples. |
| Process (3 steps)        | Process (4 steps)                       | Update labels: Requirement, Design, Prototype, Delivery. |
| Benefits (“Why Choose Us”) | Benefits section                       | Focus on simulator training advantages.       |
| Features (“All Features”) | Can be merged with Benefits/Services.   | Or separate “Features” page if needed.        |
| FAQs                     | FAQ page                                | Replace questions/answers with aviation Q&A.  |
| Contact Form             | Contact/Quote page                     | Update placeholders; add file upload.         |
| Footer                   | Update with AviCore info & disclaimer.  | Remove Aigocy branding.                       |

### c) Draft `sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.avicoresim.com/</loc></url>
  <url><loc>https://www.avicoresim.com/products.html</loc></url>
  <url><loc>https://www.avicoresim.com/usb-flight-controls.html</loc></url>
  <url><loc>https://www.avicoresim.com/custom-joystick.html</loc></url>
  <url><loc>https://www.avicoresim.com/printed-parts.html</loc></url>
  <url><loc>https://www.avicoresim.com/avionics-bezels.html</loc></url>
  <url><loc>https://www.avicoresim.com/cockpit-panels.html</loc></url>
  <url><loc>https://www.avicoresim.com/ios-software.html</loc></url>
  <url><loc>https://www.avicoresim.com/soft-gauges.html</loc></url>
  <url><loc>https://www.avicoresim.com/solutions.html</loc></url>
  <url><loc>https://www.avicoresim.com/flight-schools.html</loc></url>
  <url><loc>https://www.avicoresim.com/simulator-builders.html</loc></url>
  <url><loc>https://www.avicoresim.com/defense-training.html</loc></url>
  <url><loc>https://www.avicoresim.com/universities.html</loc></url>
  <url><loc>https://www.avicoresim.com/maintenance-training.html</loc></url>
  <url><loc>https://www.avicoresim.com/hobbyists.html</loc></url>
  <url><loc>https://www.avicoresim.com/capabilities.html</loc></url>
  <url><loc>https://www.avicoresim.com/quote.html</loc></url>
  <url><loc>https://www.avicoresim.com/configure-joystick.html</loc></url>
  <url><loc>https://www.avicoresim.com/downloads.html</loc></url>
  <url><loc>https://www.avicoresim.com/support.html</loc></url>
  <url><loc>https://www.avicoresim.com/faq.html</loc></url>
  <url><loc>https://www.avicoresim.com/about.html</loc></url>
  <url><loc>https://www.avicoresim.com/contact.html</loc></url>
  <url><loc>https://www.avicoresim.com/privacy.html</loc></url>
  <url><loc>https://www.avicoresim.com/terms.html</loc></url>
  <url><loc>https://www.avicoresim.com/disclaimer.html</loc></url>
  <url><loc>https://www.avicoresim.com/sitemap.html</loc></url>
</urlset>
```
*(Placeholders used; update domain when final.)*

### d) JSON-LD Snippets

- **Organization schema (in `<head>` of Home/About):**
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AviCore Simulation Technologies",
    "alternateName": "AviCore",
    "url": "https://www.avicoresim.com",
    "logo": "https://www.avicoresim.com/assets/images/logo.png",
    "foundingLocation": "Pakistan",
    "areaServed": "Worldwide",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@avicoresim.com",
      "contactType": "customer support"
    },
    "sameAs": [
      "https://www.linkedin.com/company/avicore-simtech",
      "https://twitter.com/aviCoreSim",
      "https://www.youtube.com/@avicoresim"
    ]
  }
  ```
- **Product schema (on custom-joystick.html, etc.):**
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Aircraft-Specific USB Joystick",
    "description": "Custom USB joystick grip designed for specific aircraft simulation, with USB HID plug-and-play support and optional sensors.",
    "brand": "AviCore",
    "category": "Flight Simulator Hardware",
    "image": "https://www.avicoresim.com/assets/images/joystick.jpg",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "0.00",  // placeholder if no fixed price
      "availability": "https://schema.org/InStock"
    }
  }
  ```
- **FAQ schema (on faq.html):** (example of one Q&A)
  ```json
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can AviCore build a joystick for my aircraft?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. AviCore accepts customer specifications (aircraft type, photos/drawings, button layout) for custom design review and fabrication."
        }
      },
      {
        "@type": "Question",
        "name": "Which simulator platforms are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AviCore hardware is designed as USB HID controllers compatible with Microsoft Flight Simulator, Prepar3D, X-Plane, DCS, and similar platforms when mapped appropriately."
        }
      }
      // (Add more Q&As as needed)
    ]
  }
  ```

### e) Responsive Design Checklist

Ensure layout at breakpoints: **1920px**, 1440px, 1366px, 1200px, 992px, 768px, 576px, 430px, 390px, 320px.
- Use Bootstrap grid classes (`col-lg-4`, `col-md-6`, etc.) for fluid columns.
- **No horizontal scroll:** Check that elements (header, footer, nav) don’t overflow.
- **Header/Nav:** Collapses to hamburger menu at < 992px (Bootstrap default). Ensure mobile menu closes properly.
- **Hero text:** Use CSS `text-center` or responsive sizing. CTAs should stack vertically on narrow screens.
- **Product & service cards:** At small widths, stack to 1 column (`col-12`) for readability.
- **Tables:** The features/options table on joystick page should become scrollable on mobile or convert to accordions if too wide.
- **Forms:** Inputs full-width on mobile (Bootstrap `.form-control` handles this). Buttons full-width or block-level on small screens.
- **Images:** Should scale with `max-width: 100%`. Use Bootstrap’s responsive images (`img-fluid`).
- **Footer:** Columns stack vertically on mobile.

Media queries (if needed beyond Bootstrap):
```css
@media (max-width: 576px) {
  .hero-section h1 { font-size: 1.5rem; }
  .navbar .btn { display: block; width: 100%; margin: 0.5rem 0; }
}
@media (max-width: 768px) {
  .card-columns { column-count: 1; }
}
```
*(Adjust based on actual theme breakpoints.)*

### f) Accessibility Checklist (WCAG 2.2 AA)

- **Semantic tags:** Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- **Alt text:** All meaningful images have `alt="..."`. Mark purely decorative images `alt=""`.
- **Labels:** All form inputs have `<label>`s. Group related checkboxes with fieldset/legend.
- **Focus:** Ensure keyboard focus outline visible (override theme if needed).
- **ARIA:** E.g. `<button aria-label="Close menu">` for icon-only buttons. Use `aria-expanded` on dropdown toggles.
- **Contrast:** Text vs background ≥4.5:1. Ensure buttons meet contrast.
- **Link text:** Avoid “Click here”; use descriptive link text (e.g. “Request Quote”).
- **Skip link:** Optionally add `<a href="#main-content" class="skip-link">Skip to content</a>` at top.
- **Forms:** Indicate required fields (e.g. `required` and `aria-required="true"`). Provide error messaging (even placeholder).
- **Accordions:** Ensure keyboard navigable (use `<button>` inside headings for toggle).
- **Motion:** Honor `prefers-reduced-motion`. We will disable or minimize animations if user has that setting.

### g) 90-Day Execution Timeline (Prioritized)

1. **Week 1-2:** Finalize brand naming (“AviCore”). Secure domain(s) (e.g. avicoresimtech.com, avicoresim.com). Setup version control.
2. **Week 3-4:** Create HTML page skeletons (duplicate Aigocy files). Update header/footer template parts (nav, brand).
3. **Week 5-6:** Populate Home page sections (replace content, add new sections A–J as above). Add hero images placeholders.
4. **Week 7-8:** Build Products & Solution pages (pages 2–15). Use template sections for product listings and solution cards.
5. **Week 9-10:** Implement Quote, Configure forms, Downloads, Support, FAQ pages. Ensure form fields and TODOs.
6. **Week 11-12:** Fill content (text, labels) on all pages. Add alt text and meta tags. Create placeholder PDFs/images.
7. **Week 13-14:** Implement SEO/Schema (titles, metas, JSON-LD, robots, sitemap). Add breadcrumbs schema, OG tags.
8. **Week 15-16:** Accessibility fixes: labels, contrast checks, focus styles. WCAG audit and adjustments.
9. **Week 17-18:** Responsive testing/fixes: test all breakpoints, adjust media queries as needed.
10. **Week 19-20:** Performance: lazy-load images, minimize CSS, verify no errors. Core Web Vitals review.
11. **Week 21-24:** QA: cross-browser testing. Fix any issues. Prepare for deployment.

*Deliverables:*  
- Updated HTML/CSS/JS files for all pages.  
- New CSS (`avicore.css`) and JS (`avicore.js`) with custom code.  
- `sitemap.xml`, `robots.txt`.  
- Summary report of changes.  
- TODO list for future work (image replacement, form backend, real content).  

### h) Images & Alt Text

**Images to replace (with `TODO` comment):**  

- Hero background (cockpit/trainers).  
  - Alt: *“Flight simulator cockpit with instrumentation.”*  
- Product category icons (if generic, leave).  
- Product photos (joystick grip, cyclic, throttle, bezels, panels).  
  - Alt: e.g. *“Custom-made USB aircraft joystick grip.”*  
- Project thumbnails (Featured Works).  
  - Alt: descriptive (e.g. *“Cessna 208 cockpit panel prototype.”*).  
- 3D printing examples (knobs, mounts).  
  - Alt: e.g. *“3D printed aircraft switch knob.”*  
- IOS software screenshot (if any).  
  - Alt: *“Instructor Operating Station dashboard screenshot.”*  
- Soft gauge display image.  
  - Alt: *“Digital PFD/MFD flight instruments display.”*  

Add comments: `<!-- TODO: Replace with [description] image -->` near each placeholder.

---

## Final Codex Prompt (Ready-to-run)

```plaintext
You are an expert frontend developer, UI/UX designer, SEO specialist, AEO/GEO optimization specialist, accessibility auditor and performance engineer.

I have provided a static HTML website template ZIP called “Aigocy - AI Agency / Technology HTML Template.” The live demo reference is:
https://wpriverthemes.com/HTML/aigocy/

Your task is to convert this existing AI agency template into a premium aviation simulation technology company website for:

Main brand name:
AviCore

Substitutes (use where appropriate):
- AviCore Simulation Technologies
- AviCore Simulation
- AviCore Sim

Tagline:
Build. Simulate. Train.

Very important:
Do not rebuild the website from scratch.
Do not change the core design identity unnecessarily.
Do not replace the template with a different framework.
Do not convert it to React, Laravel, Vue or WordPress.
Keep it as a static HTML/CSS/JS website.
Modify and extend the existing Aigocy theme professionally.

The final result must look like a high-end aviation simulation, simulator hardware, 3D printed cockpit parts, USB flight controls, avionics panels and training technology company website. It must not look like a generic AI agency website anymore.

The website must be excellent in:
- UI design
- UX flow
- mobile responsiveness
- desktop responsiveness
- SEO
- AEO / Answer Engine Optimization
- LLM / AI-search readability
- accessibility (WCAG 2.2 AA)
- Core Web Vitals
- technical performance
- conversion rate
- quote generation
- product presentation
- future backend readiness

Preserve existing:
- visual style
- dark technology theme
- premium gradient effects
- spacing rhythm
- animations
- Bootstrap structure
- GSAP/Swiper/Slick behavior
- header/footer layout concept
- responsive menu concept
- existing assets structure
- existing section design patterns
- existing button and card styles
- existing page hero design

Existing pages likely include:
- index.html
- index-v2.html
- about.html
- services.html
- service-single.html
- work.html
- work-single.html
- blog-standard.html
- blog-two-columns.html
- blog-three-columns.html
- blog-single.html
- contact.html
- 404.html

Existing assets likely include:
- assets/css/bootstrap.min.css
- assets/css/styles.css
- assets/css/animate.css
- assets/css/swiper-bundle.min.css
- assets/css/slick.css
- assets/css/slick.theme.css
- assets/js/jquery.min.js
- assets/js/bootstrap.min.js
- assets/js/swiper-bundle.min.js
- assets/js/slick.min.js
- assets/js/gsap.min.js
- assets/js/ScrollTrigger.min.js
- assets/js/ScrollSmoother.min.js
- assets/js/ScrollSmooth.js
- assets/js/gsapAnimation.js
- assets/js/main.js
- assets/scss/app.scss

Use the existing template structure and style system. Add custom changes in clearly marked sections only.

Add a custom CSS section:
“/* AviCore Custom Styles */”

If needed, create:
assets/css/avicore.css

Add a custom JS section:
“// AviCore Custom Scripts”

If needed, create:
assets/js/avicore.js

Link any new CSS after the original styles.css.
Link any new JS after the original main.js.

Do not break existing animations, sliders, navigation or responsive behavior.

==================================================
1. BRAND CONVERSION
==================================================

Replace all Aigocy branding with:

AviCore Simulation Technologies
or short form:
AviCore

Footer copyright:
© 2026 AviCore Simulation Technologies. All Rights Reserved.

Company positioning:
AviCore Simulation Technologies designs and manufactures custom aviation simulation hardware, software and rapid-manufactured simulator parts for flight schools, simulator builders, defense training organizations, universities, maintenance training institutes and serious flight simulation users.

Core business areas:

- aircraft-specific USB joysticks
- helicopter cyclic grips
- side-stick controls
- yoke handles
- throttle quadrants
- trim wheels
- flap levers
- landing gear levers
- autopilot panels
- radio panels
- switch panels
- annunciator panels
- G1000-style glass cockpit training displays
- IDU-680-style EFIS training displays
- avionics bezels
- soft gauges
- instructor operating station software
- failure injection systems
- data logging and debriefing tools
- 3D printed cockpit parts
- simulator brackets, knobs, handles, bezels and housings
- MSFS, Prepar3D, X-Plane and custom simulator integration
- cockpit familiarization trainers
- custom simulator development support

Brand tone:
Professional.
Aviation-engineering focused.
Technically credible.
Global.
Clean.
Confident.
Modern.
Premium.
Not exaggerated.

Avoid:
- world’s best
- guaranteed certified
- FAA approved
- EASA approved
- exact replica
- aircraft approved
- real aircraft part
- certified aircraft component
- official Garmin product
- official Genesys product
- official OEM product

Use careful wording:
- G1000-style
- IDU-680-style
- aviation simulator hardware
- simulation training display
- aircraft-specific simulation control
- compatible with popular simulation platforms
- designed for simulator integration
- for procedure training and cockpit familiarization
- non-certified simulation hardware
- simulator-focused design
- training-focused hardware

Add this disclaimer in footer and relevant product pages:
“Products are intended for simulation, training, cockpit familiarization, prototyping and enthusiast use only. They are *not* certified aircraft parts and are not for installation in real aircraft.”

Add trademark disclaimer:
“All trademarks belong to their respective owners. AviCore products are simulation-focused and not certified aircraft parts or official OEM products.”

==================================================
2. WEBSITE OBJECTIVE
==================================================

The website must not only be a company profile. It must work as:

- product catalogue
- quote generation platform
- credibility platform
- technical portfolio
- SEO landing page system
- AEO answer source
- lead capture funnel
- future ecommerce base
- future Laravel/PHP backend-ready static frontend
- technical sales platform
- product validation platform
- support/documentation hub

Primary conversion goals:
1. Request a Quote
2. Configure a Custom Joystick
3. Book a Demo
4. Download Product Brochure
5. Contact Engineering Team
6. Send Drawing / Reference Image
7. Ask for Custom Simulator Solution

Every important page must have at least one strong CTA.

==================================================
3. NAVIGATION (Desktop & Mobile)
==================================================

Update desktop and mobile navigation (keep same header style).

Menu structure:

- Home
- **Products**
  - USB Flight Controls
  - Custom Joystick
  - 3D Printed Cockpit Parts
  - Avionics Bezels
  - Simulator Panels
  - IOS Software
  - Soft Gauges
- **Solutions**
  - Flight Schools
  - Simulator Builders
  - Defense Training
  - Universities & Institutes
  - Maintenance Training
  - Home Cockpit Builders
- **Capabilities**
  - CAD Design
  - 3D Printing
  - Electronics & Wiring
  - Simulator Integration
  - Software Development
  - Custom Manufacturing
- **Works**
  - Projects
  - Case Studies
- **Resources**
  - Blog
  - Downloads
  - FAQ
  - Support
- **Company**
  - About
  - Contact
- **CTA Button:** Request a Quote (always visible)

Rules:
- Preserve existing header design and behavior.
- Update links to new pages (no broken links).
- Ensure dropdowns and mobile off-canvas include all items.
- Show active menu state appropriately.
- Sticky header must not overlay content on scroll.
- CTA “Request a Quote” should open quote.html.

### Example Header Code Snippet:
```html
<nav class="navbar navbar-expand-lg">
  <a class="navbar-brand" href="index.html">AviCore</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMenu">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div id="navMenu" class="collapse navbar-collapse">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item"><a href="index.html">Home</a></li>
      <li class="nav-item dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Products</a>
        <ul class="dropdown-menu">
          <li><a href="usb-flight-controls.html">USB Flight Controls</a></li>
          <li><a href="custom-joystick.html">Custom Joystick</a></li>
          <!-- ... -->
        </ul>
      </li>
      <!-- More dropdowns for Solutions, etc. -->
      <li class="nav-item"><a href="about.html">About</a></li>
      <li class="nav-item"><a href="contact.html">Contact</a></li>
      <li class="nav-item"><a href="quote.html" class="btn btn-primary">Request a Quote</a></li>
    </ul>
  </div>
</nav>
```

==================================================
4. PAGE CREATION
==================================================

#### Use existing design blocks first:
- **index.html (Home):** Main homepage (use existing “Home Animated” layout).
- **index-v2.html:** Keep as alternate landing page.
- **about.html:** Company About page (rewrite content).
- **service.html:** Rename to **services.html**, list services (or use capabilities).
- **service-single.html:** Reuse for individual service/product detail.
- **work.html:** Rename to **works.html** (projects overview).
- **work-single.html:** Reuse as project detail page.
- **blog-standard.html**, **blog-two-columns.html**, **blog-three-columns.html**: Convert to aviation-themed blog layouts.
- **blog-single.html:** Aviation blog article template.
- **contact.html:** Update to AviCore contact form.
- **404.html:** Update branding and helpful links.

#### Create new pages:

1. **products.html** – Product catalogue (with filter tabs: All, Flight Controls, Avionics, Panels, 3D Printed, Software, Custom).
2. **usb-flight-controls.html** – Category page for flight controls.
3. **custom-joystick.html** – Flagship joystick product page.
4. **printed-parts.html** – 3D Printed Parts catalogue.
5. **avionics-bezels.html** – Avionics Bezels page.
6. **cockpit-panels.html** – Simulator Panels page.
7. **ios-software.html** – IOS Software page.
8. **soft-gauges.html** – Soft Gauges page.
9. **solutions.html** – Overview of all solutions.
10. **flight-schools.html** – Flight Schools solution.
11. **simulator-builders.html** – Simulator Builders solution.
12. **defense-training.html** – Defense Training solution.
13. **universities.html** – Universities & Institutes solution.
14. **maintenance-training.html** – Maintenance Training solution.
15. **hobbyists.html** – Home Cockpit Builders solution.
16. **capabilities.html** – Engineering capabilities page.
17. **quote.html** – Quote request page with multi-section form.
18. **configure-joystick.html** – Custom joystick config page.
19. **downloads.html** – Brochures and datasheets download page.
20. **support.html** – Support and after-sales page.
21. **faq.html** – Detailed FAQ page.
22. **privacy.html** – Privacy policy.
23. **terms.html** – Terms and conditions.
24. **disclaimer.html** – Product disclaimer (simulation-use).
25. **sitemap.html** – Human-readable sitemap.

Also: **sitemap.xml** and **robots.txt**.

*Use clean static HTML. No external page builder.*

==================================================
5. HOME PAGE SECTIONS
==================================================

Modify `index.html`:

- **Hero:** 
  - Headline: “Custom Aviation Simulation Hardware & Software” 
  - Subheadline: “Plug-and-play USB flight controls, 3D printed cockpit parts, avionics bezels, IOS software, soft gauges and custom simulator solutions for MSFS, Prepar3D, X-Plane and professional training environments.”
  - CTAs: `[Request a Quote] [Explore Products] [Configure Joystick]`.
  - Trust chips (beneath hero): e.g. “USB Plug-and-Play”, “Aircraft-Specific Controls”, “3D Printed Rapid Manufacturing”, “MSFS / P3D / X-Plane Ready”, “Custom Simulator Integration”, “Global Custom Orders”.

- **A. Product Categories:** (New section)
  - Use card layout (reuse Aigocy services/feature cards).
  - Cards for: Aircraft-Specific Joysticks, Helicopter Cyclics, Side-Sticks, Yoke Handles, Throttle Quadrants, Trim/Flaps, G1000-style Bezels, IDU-680 Bezels, Autopilot/Switch Panels, 3D Printed Parts, IOS Software, Soft Gauges.
  - Each card: Icon/image + title + 2-line text + “View Product” link.
  - Use theme hover effect on cards.

- **B. Flagship Product (Joysticks):**
  - Title: “Aircraft-Specific USB Joystick”
  - Description: “Custom simulator joystick grips built for specific aircraft layouts. Options include trigger, PTT, trim hat, push buttons, Hall-effect sensor option, metal shaft option, desktop mount, cockpit mount and USB HID plug-and-play support.”
  - Feature chips/icons: USB HID, Auto-detectable, MSFS ready, P3D ready, X-Plane ready, Custom grip geometry, Hall sensor, Desktop/Cockpit mount, Button mapping.
  - CTA: “Configure Your Joystick” button.

- **C. 3D Printed Cockpit Parts:**
  - List example parts in short bullet or image list:
    knobs, switch guards, toggle caps, radio/autopilot knobs, throttle/mixture/prop knobs, condition lever knobs, bezels, display housings, brackets, mounts, covers, annunciator housings, tablet frames, VR headset holders, labels, clips, etc.
  - CTA: “Send Part Reference” (for custom quote).

- **D. Solutions (Sectors):** 
  - Cards for each sector (use Aigocy’s card style):
    Flight Schools, Simulator Builders, Defense Training, Universities & Institutes, Aircraft Maintenance Schools, Home Cockpit Builders.

- **E. Process (From Requirement to Delivery):**
  - Title: “From Requirement to Simulator-Ready Hardware”
  - Steps:
    1. **Requirement:** Aircraft type, simulator platform, cockpit layout, functions, mounting method.
    2. **Design:** CAD model, electronics plan, material selection, button mapping.
    3. **Prototype:** 3D print, assembly, wiring, USB HID testing, simulator integration.
    4. **Delivery:** QC, packaging, docs, setup guide, remote support.

- **F. Benefits:**
  - Use columns (from Aigocy’s Benefits style):
    e.g. Rapid custom manufacturing, Lower development cost, Aircraft-specific design, Modular & upgradeable, Simulation-ready, Small batch production, Custom labeling, Built for training and familiarization.

- **G. Featured Works:**
  - Title: “Featured Projects”
  - Replace each Aigocy case study with sim examples:
    - “Custom USB Cyclic Grip for Helicopter Simulator”
    - “C208-style Engine Control Quadrant”
    - “G1000-style Glass Cockpit Training Panel”
    - “IDU-680-style EFIS Training Display Bezel”
    - “Instructor Operating Station Interface”
    - “3D Printed Cockpit Knob & Bezel Pack”
    - “Autopilot and Radio Panel Prototype”
    - “Mixed-Reality Cockpit Familiarization Concept”
  - Labels: “Prototype Project”, “Custom Build”, etc. (no real client names).
  - Use Aigocy project card structure.

- **H. FAQ / AI Q&A Section:**
  - Title: “Common Questions About Aviation Simulation Hardware”
  - Short Q&A style answers:
    - “What is a USB flight control for simulators?” – Answer short.
    - “Can a custom joystick work with MSFS and Prepar3D?” – Answer: mentions compatibility.
    - “Can 3D printed parts be used in real aircraft?” – Answer: no, simulation use only.
    - “What simulator platforms are supported?” – Answer listing MSFS, P3D, X-Plane, DCS.
    - “Can AviCore build panels for my cockpit?” – Answer: yes, with input.
    - “Can customers send photos/dimensions for custom parts?” – Answer: yes, mention quoting.
  - Keep answers concise (for featured snippets/AI answers).

- **I. CTA Banner:**
  - Title: “Need an aircraft-specific control or cockpit panel?”
  - Buttons: [Request Custom Quote] [Configure Joystick] [Send Drawing/Reference].

- **J. Contact Preview:**
  - Mini contact form (Name, Email, Product interest dropdown, Simulator platform, Message, Submit).
  - Placeholder text; add file upload input.
  - Note: “TODO: Connect form to backend.”

### Code Snippet: Example Product Card
```html
<div class="col-md-4 col-sm-6">
  <div class="service-box">
    <i class="icon-joystick"></i>
    <h4>Aircraft-Specific USB Joysticks</h4>
    <p>Custom USB flight controls designed for simulator training, with buttons, hats, and sensors.</p>
    <a href="usb-flight-controls.html" class="btn btn-secondary">View Product</a>
  </div>
</div>
```

## 7. UPDATE EXISTING PAGES

- **about.html:** Rewrite with AviCore story, team, mission (no fake AI terms). Possibly reuse Aigocy team cards (rename roles to R&D, Engineering, Support).
- **services.html:** Convert to “Services” overview listing all services (e.g. Custom Hardware, 3D Printing, Software, Integration).
- **service-single.html:** Use as template for individual product/service pages (e.g. a general page structure).
- **work.html:** Rename to “Projects” (showcase projects; use Aigocy Work style).
- **work-single.html:** Use for detailed project (challenge, solution, outcome).
- **blog-standard/grid:** Turn into aviation blog listings.
- **blog-single.html:** Turn into an article page (for SEO/AEO content).
- **contact.html:** Replace content with AviCore contact info, add form fields (email, phone, map or address “Pakistan / Global Delivery”).
- **404.html:** Update to AviCore branding, message like “Page not found. Try Home/Products/Contact.”

## 8. CUSTOM JOYSTICK (flagship) PAGE

SEO Title: `Custom USB Flight Simulator Joystick | AviCore Simulation Technologies`

- **Hero:** “Aircraft-Specific USB Joysticks for Flight Simulation”
- **Subhead:** “Custom 3D printed joystick grips with USB plug-and-play electronics, button mapping and simulator-ready integration for MSFS, Prepar3D, X-Plane and custom training systems.”
- **Sections:**
  1. **Product Overview:** What is an aircraft-specific joystick.
  2. **Features:** (bulleted)
     - USB HID plug-and-play (Windows game controller support)
     - Pitch/Roll axes (optional twist/yaw)
     - Trigger, PTT, Trim hat, Buttons
     - Hall-effect sensor option, metal shaft option
     - Desktop or cockpit mount
     - Custom labeling
  3. **Build Options:** (table or subcards)
     - Basic: Grip + 2 axes + basic buttons.
     - Standard: Grip, buttons, trim hat, PTT, USB board.
     - Pro: Hall sensors, metal shaft, reinforced mount, custom mapping.
     - Custom: Fully custom layout per customer specs.
  4. **Compatibility:** List sims (MSFS, P3D, X-Plane, DCS, etc).
     - Note: “Final compatibility depends on simulator mapping.” (no guarantees)
  5. **Configuration Form:** Fields for aircraft type, control type, mounting, axes, buttons, features, platform, color, labeling, file upload.
  6. **FAQ:** e.g. “Is this real aircraft part?” (No, simulation use only), “Will Windows detect it automatically?” (Yes, as HID).
  7. **CTA:** “Configure Your Joystick” and “Request Quote”.
  8. **Disclaimer:** “For simulation use only. Not certified for flight.”

## 9. SEO, AEO, and Technical Checklist

- **SEO Tags:** Each page must have `<title>`, `<meta name="description">`, `<meta property="og:title/og:description">`, canonical link.  
- **Keywords:** Integrate terms like *“flight simulator hardware”*, *“3D printed cockpit parts”*, *“custom USB joystick for MSFS”* in natural language. No stuffing.
- **Answer Engine (AEO):** Use direct question headings (e.g. “What is an aircraft-specific USB joystick?”) and short answer paragraphs. Use bullet lists for features (easier to parse).  
- **Structured Data:** As above (Org, Product, FAQ schemas).
- **Performance:** Use `loading="lazy"` on images. Example:
  ```html
  <img src="assets/images/joystick-thumb.jpg" alt="USB joystick grip" loading="lazy" width="400" height="300">
  ```
- **Forms:** Add `name` attributes, `required` fields. E.g.
  ```html
  <label for="customer-email">Email Address</label>
  <input type="email" id="customer-email" name="email" required>
  ```
- **Comments:** Insert `TODO` comments for tasks:
  - `<!-- TODO: Replace placeholder images with actual product photos -->`
  - `<!-- TODO: Connect this form to backend -->`

---

### **Summary of Code Examples:**

- **Header/Nav Update:**

  ```html
  <nav class="navbar navbar-expand-lg">
    <a class="navbar-brand" href="index.html">AviCore</a>
    <!-- ... -->
    <ul class="navbar-nav ml-auto">
      <li><a href="index.html">Home</a></li>
      <li class="nav-item dropdown">
        <a class="dropdown-toggle" href="#">Products</a>
        <ul class="dropdown-menu">
          <li><a href="usb-flight-controls.html">USB Flight Controls</a></li>
          <!-- ... -->
        </ul>
      </li>
      <!-- ... -->
      <li class="nav-item"><a href="quote.html" class="btn btn-primary">Request a Quote</a></li>
    </ul>
  </nav>
  ```

- **Quote Form Markup:**

  ```html
  <form action="#" method="post">
    <!-- Customer Info -->
    <label for="name">Full Name</label>
    <input type="text" id="name" name="full_name" required>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <!-- Project Type -->
    <fieldset>
      <legend>Project Type</legend>
      <label><input type="checkbox" name="project_type[]" value="joystick"> USB Joystick/Cyclic</label>
      <label><input type="checkbox" name="project_type[]" value="throttle"> Throttle Quadrant</label>
      <!-- ... -->
    </fieldset>
    <!-- Simulator Platform -->
    <label for="platform">Simulator Platform</label>
    <select id="platform" name="platform">
      <option>Microsoft Flight Simulator</option>
      <option>Prepar3D</option>
      <option>X-Plane</option>
      <!-- ... -->
    </select>
    <!-- Aircraft Type, Quantity, Description -->
    <label for="aircraft">Aircraft Type</label>
    <input type="text" id="aircraft" name="aircraft_type">
    <label for="quantity">Required Quantity</label>
    <input type="number" id="quantity" name="quantity">
    <label for="description">Requirement Description</label>
    <textarea id="description" name="description" rows="4"></textarea>
    <!-- Attachment -->
    <label for="attachment">Attach Drawing or Image</label>
    <input type="file" id="attachment" name="attachment">
    <!-- Timeline & Budget -->
    <label for="timeline">Timeline</label>
    <select id="timeline" name="timeline">
      <option>Urgent</option>
      <option>2–4 weeks</option>
      <option>1–3 months</option>
      <option>Exploratory</option>
    </select>
    <label for="budget">Budget Range</label>
    <select id="budget" name="budget">
      <option>$0–$5k</option>
      <option>$5k–$10k</option>
      <!-- ... -->
    </select>
    <button type="submit" class="btn btn-primary">Submit Quote Request</button>
    <!-- TODO: Connect this form to backend (Laravel/PHP or email service) -->
    <p id="form-success" style="display:none; color:green;">Thank you! Your request has been sent.</p>
  </form>
  ```

- **Product Card Template (e.g. for Products grid):**

  ```html
  <div class="col-lg-4 col-md-6">
    <div class="service-box">
      <img src="assets/images/usb-joystick.jpg" alt="USB Joystick Grip for Flight Simulators" loading="lazy">
      <h4>Aircraft-Specific USB Joystick</h4>
      <p>Custom 3D-printed joystick grip with USB HID electronics, trigger, trim hat and buttons.</p>
      <div class="chips">
        <span class="chip">USB HID</span>
        <span class="chip">MSFS Compatible</span>
        <span class="chip">P3D Compatible</span>
      </div>
      <a href="custom-joystick.html" class="btn btn-secondary">View Details</a>
      <a href="quote.html" class="btn btn-outline-secondary">Request Quote</a>
    </div>
  </div>
  ```

- **Lazy-Loading Images Example:**

  ```html
  <!-- Example in an article or gallery -->
  <img src="assets/images/cockpit-knobs.jpg"
       alt="3D printed cockpit knobs"
       class="img-fluid"
       loading="lazy"
       width="300" height="200">
  ```

---

### **Sources:** 

- The Aigocy template sections (Hero, Services, Works, Process, FAQs, etc.) were referenced to understand structure.
- Domain registrar pricing (Spaceship .com: \$8.88/yr, renew \$9.98; Cloudflare at-cost ~\$9.98, renew \$10.46) informed the branding/domain choice.
- Google SEO Starter Guide for unique titles, meta descriptions, sitemaps, structured data.
- AEO (Answer Engine Optimization) guidelines emphasize clear Q&A sections and concise answers to rank as AI search results.
- WCAG 2.2 guidelines (contrast, labels) ensure accessibility.

This completes the plan and detailed prompt for the AviCore site conversion, ready for implementation.