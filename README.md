# Daraboth Portfolio Website

A modern, interactive portfolio website built with React, Three.js, and advanced web technologies. This project showcases the work and skills of Daraboth, a software engineer specializing in full-stack web development.

## 🚀 Live Demo

**Website**: [https://vongpichdaraboth.netlify.app/](https://vongpichdaraboth.netlify.app/)

## 📝 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Key Components](#-key-components)
- [3D Canvas Components](#-3d-canvas-components)
- [Magic UI Components](#-magic-ui-components)
- [API Integration](#-api-integration)
- [PWA Features](#-pwa-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

### Core Features
- **Interactive 3D Elements**: Three.js powered 3D stars background and canvas components
- **Smooth Animations**: Framer Motion animations throughout the interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Animation**: Dynamic text animations using react-type-animation
- **Visitor Tracking**: Real-time visitor counter with API integration
- **Testimonial System**: Dynamic feedback collection and display
- **Contact Form**: Email integration with EmailJS
- **PWA Support**: Progressive Web App with service worker and notifications

### Advanced Features
- **AI-Powered Content**: Dynamic about section using OpenAI API
- **Push Notifications**: Browser notification system with VAPID keys
- **3D Models**: Interactive 3D models (Earth, Ball, Computers, Stars)
- **Magic UI Components**: Custom animated components (RetroGrid, NumberTicker, etc.)
- **Real-time Updates**: Live visitor tracking and dynamic content updates

## 🛠️ Technologies Used

### Frontend Framework
- **React 18.2.0** - Main UI framework
- **Vite 4.1.0** - Build tool and development server
- **React Router DOM 6.8.1** - Client-side routing

### Styling & UI
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **Framer Motion 11.5.6** - Animation library
- **React Icons 5.3.0** - Icon library
- **Material-UI 6.3.1** - Component library

### 3D Graphics
- **Three.js 0.151.0** - 3D graphics library
- **React Three Fiber 8.11.1** - React renderer for Three.js
- **React Three Drei 9.102.3** - Useful helpers for React Three Fiber
- **Maath 0.5.2** - Mathematical utilities

### Backend Integration
- **Axios 1.7.7** - HTTP client
- **EmailJS 3.10.0** - Email service integration
- **Google Generative AI 0.3.0** - AI content generation

### Additional Libraries
- **React Type Animation 3.2.0** - Typing animations
- **React Tilt 1.0.2** - 3D tilt effects
- **React Tooltip 5.28.0** - Tooltip components
- **React Window 1.8.10** - Virtualized lists
- **Sonner 1.5.0** - Toast notifications
- **Moment.js 2.30.1** - Date manipulation
- **UUID 10.0.0** - Unique identifier generation

## 📁 Project Structure

```
daraboth/
├── public/                     # Static assets
│   ├── icons/                  # PWA icons
│   ├── screenshots/            # App screenshots
│   ├── desktop_pc/             # 3D model assets
│   ├── gojo/                   # 3D model assets
│   ├── planet/                 # 3D model assets
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
├── src/
│   ├── app/                    # App router components
│   ├── assets/                 # Images and static files
│   │   ├── company/            # Company logos
│   │   ├── tech/               # Technology icons
│   │   └── work/               # Project images
│   ├── components/             # React components
│   │   ├── canvas/             # 3D canvas components
│   │   ├── magic-ui/           # Custom UI components
│   │   └── pages/              # Page components
│   ├── constants/              # Data constants
│   ├── hoc/                    # Higher-order components
│   ├── hock/                   # Custom hooks
│   ├── lib/                    # Utility libraries
│   ├── magic/                  # Magic UI components
│   ├── utils/                  # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── netlify.toml                # Netlify deployment config
└── README.md                   # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daraboth
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

## 🔑 Key Components

### Main Components
#### `Hero.jsx`
- Animated hero section with type animation
- Gradient text effects
- Interactive scroll indicator
- RetroGrid background animation

#### `About.jsx`
- AI-powered dynamic content using OpenAI API
- Service cards with tilt effects
- Framer Motion animations
- Responsive grid layout

#### `Experience.jsx`
- Timeline component with work experience
- Company logos and details
- Animated progress indicators
- Responsive design

#### `Tech.jsx`
- Technology stack display
- Interactive technology cards
- Hover effects and animations
- Grid layout with icons

#### `Works.jsx`
- Project showcase with images
- Technology tags
- Source code links
- Responsive project cards

#### `Contact.jsx`
- Contact form with EmailJS integration
- Form validation
- Success/error notifications
- Responsive design

### Special Components
#### `VisitorTracker.jsx`
- Real-time visitor counting
- API integration for tracking
- NumberTicker animation
- Persistent visitor data

#### `NotificationPrompt.jsx`
- Push notification setup
- VAPID key integration
- Service worker registration
- User permission handling

#### `TestimonialFormWrapper.jsx`
- Dynamic testimonial system
- Form validation
- Real-time updates
- Responsive design

## 🌌 3D Canvas Components

### `Stars.jsx`
- Animated 3D stars background
- Random star generation
- Continuous rotation animation
- Performance optimized

### `Earth.jsx`
- Interactive 3D Earth model
- Rotation controls
- Texture mapping
- Responsive sizing

### `Ball.jsx`
- 3D ball animation
- Physics-based movement
- Interactive controls
- Smooth animations

### `Computers.jsx`
- 3D computer model
- Interactive elements
- Texture loading
- Performance optimization

## 🌠 Magic UI Components

### `RetroGrid.jsx`
- Animated grid background
- CSS-based animations
- Responsive design
- Performance optimized

### `NumberTicker.jsx`
- Animated number counter
- Smooth transitions
- Framer Motion integration
- Customizable styling

### `Marquee.jsx`
- Horizontal scrolling text
- Customizable speed
- Responsive design
- Smooth animations

### `RainbowButton.jsx`
- Gradient button effects
- Hover animations
- Customizable colors
- Modern design

## 🔗 API Integration

### OpenAI Integration
- Dynamic content generation
- About section personalization
- Error handling
- Caching mechanism

### EmailJS Integration
- Contact form submission
- Email templates
- Success/error handling
- Form validation

### Visitor Tracking API
- Real-time visitor counting
- Route tracking
- Data persistence
- Analytics integration

## 🌐 PWA Features

### Service Worker
- Offline functionality
- Cache management
- Background sync
- Push notifications

### Manifest Configuration
- App icons (multiple sizes)
- Theme colors
- Display mode
- Screenshots

### Push Notifications
- VAPID key integration
- User subscription management
- Device identification
- Backend integration

## 🚀 Deployment

### Netlify Deployment
The project is configured for Netlify deployment with:
- Automatic builds from Git
- Custom redirects
- Environment variables
- PWA support

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});
```

### Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        // ... more colors
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        grid: "grid 15s linear infinite",
        // ... more animations
      },
    },
  },
};
```

## 💡 Key Features Breakdown

### Animation System
- **Framer Motion**: Page transitions, component animations
- **CSS Animations**: Grid animations, gradient effects
- **Three.js Animations**: 3D model interactions
- **Type Animations**: Text typing effects

### Responsive Design
- **Mobile-first approach**
- **Breakpoint system**: xs, sm, md, lg, xl
- **Flexible layouts**
- **Touch-friendly interactions**

### Performance Optimization
- **Code splitting**
- **Lazy loading**
- **Image optimization**
- **Bundle optimization**

### Accessibility
- **Semantic HTML**
- **ARIA labels**
- **Keyboard navigation**
- **Screen reader support**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🧑‍💻❤️‍🔥 Author

**Daraboth** - Software Engineer
- Portfolio: [https://vongpichdaraboth.netlify.app/](https://vongpichdaraboth.netlify.app/)
- Experience: Full-stack development, React, Three.js, Node.js
- Specialties: Frontend development, 3D graphics, PWA development

## 🙏 Acknowledgments

- Three.js community for 3D graphics support
- Framer Motion team for animation library
- Tailwind CSS for utility-first styling
- React community for component ecosystem
- Netlify for hosting and deployment
---

**Note**: This project uses several external APIs and services. Make sure to configure the necessary API keys and environment variables before running the application. 
