# ENS Steward Token Calculator

A web application that calculates and displays $ENS token allocations for ENS DAO stewards based on the Term 6 compensation structure, with real-time price data and vesting visualizations.

## 🎯 Purpose

This tool helps ENS DAO stewards understand their token compensation by:

- Calculating token allocations based on 6-month average $ENS prices
- Visualizing 2-year linear vesting schedules
- Providing transparent compensation breakdowns
- Tracking real-time price impacts on allocations

## 🏗️ Built With

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API**: CoinGecko (for $ENS price data)
- **Deployment**: Vercel

## 💼 Business Logic

### Compensation Structure (Term 6)

- **Steward**: $48,000 annually ($4,000/month)
- **Lead Steward**: $66,000 annually ($5,500/month)

### Token Calculation

```
Total Tokens = Annual USD Compensation ÷ 6-Month Average $ENS Price
```

### Vesting Schedule

- **Start**: January 1, 2025
- **Distribution**: July 1, 2025 (25% already vested)
- **Duration**: 2-year linear vesting
- **Completion**: January 1, 2027

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- CoinGecko API key (optional but recommended for higher rate limits)

### Installation & Setup

1. **Clone and install dependencies:**

```bash
cd ens-steward-calculator
npm install
```

2. **Set up environment variables:**
   Create a `.env.local` file in the project root:

```bash
# CoinGecko API Configuration (get from https://www.coingecko.com/en/api/pricing)
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here

# Alternative server-side API key (more secure, recommended for production)
COINGECKO_API_KEY=your_api_key_here

# App Configuration
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. **Get your CoinGecko API key:**

   - Visit [CoinGecko API](https://coingecko.com/en/api/pricing)
   - Sign up for a free account
   - Get your API key from the dashboard
   - Add it to your `.env.local` file

4. **Start the development server:**

```bash
npm run dev
```

5. **Open the application:**
   - Visit [http://localhost:3000](http://localhost:3000)
   - The app should load and start fetching real $ENS price data
   - Try switching between Steward and Lead Steward roles

### 🚀 Deploying to Vercel (Fixes CORS Issues!)

**Important:** Deploying to Vercel solves CORS issues you might encounter in local development!

1. **One-Click Deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ens-steward-calculator)

2. **Manual Deployment:**

   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set Environment Variables in Vercel:**
   - Go to your project dashboard on Vercel
   - Navigate to Settings → Environment Variables
   - Add: `COINGECKO_API_KEY` (your CoinGecko API key)
   - Deploy again to apply changes

### 🔧 API Architecture

This application uses **Next.js API Routes** to solve CORS issues:

```
Browser → /api/ens-price → CoinGecko API → /api/ens-price → Browser
```

**Local Development Issues:**

- Direct browser calls to CoinGecko API are blocked by CORS
- The API routes run server-side and bypass CORS restrictions
- Fallback data is provided if CoinGecko API is unreachable

**Vercel Deployment Benefits:**

- ✅ No CORS issues (server-side API routes)
- ✅ Better caching and performance
- ✅ Secure environment variable handling
- ✅ Automatic HTTPS and global CDN

### Testing the API Integration

The app should automatically:

- ✅ Fetch current $ENS price from CoinGecko via API routes
- ✅ Calculate projected 6-month average
- ✅ Update token calculations in real-time
- ✅ Handle loading states and errors gracefully
- ✅ Show fallback data if API is unreachable

If you see price data loading, congratulations! The integration is working.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main calculator page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Calculator/         # Core calculator components
│   │   ├── RoleSelector.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── TokenCalculation.tsx
│   └── UI/                # Reusable UI components (future)
├── hooks/                 # Custom React hooks
│   └── usePriceData.ts    # Price data management
├── lib/                   # Utility functions & API calls
│   ├── api.ts            # CoinGecko integration
│   ├── calculations.ts    # Business logic
│   ├── constants.ts       # App constants
│   └── utils.ts          # Utility functions (future)
└── types/                 # TypeScript type definitions
    └── index.ts          # All interfaces and types
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking (to be added)
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Important:** The `NEXT_PUBLIC_` prefix makes these variables available in the browser. The CoinGecko API key is safe to expose as it's read-only for price data.

## 📊 Features Status

### ✅ Phase 1 (MVP) - COMPLETED

- [x] Role selector (Steward vs Lead Steward)
- [x] Real-time $ENS price display
- [x] Token allocation calculator
- [x] Basic responsive design
- [x] CoinGecko API integration
- [x] Vesting schedule calculations
- [x] Error handling and loading states

### 🚧 Phase 2 (Enhanced) - NEXT

- [ ] Interactive price charts
- [ ] Vesting timeline visualization
- [ ] Enhanced UI/UX
- [ ] Mobile optimization

### 📋 Phase 3 (Production) - FUTURE

- [ ] Error handling & fallbacks
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics integration

## 🎨 Design System

### Color Palette

- **ENS Blue**: `#5298FF`
- **Dark**: `#2B2D42`
- **Light**: `#F8F9FA`
- **Success**: `#22C55E`
- **Error**: `#EF4444`

### Typography

- **Headings**: Inter, semi-bold
- **Body**: Inter, regular
- **Monospace**: JetBrains Mono (prices/numbers)

## 🔗 API Integration

### CoinGecko API

- **Endpoint**: `/coins/ethereum-name-service/market_chart`
- **Rate Limits**: 10-50 calls/minute (free tier)
- **Caching**: 15-minute client-side TTL

## 🚨 Important Notes

### Future Date Handling

Since the calculation period (Jan 1 - July 1, 2025) is in the future, the app currently:

- Uses current $ENS price data as projections
- Clearly labels estimates as "projected"
- Will update methodology as actual dates approach

### Troubleshooting

**API Errors:**

- Check your `.env.local` file has the correct API key
- Verify internet connection
- CoinGecko free tier has rate limits - wait a few minutes and try again

**Build Errors:**

- Run `npm run lint` to check for linting issues
- Ensure all imports are correct
- Check TypeScript errors with `tsc --noEmit`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ENS DAO community for governance and compensation structure
- CoinGecko for reliable price data API
- Next.js team for excellent framework and documentation

## 📞 Support

For questions about ENS DAO steward compensation, refer to:

- [EP 5.18] ENS DAO Steward Compensation Structure - Term 6
- ENS DAO governance forums
- This application's GitHub Issues

---

**Note**: This is an educational tool for transparency. Official compensation decisions are governed by ENS DAO governance processes.
