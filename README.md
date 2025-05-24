# ENS Steward Token Calculator

A web application that calculates and displays $ENS token allocations for ENS DAO stewards based on the Term 6 compensation structure, with real-time price data and vesting visualizations.

![image](https://github.com/user-attachments/assets/ef60c01e-6bd6-4673-a976-bdd4a21152ce)



## 🎯 What This App Does

This calculator helps ENS DAO stewards understand their token compensation by:

- **Real-time Price Integration**: Fetches current $ENS prices from CoinGecko API
- **Accurate Term 6 Calculation**: Uses exact Jan 1 - July 1, 2025 period (181 days)
- **Smart Data Blending**: Historical data (Jan 1 to today) + projected data (today to July 1)
- **Transparent Breakdown**: Detailed 181-day table showing every price used in calculations
- **Vesting Visualization**: Shows 2-year linear vesting schedule with clear breakdowns
- **Role Comparison**: Switch between Steward ($48K) and Lead Steward ($66K) compensation


## 📊 Detailed Price Calculation Table

The app includes an expandable table showing all 181 days of Term 6 price data:



**Table Features:**

- **Historical Data** (Green): Real ENS prices from CoinGecko API
- **Projected Data** (Blue): Current price held constant through July 1
- **Running Averages**: See how the 6-month average evolves day by day
- **Progressive Updates**: As days pass, more data becomes historical
- **Sortable & Searchable**: Full transparency of calculation methodology

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



## 🏗️ Technical Implementation

**Built With:**

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS for responsive design
- CoinGecko API for real-time price data
- Recharts for data visualization

**Key Features:**

- **Accurate Term 6 calculation**: Exact 181-day period (Jan 1 - July 1, 2025)
- **Smart data blending**: Real historical + projected price data
- **Server-side API routes**: Handle CORS issues with CoinGecko
- **15-minute price caching**: Optimized API usage
- **Fallback data reliability**: Graceful degradation when APIs fail
- **Mobile-responsive design**: Works on all devices
- **Real-time calculation updates**: Instant feedback on role changes



## 📊 App Components

### 1. Role Selector

Choose between Steward and Lead Steward roles to see different compensation levels.

### 2. Price Display

Shows current $ENS price with projected 6-month average for token calculations.

### 3. Token Calculation

Real-time breakdown of:

- Total token allocation based on accurate 6-month average
- Tokens vested at distribution (25%)
- Monthly vesting amounts
- Current USD value of allocation

### 4. Price Detail Table

Expandable table showing all 181 days of Term 6 calculation data:

- Historical prices (green) vs projected prices (blue)
- Running 6-month averages
- Complete transparency of calculation methodology
- Updates daily as more data becomes historical



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
