# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React Native application (v0.81.4) using TypeScript and React Navigation. The app features an authentication flow with user login/signup and includes image upload functionality. It's configured with multiple color themes and uses AsyncStorage for persistent data storage.

## Development Commands

### Core Development
```bash
# Start Metro bundler (required for development)
npm start

# Build and run on Android
npm run android

# Build and run on iOS (requires additional setup)
npm run ios

# Run tests
npm test

# Run linting
npm run lint
```

### iOS-Specific Setup
```bash
# Install Ruby dependencies (first time setup)
bundle install

# Install CocoaPods dependencies (after cloning or updating native deps)
bundle exec pod install
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- App.test.tsx
```

## Architecture Overview

### Navigation Structure
The app uses **conditional navigation** based on authentication state:
- **Authenticated users**: Access `Home`, `Details`, and `UploadImage` screens
- **Unauthenticated users**: Limited to `SignIn` and `SignUp` screens

Navigation is managed in two places:
1. `src/navigation/AppNavigation.jsx` - Main navigation logic with auth state checking
2. `App.tsx` - Root component that wraps navigation with `AuthProvider`

### Authentication Flow
- **Context-based**: Uses `AuthContext` (`src/context/AuthContext.js`) for global auth state
- **Persistent storage**: User data and tokens stored in AsyncStorage
- **Dual auth checking**: Both `AuthContext` and `AppNavigation` check AsyncStorage independently
- **API Integration**: Uses external API (`https://api.freeapi.app/api/v1/users/login`) for authentication

### Key Architecture Patterns

#### Theme System
- **Multi-theme support**: Four predefined themes (coffee, forest, purple, ocean) in `src/constants/colors.js`
- **Global theme switching**: Change active theme by modifying the export in colors.js
- **Consistent styling**: All components use `COLORS` constant for theming

#### File Structure
```
src/
├── constants/     # Theme colors and constants
├── context/       # React Context providers (AuthContext)
├── navigation/    # Navigation configuration and auth flow
└── screens/       # Screen components
    └── auth/      # Authentication screens (sign-in, sign-up)
```

### State Management
- **Authentication**: React Context + AsyncStorage
- **Navigation**: React Navigation with conditional rendering
- **Local state**: Component-level useState for screen-specific data

## Important Technical Details

### Mixed File Extensions
The project uses mixed JavaScript/TypeScript extensions:
- `.tsx` for TypeScript React components (App.tsx, tests)
- `.jsx` for JavaScript React components (screens, navigation)
- `.js` for utility files (config, constants)

### Platform Considerations
- **Cross-platform**: Configured for both iOS and Android
- **Vector Icons**: Uses `react-native-vector-icons/Ionicons`
- **Safe Areas**: Implemented with `react-native-safe-area-context`
- **Image Handling**: Includes `react-native-image-picker` for image upload functionality

### API Integration
- Authentication endpoints expect `username` and `password` fields
- Response includes `accessToken` and `refreshToken` for session management
- Error handling implemented with try/catch and user-friendly error messages

## Configuration Files

- **Metro**: Default configuration in `metro.config.js`
- **Jest**: Simple preset configuration for React Native testing
- **ESLint**: Uses `@react-native` configuration
- **Prettier**: Basic formatting configuration
- **TypeScript**: Extends `@react-native/typescript-config`

## Development Notes

### Authentication Testing
Use these test credentials for the FreeAPI service:
- The sign-in screen connects to `https://api.freeapi.app/api/v1/users/login`
- Check FreeAPI documentation for valid test accounts

### Theme Switching
To change the app theme:
1. Open `src/constants/colors.js`
2. Change the export: `export const COLORS = THEMES.forest;` (or purple, ocean)
3. Restart the app to see changes

### Native Dependencies
When adding native dependencies:
1. Install the package with npm/yarn
2. For iOS: Run `bundle exec pod install`
3. For Android: May require additional Gradle configuration
4. Rebuild the app completely (`npm run android` or `npm run ios`)