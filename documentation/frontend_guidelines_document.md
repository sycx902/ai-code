# Frontend Guidelines for ai-code

This document outlines clear, easy-to-understand guidelines for building and maintaining the frontend of the `ai-code` project. Even if you’re new to frontend work, these principles will help everyone stay on the same page and create a user-friendly, high-performing interface.

---

## 1. Frontend Architecture

### Overview
- **Framework & Language**: We’ll use **React** alongside **TypeScript**. React gives us a flexible, component-based structure, and TypeScript adds type safety—catching errors early.
- **Build Tool**: **Vite** for fast bundling and development. It offers hot module replacement (HMR) and quick startup times.
- **Package Management**: **npm** or **yarn**, depending on team preference.

### Scalability, Maintainability, Performance
- **Modular Components**: Each UI element lives in its own folder with code, styles, and tests—easy to find and update.
- **Code Splitting & Lazy Loading**: Break code into chunks so users only download what they need when they need it.
- **Strict Typing**: TypeScript interfaces and types prevent accidental misuse of data.
- **Consistent Folder Structure** ensures new features fit in without confusion.

---

## 2. Design Principles

1. **Usability**: Keep interfaces intuitive—labels and buttons should clearly describe their purpose.
2. **Accessibility**: Follow WCAG guidelines: provide alt text for images, use semantic HTML (e.g., `<button>`, `<nav>`), ensure color contrast.
3. **Responsiveness**: Design mobile-first using CSS Grid and Flexbox. Test at different breakpoints (mobile, tablet, desktop).
4. **Consistency**: Reuse components (buttons, form inputs) so the look and feel stays uniform.

_Application:_ All forms share the same input styles and validation messages. Navigation looks and works the same on every page.

---

## 3. Styling and Theming

### Styling Approach
- **Utility-First CSS with Tailwind CSS**: Fast to write, customizable, and avoids naming wars.
- **Component-Level Styles**: When complex or themed styles are needed, we use CSS Modules alongside SASS.

### Theming
- We’ll define a **single source of truth** (`theme.ts`) for colors, spacing, and typography.
- Toggle between light and dark mode by switching CSS variables at the root level.

### Visual Style
- **Overall Look**: Modern flat design with subtle glassmorphism overlays (semi-transparent panels with soft shadows).
- **Color Palette**:
  • Primary: #4F46E5 (indigo)  
  • Secondary: #10B981 (emerald)  
  • Background: #F3F4F6 (light gray)  
  • Surface (cards, modals): rgba(255, 255, 255, 0.8) for glass effect  
  • Text Primary: #111827 (dark slate)  
  • Accent: #F59E0B (amber)

### Typography
- **Font Family**: Inter (clean, modern, highly readable)
- **Font Sizes**: Use a scalable scale (e.g., 14px, 16px, 20px, 24px, 32px).

---

## 4. Component Structure

### Organization
```
src/
├── components/       # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.test.tsx
│   └── ...
├── features/         # Page-level or feature-specific components
│   └── Dashboard/
├── hooks/            # Custom React hooks
├── pages/            # Top-level routes (if using Next.js)
├── services/         # API calls, data-fetch logic
└── utils/            # Helper functions
```

### Reusability & Maintainability
- **One Responsibility**: Each component handles a single piece of UI.
- **Clear Props**: Define props interfaces in TypeScript so developers know what a component needs.
- **Storybook** (optional): Document components in isolation for easier testing and design sign-off.

---

## 5. State Management

- **Local State**: Use React’s built-in `useState` and `useReducer` for component-level state.
- **Global State**: **Redux Toolkit** for shared state (e.g., user profile, authentication status). Toolkit reduces boilerplate and encourages best practices.
- **Side Effects & Async Logic**: Use **Redux Thunk** or **RTK Query** to handle API calls and caching smoothly.

_All state logic lives in `src/store/`, with slices per feature (e.g., `authSlice`, `settingsSlice`)._

---

## 6. Routing and Navigation

- **Library**: **React Router v6**
- **Structure**:
  • `/` → Home dashboard  
  • `/login` → Login page  
  • `/projects` → AI project list  
  • `/projects/:id` → Project details  

- **Navigation Patterns**:
  • Use `<Link>` for internal navigation (no page reload).  
  • Show active link styles for clarity.  
  • Protect private routes with a wrapper that checks auth state.

---

## 7. Performance Optimization

1. **Lazy Loading**: React’s `lazy` and `Suspense` to split heavy components (e.g., charts, editors).
2. **Image Optimization**: Serve compressed WebP or AVIF formats; use `loading="lazy"`.
3. **Bundle Analysis**: Run tools like `rollup-plugin-visualizer` or `webpack-bundle-analyzer` to keep bundles small.
4. **Caching**: Leverage HTTP caching and Redux state caching (with RTK Query) to minimize redundant API calls.

Result: Faster first render, snappier interactions, reduced data usage.

---

## 8. Testing and Quality Assurance

### Unit & Integration Tests
- **Jest** + **React Testing Library** for testing components and hooks in isolation.
- Aim for high coverage on critical logic (forms, state reducers, utility functions).

### End-to-End Tests
- **Cypress** for full-flow tests: logging in, navigating, creating and viewing AI projects.

### Code Quality Tools
- **ESLint** with Airbnb or custom rules—ensures consistent code style.
- **Prettier** for automatic formatting.
- **Husky** + **lint-staged** to run linting and tests on every commit.

---

## 9. Conclusion and Summary

In this document, we’ve laid out a clear path for building the `ai-code` frontend:
- A **React + TypeScript** base for robust, scalable code
- **Tailwind CSS** and modern design (flat + glassmorphism) for consistent, attractive UI
- **Component-based architecture** to keep things modular and reusable
- **Redux Toolkit** and **React Router** for state and navigation
- **Performance optimizations** and **comprehensive testing** to deliver a smooth user experience

By following these guidelines, anyone joining the project—regardless of experience—can quickly understand the setup, contribute high-quality code, and ensure our AI tools look and feel professional. Let’s get coding!