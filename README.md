# ENS Steward Token Calculator

A web application that calculates and displays $ENS token allocations for ENS DAO stewards based on the Term 6 compensation structure, with real-time price data and vesting visualizations.

![App Screenshot](screenshots/calculator-overview.png)
_Main calculator interface showing role selection and token calculations_

## 🎯 What This App Does

This calculator helps ENS DAO stewards understand their token compensation by:

- **Real-time Price Integration**: Fetches current $ENS prices from CoinGecko API
- **Automatic Calculations**: Converts USD compensation to token amounts using 6-month averages
- **Vesting Visualization**: Shows 2-year linear vesting schedule with clear breakdowns
- **Role Comparison**: Switch between Steward ($48K) and Lead Steward ($66K) compensation
- **Transparent Breakdown**: See exactly how token allocations are calculated

![Price Display](screenshots/price-display.png)
_Live ENS price display with 6-month projection_

## 💼 ENS DAO Term 6 Compensation Structure

### Annual Compensation

- **Steward**: $48,000 annually ($4,000/month)
- **Lead Steward**: $66,000 annually ($5,500/month)

### Token Calculation Formula

```
Total Tokens = Annual USD Compensation ÷ 6-Month Average $ENS Price
```

### Vesting Schedule

- **Start Date**: January 1, 2025
- **Distribution Date**: July 1, 2025 (25% already vested at distribution)
- **Vesting Period**: 2-year linear vesting
- **Full Vesting**: January 1, 2027

![Vesting Chart](screenshots/vesting-breakdown.png)
_Token vesting timeline and breakdown_

## 🏗️ Technical Implementation

**Built With:**

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS for responsive design
- CoinGecko API for real-time price data
- Recharts for data visualization

**Key Features:**

- Server-side API routes to handle CORS issues
- 15-minute price data caching
- Fallback data for API reliability
- Mobile-responsive design
- Real-time calculation updates

![Mobile View](screenshots/mobile-responsive.png)
_Responsive design works on all devices_

## 📊 App Components

### 1. Role Selector

Choose between Steward and Lead Steward roles to see different compensation levels.

### 2. Price Display

Shows current $ENS price with projected 6-month average for token calculations.

### 3. Token Calculation

Real-time breakdown of:

- Total token allocation
- Tokens vested at distribution (25%)
- Monthly vesting amounts
- Current USD value of allocation

### 4. Vesting Timeline

Visual representation of the 2-year vesting schedule with key dates and milestones.

![Component Breakdown](screenshots/component-overview.png)
_All calculator components working together_

## 🚨 Important Notes

**Future Date Handling**: Since the calculation period (Jan 1 - July 1, 2025) is in the future, the app uses current $ENS price data as projections and clearly labels all estimates.

**Educational Purpose**: This is a transparency tool for ENS DAO stewards. Official compensation decisions are governed by ENS DAO governance processes, not this calculator.

**Price Volatility**: Token allocations will fluctuate with $ENS price changes until the 6-month averaging period begins.

## 🔗 References

- **Official Proposal**: [EP 5.18 - ENS DAO Steward Compensation Structure - Term 6](https://discuss.ens.domains/t/ens-dao-steward-compensation-structure-term-6/19739) - ENS DAO Governance Forum
- **Data Source**: CoinGecko API for $ENS price data
- **DAO Forums**: ENS DAO governance discussions

---

**Note**: This calculator implements the compensation structure from [EP 5.18](https://discuss.ens.domains/t/ens-dao-steward-compensation-structure-term-6/19739), which passed DAO vote. Official compensation decisions are governed by ENS DAO governance processes.
