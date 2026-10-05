# Frontend Design Specification

**Project:** Software Developer Portfolio\
**Owner:** Samuel Mensah Quaye\
**Status:** Source of truth for frontend visual design\
**Frontend:** React + Vite + Tailwind CSS\
**Theme:** Light, Dark, and System preference

------------------------------------------------------------------------

## 1. Purpose

This document defines the visual design system and frontend presentation
rules for the Software Developer Portfolio.

All public pages, admin pages, reusable components, responsive layouts,
theme behavior, and interaction patterns should follow this
specification unless a requirement is explicitly changed.

The portfolio should present Samuel Mensah Quaye primarily as a
**software developer capable of designing, building, securing, and
deploying complete web applications**.

Cybersecurity, cloud, and DevSecOps experience should support the
software-development narrative rather than compete with it.

------------------------------------------------------------------------

## 2. Design Objectives

The frontend should communicate:

-   Professional software-development capability.
-   Strong full-stack engineering skills.
-   Practical project experience.
-   Security-aware development.
-   Cloud and deployment knowledge.
-   Clean engineering and attention to detail.

The interface should feel closer to a polished software product than a
generic personal portfolio template.

### Avoid

-   Excessive animation.
-   Neon cyberpunk styling.
-   Heavy gradients everywhere.
-   Crowded layouts.
-   Generic stock imagery.
-   Excessive shadows.
-   Decorative effects that distract from project content.
-   Inconsistent page-specific styling.

------------------------------------------------------------------------

## 3. Visual Direction

  Attribute   Direction
  ----------- -----------------------------------------------------
  Style       Modern, technical, professional
  Mood        Confident, clean, focused
  Density     Spacious public pages; more compact admin interface
  Shapes      Rounded cards and controls
  Borders     Subtle slate borders
  Shadows     Minimal
  Accent      Cyan
  Imagery     Real project screenshots and application visuals
  Animation   Restrained and functional

Projects should remain the strongest visual evidence of capability.

------------------------------------------------------------------------

# 4. Theme System

The application must support three theme preferences:

1.  **Light**
2.  **Dark**
3.  **System**

`System` follows the operating system or browser `prefers-color-scheme`
preference.

The selected preference should persist between visits.

## 4.1 Default behavior

The initial preference should be:

``` text
system
```

When `system` is selected:

-   Use dark mode when the operating system prefers dark.
-   Use light mode when the operating system prefers light.
-   React to operating-system theme changes when practical.

## 4.2 Theme persistence

Store the selected preference in:

``` text
localStorage
```

Suggested key:

``` text
portfolio-theme
```

Suggested values:

``` text
light
dark
system
```

Authentication tokens must **not** be stored in localStorage. Theme
preference is non-sensitive and may be stored there.

## 4.3 Theme architecture

Use a centralized theme provider.

Suggested structure:

``` text
ThemeProvider
    |
    +-- light
    |
    +-- dark
    |
    +-- system
          |
          +-- prefers-color-scheme
```

The resolved dark theme should apply the `dark` class to the root HTML
element:

``` html
<html class="dark">
```

Components should not contain independent JavaScript theme decisions.

Theme behavior belongs in the centralized theme system.

## 4.4 Prevent theme flash

The application should avoid displaying the light theme briefly before
switching to dark mode during initial page load.

Theme resolution should therefore occur as early as practical during
application startup.

------------------------------------------------------------------------

# 5. Color System

Cyan remains the brand accent in both themes.

It should be used selectively for:

-   Links.
-   Active states.
-   Section labels.
-   Primary buttons.
-   Focus indicators.
-   Selected controls.

It should not dominate large page surfaces.

## 5.1 Dark Theme

  Role                Tailwind               Approx. Hex
  ------------------- ---------------------- -------------
  Page background     `slate-950`            `#020617`
  Main surface        `slate-900`            `#0F172A`
  Secondary surface   `slate-900/60`         ---
  Border              `slate-800`            `#1E293B`
  Primary text        `slate-50` / `white`   `#F8FAFC`
  Secondary text      `slate-400`            `#94A3B8`
  Accent              `cyan-400`             `#22D3EE`
  Accent hover        `cyan-300`             `#67E8F9`
  Success             `emerald-400`          `#34D399`
  Error               `red-400`              `#F87171`

## 5.2 Light Theme

  Role                Tailwind        Approx. Hex
  ------------------- --------------- -------------
  Page background     `slate-50`      `#F8FAFC`
  Main surface        `white`         `#FFFFFF`
  Secondary surface   `slate-100`     `#F1F5F9`
  Border              `slate-200`     `#E2E8F0`
  Primary text        `slate-950`     `#020617`
  Secondary text      `slate-600`     `#475569`
  Accent              `cyan-600`      `#0891B2`
  Accent hover        `cyan-700`      `#0E7490`
  Success             `emerald-600`   `#059669`
  Error               `red-600`       `#DC2626`

## 5.3 Example theme-aware component

``` jsx
<div
  className="
    bg-white text-slate-950
    dark:bg-slate-950 dark:text-white
  "
>
  ...
</div>
```

Do not hard-code dark-only styling into reusable components.

------------------------------------------------------------------------

# 6. Theme Control

The public navigation should include a compact theme control.

Desktop concept:

``` text
Samuel Mensah Quaye        Home  Projects  Contact  Theme
```

The control should allow:

``` text
Light
Dark
System
```

A simple icon button may display the currently resolved theme, but users
must still have a clear way to choose System explicitly.

On mobile, the theme control should remain available inside or alongside
the navigation menu.

The admin interface should use the same theme preference.

Switching themes should affect the entire application.

------------------------------------------------------------------------

# 7. Typography

Use a clean sans-serif type system.

The initial implementation may use Tailwind's system sans-serif stack. A
custom web font should only be introduced if it materially improves the
finished visual identity.

## Recommended scale

### Hero heading

Desktop:

``` text
48-72px
```

Mobile:

``` text
40-48px
```

Characteristics:

-   Bold.
-   Tight tracking.
-   Strong contrast.

### Section heading

``` text
30-40px
```

### Card heading

``` text
18-24px
```

### Body text

``` text
16-18px
```

Use generous line height.

### Section eyebrow

``` text
12-14px
```

Characteristics:

-   Semibold.
-   Uppercase.
-   Increased letter spacing.
-   Cyan accent.

### Technical metadata

``` text
12-14px
```

Keep compact but readable.

------------------------------------------------------------------------

# 8. Spacing and Layout

Maximum public content width:

``` text
max-w-7xl
```

Approximately:

``` text
1280px
```

Recommended container:

``` text
mx-auto max-w-7xl px-6 lg:px-8
```

## Horizontal spacing

Mobile:

``` text
24px
```

Desktop:

``` text
32px
```

## Major section spacing

Desktop:

``` text
80-128px
```

Mobile:

``` text
64-80px
```

Use generous whitespace to separate concepts.

Avoid excessively long lines of body text.

------------------------------------------------------------------------

# 9. Public Navigation

Primary navigation:

-   Home
-   Projects
-   Contact
-   Theme control

The developer name acts as the Home link.

An About page should only be introduced if About content becomes
substantial enough to justify a dedicated page.

## Desktop

``` text
Name / Brand                         Navigation
```

## Mobile

Use a compact accessible navigation menu.

Requirements:

-   Keyboard accessible.
-   Visible focus states.
-   Clear active route.
-   Theme control available.
-   No horizontal overflow.

The header should remain visually lightweight.

------------------------------------------------------------------------

# 10. Home Page

The homepage should follow this content hierarchy.

## 10.1 Hero

Purpose:

Immediately establish the developer identity and value proposition.

Content:

-   Samuel Mensah Quaye.
-   Software Developer / Full-Stack Developer.
-   Concise engineering-focused introduction.
-   View Projects CTA.
-   Contact CTA.

The hero should not contain excessive text.

## 10.2 Capabilities

Four initial capability groups:

### Frontend

-   React
-   Vite
-   Tailwind CSS
-   JavaScript

### Backend

-   Node.js
-   Express
-   REST APIs

### Database

-   MongoDB
-   Mongoose

### Cloud & Deployment

-   Cloudflare
-   AWS
-   Render
-   Netlify

These should be concise capability cards rather than skill-percentage
meters.

Do not use arbitrary skill percentages.

## 10.3 Featured Projects

Featured projects should come from the backend.

Example:

``` http
GET /api/v1/projects?featured=true
```

Each card should support:

-   Cover image.
-   Category.
-   Project title.
-   Summary.
-   Technology tags.
-   View Project link.

## 10.4 About

Keep the homepage About section concise.

Focus on:

-   Full-stack development.
-   Building complete applications.
-   Maintainability.
-   Security awareness.
-   Problem solving.
-   Cloud deployment.

## 10.5 Call to Action

End with a clear CTA for:

-   Software-development projects.
-   Collaborations.
-   Professional opportunities.

------------------------------------------------------------------------

# 11. Projects Page

The Projects page should showcase all published projects.

## Layout

Mobile:

``` text
1 column
```

Tablet:

``` text
2 columns
```

Large desktop:

``` text
up to 3 columns
```

## Project card

Each project card should prioritize:

1.  Cover image.
2.  Category.
3.  Project title.
4.  Summary.
5.  Core technologies.
6.  View Project action.

Suggested image ratio:

``` text
16:10
```

Filtering should only be introduced when enough projects exist to make
it useful.

Potential filters:

-   All
-   Full Stack
-   Frontend
-   Backend
-   Other active categories

Filters should use backend-driven categories rather than duplicated
hard-coded category data.

------------------------------------------------------------------------

# 12. Project Detail Page

Project detail pages should function as **case studies**, not simply
enlarged project cards.

Recommended structure:

``` text
Project Header
    |
    +-- Title
    +-- Category
    +-- Summary
    +-- Role / context
    +-- Live site
    +-- Repository

Cover Image

Project Overview

Problem

Solution

Technology Stack

Architecture

Key Features

Challenges

Outcome

Screenshot Gallery

Related / Back to Projects

Contact CTA
```

Only render sections for which data exists.

Do not show empty headings.

## Technology stack

Use compact technology tags.

## Project images

Use real project screenshots whenever possible.

Do not stretch screenshots.

Choose between:

``` text
object-cover
```

and:

``` text
object-contain
```

based on the image purpose.

------------------------------------------------------------------------

# 13. Project Card Design

Recommended structure:

``` text
+--------------------------------+
|                                |
|       Project Screenshot       |
|                                |
+--------------------------------+
| CATEGORY                       |
|                                |
| Project Title                  |
|                                |
| Short project summary          |
|                                |
| React  Node  MongoDB           |
|                                |
| View project ->                |
+--------------------------------+
```

## Styling

Dark:

``` text
bg-slate-900/60
border-slate-800
```

Light:

``` text
bg-white
border-slate-200
```

Radius:

``` text
rounded-2xl
```

Hover behavior:

-   Subtle image scale.
-   Border emphasis if useful.
-   Link color change.
-   No dramatic movement.

------------------------------------------------------------------------

# 14. Contact Page

Desktop should use a two-column layout where appropriate:

``` text
Contact information     Contact form
```

Mobile:

``` text
Contact information

Contact form
```

## Form fields

Potential fields:

-   Name.
-   Email.
-   Subject.
-   Message.

Requirements:

-   Labels above fields.
-   Clear validation messages.
-   Loading state.
-   Success state.
-   Error state.
-   Turnstile state.
-   Accessible focus styles.

Do not use placeholder text as a replacement for labels.

------------------------------------------------------------------------

# 15. Buttons

## Primary button

Dark theme:

``` text
bg-cyan-400
text-slate-950
hover:bg-cyan-300
```

Light theme:

``` text
bg-cyan-600
text-white
hover:bg-cyan-700
```

Recommended:

``` text
rounded-lg
font-semibold
```

## Secondary button

Use:

-   Transparent or subtle surface.
-   Visible border.
-   Strong text contrast.
-   Clear hover state.

Buttons should not rely solely on color to communicate disabled or
loading states.

------------------------------------------------------------------------

# 16. Form Controls

Inputs should support both themes.

Light:

``` text
bg-white
border-slate-300
text-slate-950
```

Dark:

``` text
dark:bg-slate-900
dark:border-slate-700
dark:text-white
```

Focus should use a visible cyan indicator.

Every field should support:

-   Default.
-   Hover.
-   Focus.
-   Invalid.
-   Disabled.

------------------------------------------------------------------------

# 17. Admin Interface

The admin interface should share the portfolio's design language while
prioritizing efficiency.

It is an application workspace, not a marketing page.

## Desktop structure

``` text
+----------------+--------------------------------+
|                | Top Bar                        |
| Sidebar        +--------------------------------+
|                |                                |
| Dashboard      | Main Content                   |
| Projects       |                                |
| Categories     |                                |
| Media          |                                |
| Enquiries      |                                |
| Settings       |                                |
| Audit          |                                |
|                |                                |
| Logout         |                                |
+----------------+--------------------------------+
```

## Main destinations

-   Dashboard.
-   Projects.
-   Categories.
-   Media.
-   Enquiries.
-   Settings.
-   Audit / Activity.
-   Logout.

## Admin rules

-   Use structured tables/lists for management screens.
-   Avoid decorative marketing-style cards where data tables are more
    appropriate.
-   Make Create and Save actions prominent.
-   Confirm destructive actions.
-   Clearly identify Draft, Published, Archived, Read, Unread, and
    similar states.
-   Divide long forms into logical sections.
-   Display loading and error states intentionally.

------------------------------------------------------------------------

# 18. Media Manager

The media interface should support:

-   Image thumbnails.
-   Upload.
-   Upload progress.
-   Selection.
-   Alt text.
-   Media metadata.
-   Usage awareness.
-   Safe deletion behavior.

R2 remains the media storage layer.

The interface should not expose storage credentials or implementation
secrets.

------------------------------------------------------------------------

# 19. Responsive Design

Implementation should be mobile-first.

## Requirements

-   No horizontal page scrolling.
-   Navigation collapses cleanly.
-   Hero typography scales correctly.
-   Grids collapse naturally.
-   Buttons remain usable on touch devices.
-   Project screenshots remain legible.
-   Admin navigation remains usable on smaller screens.

Touch targets should generally be at least:

``` text
44px x 44px
```

Admin tables may:

-   Transform into stacked layouts, or
-   Scroll horizontally inside a controlled container.

The entire page should not horizontally scroll.

------------------------------------------------------------------------

# 20. Interaction and Motion

Motion should be restrained.

Typical transition duration:

``` text
150-300ms
```

Appropriate uses:

-   Link hover.
-   Button hover.
-   Navigation state.
-   Card image scale.
-   Menu expansion.
-   Modal transitions.

Avoid:

-   Autoplay decorative animations.
-   Excessive parallax.
-   Custom cursor effects.
-   Large looping animations.
-   Constant glowing effects.

Respect:

``` css
prefers-reduced-motion
```

when motion is introduced.

------------------------------------------------------------------------

# 21. Accessibility

Accessibility is part of the design specification.

Requirements:

-   Semantic HTML.
-   Logical heading hierarchy.
-   Keyboard-accessible navigation.
-   Keyboard-accessible dialogs.
-   Keyboard-accessible forms.
-   Visible focus indicators.
-   Sufficient color contrast.
-   Meaningful image alt text.
-   Form errors associated with fields.
-   Status information expressed with text as well as color.

Decorative images should use:

``` html
alt=""
```

Meaningful project images should have useful alternative text.

------------------------------------------------------------------------

# 22. Loading States

Pages that retrieve backend data must intentionally support loading
states.

Examples:

-   Project list loading.
-   Project detail loading.
-   Admin dashboard loading.
-   Media loading.
-   Enquiries loading.

For content-heavy areas, skeleton placeholders may be introduced later.

Avoid large layout shifts when data arrives.

------------------------------------------------------------------------

# 23. Empty States

Empty states should explain what happened and, where appropriate, what
the user can do next.

Examples:

Public:

``` text
No projects are currently available.
```

Admin:

``` text
No projects yet.
Create your first project.
```

Empty states should not appear as broken or blank screens.

------------------------------------------------------------------------

# 24. Error States

Errors should be:

-   Clear.
-   Concise.
-   Non-technical for public users.
-   Actionable where possible.

Example:

``` text
Projects could not be loaded.
Please try again.
```

Detailed server internals, stack traces, tokens, database information,
or storage information must never be shown in the frontend.

------------------------------------------------------------------------

# 25. Images and Media

Use actual project screenshots whenever available.

Avoid generic stock photography for technical project sections.

Recommended project cover ratio:

``` text
16:10
```

Media should be:

-   Responsive.
-   Optimized.
-   Correctly sized.
-   Given appropriate alt text.
-   Loaded efficiently.

Lazy loading should be used for appropriate below-the-fold images.

------------------------------------------------------------------------

# 26. Reusable Design Tokens

Initial Tailwind conventions:

  Purpose                Convention
  ---------------------- ----------------------------------
  Content width          `mx-auto max-w-7xl px-6 lg:px-8`
  Card radius            `rounded-2xl`
  Large feature radius   `rounded-3xl`
  Button radius          `rounded-lg`
  Dark background        `dark:bg-slate-950`
  Dark surface           `dark:bg-slate-900`
  Dark border            `dark:border-slate-800`
  Dark muted text        `dark:text-slate-400`
  Light background       `bg-slate-50`
  Light surface          `bg-white`
  Light border           `border-slate-200`
  Light muted text       `text-slate-600`
  Dark accent            `dark:text-cyan-400`
  Light accent           `text-cyan-600`

These are initial conventions, not permission to duplicate long class
strings throughout the application.

Reusable components should centralize repeated visual patterns.

------------------------------------------------------------------------

# 27. Component Strategy

Prefer reusable components for repeated patterns.

Examples:

``` text
components/
|
+-- layout/
|   +-- Navbar.jsx
|   +-- Footer.jsx
|   +-- PublicLayout.jsx
|   +-- AdminLayout.jsx
|
+-- ui/
|   +-- Button.jsx
|   +-- ProjectCard.jsx
|   +-- LoadingState.jsx
|   +-- ErrorState.jsx
|   +-- EmptyState.jsx
|   +-- ThemeToggle.jsx
|
+-- admin/
    +-- Sidebar.jsx
    +-- AdminHeader.jsx
```

Do not abstract a component merely because it appears once.

Create reusable components when repetition or behavioral consistency
justifies them.

------------------------------------------------------------------------

# 28. Theme Implementation Structure

Recommended frontend structure:

``` text
src/
|
+-- context/
|   +-- ThemeContext.jsx
|
+-- hooks/
|   +-- useTheme.js
|
+-- components/
    +-- ui/
        +-- ThemeToggle.jsx
```

Possible theme context API:

``` js
{
  theme,
  resolvedTheme,
  setTheme
}
```

Where:

``` text
theme
```

is one of:

``` text
light
dark
system
```

and:

``` text
resolvedTheme
```

is:

``` text
light
dark
```

------------------------------------------------------------------------

# 29. Public vs Admin Visual Hierarchy

## Public interface

Prioritize:

-   Presentation.
-   Project storytelling.
-   Large imagery.
-   Whitespace.
-   Clear calls to action.

## Admin interface

Prioritize:

-   Speed.
-   Information density.
-   Forms.
-   Tables.
-   Status visibility.
-   Management actions.

Both interfaces should still feel like parts of the same product.

------------------------------------------------------------------------

# 30. Frontend Definition of Done

The frontend design is considered complete when:

-   Public pages share one coherent visual system.
-   Light mode works throughout the application.
-   Dark mode works throughout the application.
-   System theme follows the device preference.
-   Theme preference persists.
-   No distracting theme flash occurs during startup.
-   Public projects use real backend data.
-   Project details use real backend data.
-   R2 images render correctly.
-   Admin authentication works through the secure HTTP-only cookie.
-   Admin management interfaces follow the same design system.
-   Mobile, tablet, and desktop layouts are usable.
-   Loading states are designed.
-   Empty states are designed.
-   Error states are designed.
-   Form validation states are designed.
-   Unauthorized states are handled.
-   Keyboard navigation is functional.
-   Focus states are visible.
-   Accessibility is reviewed.
-   Placeholder styling has been removed before production deployment.

------------------------------------------------------------------------

# 31. Implementation Principle

> **Design first, componentize repeated patterns, then connect real
> data.**

New frontend work should reuse the layout, theme system, design tokens,
components, and interaction patterns defined in this document.

Page-specific styling should only be introduced when there is a clear
design reason.

When a visual requirement changes, update this document so that
`frontend-design.md` remains the frontend visual source of truth.
