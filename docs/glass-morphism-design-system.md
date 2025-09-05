# Glass Morphism Design System Specification

## Overview
This document defines the iOS-style glass morphism design system for the DaraBoth portfolio website modernization. The design maintains the existing dark theme and purple accent colors while introducing frosted glass effects, transparency, and depth.

## Design Principles

### 1. Transparency & Depth
- **Primary Glass**: 15-25% opacity backgrounds
- **Secondary Glass**: 8-15% opacity for subtle elements
- **Accent Glass**: 30-40% opacity for interactive elements
- **Layered Depth**: Multiple glass layers with varying blur intensities

### 2. Blur Effects
- **Primary Blur**: `backdrop-filter: blur(20px)` for main containers
- **Secondary Blur**: `backdrop-filter: blur(12px)` for cards and panels
- **Subtle Blur**: `backdrop-filter: blur(8px)` for overlays
- **Intense Blur**: `backdrop-filter: blur(32px)` for modals and popups

### 3. Border & Glow
- **Glass Borders**: 1px solid with 20-30% white opacity
- **Soft Glow**: `box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37)`
- **Accent Glow**: Purple-tinted shadows for interactive elements
- **Inner Glow**: Subtle inset shadows for depth

## Color Palette

### Base Colors (Preserved)
```css
--primary: #050816;           /* Dark background */
--secondary: #aaa6c3;         /* Text secondary */
--tertiary: #151030;          /* Dark accent */
--accent: #915EFF;            /* Purple accent */
--white-100: #f3f3f3;         /* Light text */
```

### Glass Morphism Colors
```css
--glass-primary: rgba(255, 255, 255, 0.15);
--glass-secondary: rgba(255, 255, 255, 0.08);
--glass-accent: rgba(145, 94, 255, 0.25);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-hover: rgba(255, 255, 255, 0.25);
--glass-active: rgba(255, 255, 255, 0.35);
```

### Gradient Overlays
```css
--glass-gradient-1: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
--glass-gradient-2: linear-gradient(135deg, rgba(145, 94, 255, 0.1), rgba(145, 94, 255, 0.05));
--glass-gradient-3: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02));
```

## Component Specifications

### 1. Navigation Bar
```css
.glass-navbar {
  background: rgba(5, 8, 22, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
```

### 2. Hero Section
```css
.glass-hero-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
}
```

### 3. Section Cards
```css
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
}
```

### 4. Interactive Elements
```css
.glass-button {
  background: rgba(145, 94, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(145, 94, 255, 0.3);
  border-radius: 12px;
}

.glass-button:hover {
  background: rgba(145, 94, 255, 0.3);
  box-shadow: 0 4px 20px rgba(145, 94, 255, 0.4);
}
```

## Tailwind CSS Utilities

### Custom Glass Classes
```css
.glass-primary {
  @apply bg-white/15 backdrop-blur-xl border border-white/20;
}

.glass-secondary {
  @apply bg-white/8 backdrop-blur-lg border border-white/10;
}

.glass-accent {
  @apply bg-purple-500/25 backdrop-blur-lg border border-purple-500/30;
}

.glass-card {
  @apply glass-primary rounded-2xl shadow-2xl;
}

.glass-hover {
  @apply hover:bg-white/25 hover:-translate-y-1 transition-all duration-300;
}
```

### Blur Utilities
```css
.blur-glass-sm { backdrop-filter: blur(8px); }
.blur-glass-md { backdrop-filter: blur(12px); }
.blur-glass-lg { backdrop-filter: blur(16px); }
.blur-glass-xl { backdrop-filter: blur(20px); }
.blur-glass-2xl { backdrop-filter: blur(32px); }
```

## Animation Guidelines

### Smooth Transitions
- **Duration**: 300ms for hover effects, 500ms for state changes
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for natural feel
- **Properties**: Transform, opacity, background, box-shadow

### Glass Morphism Animations
```css
.glass-fade-in {
  animation: glassAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes glassAppear {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(16px);
    transform: translateY(0);
  }
}
```

## Responsive Considerations

### Mobile Optimizations
- Reduce blur intensity on mobile for performance
- Increase touch targets for glass buttons
- Simplify glass effects on smaller screens

### Browser Support
- Fallback backgrounds for browsers without backdrop-filter support
- Progressive enhancement approach
- Webkit prefixes for Safari compatibility

## Accessibility Guidelines

### Contrast Requirements
- Ensure 4.5:1 contrast ratio for text on glass backgrounds
- Use darker overlays when needed for readability
- Provide high contrast mode alternatives

### Focus States
```css
.glass-focus {
  outline: 2px solid rgba(145, 94, 255, 0.8);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(145, 94, 255, 0.2);
}
```

## Implementation Priority

### Phase 1: Core Components
1. Navigation bar glass effect
2. Hero section glass container
3. Basic card glass styling

### Phase 2: Interactive Elements
1. Button glass effects
2. Form input glass styling
3. Modal and popup glass

### Phase 3: Advanced Effects
1. Layered glass compositions
2. Dynamic blur adjustments
3. Performance optimizations

## Performance Considerations

### Optimization Strategies
- Use `will-change: backdrop-filter` sparingly
- Implement intersection observer for blur effects
- Reduce glass complexity on low-end devices
- Cache backdrop-filter calculations

### Browser Performance
- Test on Safari, Chrome, Firefox, Edge
- Monitor frame rates during animations
- Provide fallbacks for unsupported browsers
