# Block Description - Cross-Platform Block Breaker Game

Addictive block breaker game built with Next.js, Expo, and Tauri. Play on iOS, Android, Web, Windows, and macOS with a single monorepo codebase.

## Features

- 🎮 Full-featured block breaker gameplay
- 🎨 Dynamic color system (7 colors cycling based on block health 0-500)
- 🔄 Multiple simultaneous balls with physics
- ⚡ Progressive difficulty levels
- 📱 Cross-platform (iOS, Android, Web, Windows, macOS)
- 🎯 Special blocks with numbers (2, 5, 10)
- 🏆 Score tracking and high score system

## Supported Platforms

| Platform | Build Type | Distribution |
|----------|-----------|--------------|
| Web | Next.js | Vercel |
| iOS | Expo | App Store (IPA) |
| Android | Expo | Play Store (APK/AAB) |
| Windows | Tauri | Windows Store (EXE/MSI) |
| macOS | Tauri | App Store (DMG/APP) |

## Quick Start

### Prerequisites
- Node.js 18+
- npm 10+
- Expo CLI: `npm install -g eas-cli`
- For Desktop: Rust toolchain

### Development

```bash
npm install

# Run all platforms
npm run dev

# Or specific platforms
npm run dev:web      # Web: localhost:3000
npm run dev:mobile   # Mobile: Expo CLI
npm run dev:desktop  # Desktop: Tauri dev
```

## Building for Production

### Web (Vercel)
```bash
npm run build:web
# Deploy to Vercel automatically on git push
```

### Android (Google Play Store)
```bash
npm run build:android
# Outputs: APK and AAB files
```

### iOS (App Store)
```bash
npm run build:ios
# Outputs: IPA file
```

### Windows
```bash
npm run build:windows
# Outputs: EXE and MSI installers
```

### macOS
```bash
npm run build:macos
# Outputs: DMG and APP bundle
```

## Project Structure

```
block-description-monorepo/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── app/
│   │   ├── public/
│   │   └── package.json
│   ├── mobile/              # Expo React Native app
│   │   ├── app/
│   │   ├── assets/
│   │   ├── app.json
│   │   └── eas.json
│   └── desktop/             # Tauri desktop app
│       ├── src/
│       └── src-tauri/
├── packages/
│   ├── game-engine/         # Shared game logic
│   └── types/               # Shared TypeScript types
├── .github/workflows/       # CI/CD automation
├── package.json             # Root workspace config
└── turbo.json              # Turborepo config
```

## Game Rules

1. Control the paddle to bounce balls up
2. Hit blocks to break them
3. Different colored blocks have different health (1-500)
4. Special numbered blocks (2, 5, 10) require multiple hits
5. Game ends when blocks reach the paddle
6. Earn points and progress through levels

## Color System

Health ranges with corresponding colors:
- 0-10: Red
- 10-20: Blue
- 20-30: Yellow
- 30-40: Brown
- 40-50: Green
- 50-60: Orange
- 60-70: Violet
- 70+: Cycling through colors

## Deployment

### Automatic Deployment
Push to `main` branch triggers:
- Web: Automatic Vercel deployment
- Mobile: EAS builds and submissions
- Desktop: Windows and macOS builds

### Manual Deployment
See `DEPLOYMENT.md` for detailed platform-specific instructions.

## Environment Variables

### Web (Vercel)
```
NEXT_PUBLIC_ANALYTICS_ID=your_vercel_analytics_id
```

### Mobile (EAS)
```
EAS_TOKEN=your_eas_token
```

### Desktop (Tauri)
```
TAURI_PRIVATE_KEY=your_signing_key
```

## CI/CD Setup

1. **GitHub Secrets** (Settings → Secrets and variables):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `EAS_TOKEN`

2. **Google Play Service Account**:
   - Place `google-play-key.json` in `apps/mobile/.eas/`

3. **Apple App Store**:
   - Configure in `apps/mobile/eas.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes to appropriate app (web/mobile/desktop)
4. Test on target platforms
5. Submit pull request

## License

MIT
