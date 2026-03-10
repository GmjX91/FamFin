# FamFin — Household Finance App

A full-stack web application for managing household finances, built with Spring Boot and React.

## Features

### 📋 Bills Tracker
- Add, view, and delete monthly bills
- Categorize bills (Housing, Utilities, Subscriptions, Transportation, Insurance, Food & Groceries, Other)
- Real-time summary statistics (total, average, count)
- Input validation with amount caps and name length limits

### 💸 Income-Proportional Bill Split
- Enter monthly incomes for two people
- Auto-fills from Pay Calculator results
- Visual percentage bar showing income split
- Per-bill breakdown table with each person's share
- Rounding toggle for clean dollar amounts

### 💰 Pay Calculator
- Calculate take-home pay from hourly rate or yearly salary
- Person 1 and Person 2 support
- Tax estimation (Federal, State, Social Security, Medicare)
- Paycheck stub breakdown by pay period
- 50/30/20 budget recommendation
- Input caps ($10,000/hr, $10M salary)

### 🎯 Savings Goals
- Set a savings goal with timeframe and interest rate
- Monthly contribution calculator
- Interactive growth projection chart with tooltips
- Two modes: Goal Calculator and Growth Projector

### 🏠 Household Dashboard
- Combined income overview with percentage bar
- Bills & responsibilities split view
- Donut chart showing spending by category
- 50/30/20 budget per person with bills deducted
- Savings goal contribution split
- Financial health indicators (green/yellow/red)

### 🌙 Dark Mode
- Toggle between light and dark themes
- Persists across sessions via localStorage
- Full theming with CSS custom properties

## Tech Stack

**Backend:** Spring Boot 3.2.3, Spring Data JPA, H2 Database, Maven

**Frontend:** React 18, Vite, Axios, CSS3

## Prerequisites

- **Java 17+** — `java -version`
- **Node.js 18+** — `node -version`

## Quick Start

```bash
# Clone the repo
git clone https://github.com/GmjX91/FamFin.git
cd FamFin

# Start the backend
./mvnw spring-boot:run

# In a new terminal — start the frontend
cd frontend
npm install
npm run dev
```

Or use the included script:
```bash
./start.sh
```

- **Backend:** http://localhost:8080
- **Frontend:** http://localhost:3000
- **H2 Console:** http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:billsdb`, user: `sa`, no password)

## API Endpoints

### Bills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bills` | Get all bills |
| POST | `/api/bills` | Create a bill (`name`, `amount`, `category`) |
| GET | `/api/bills/{id}` | Get bill by ID |
| DELETE | `/api/bills/{id}` | Delete a bill |
| GET | `/api/bills/summary` | Get summary (total, average, count) |

### Pay Calculator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pay-calculator/from-hourly` | Calculate from `hourlyRate` |
| POST | `/api/pay-calculator/from-yearly` | Calculate from `yearlySalary` |

### Savings Calculator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/savings-calculator/calculate` | Calculate monthly contribution |
| POST | `/api/savings-calculator/project-growth` | Monthly growth projections |

## Project Structure

```
FamFin/
├── pom.xml
├── mvnw
├── start.sh
├── src/main/java/com/billstracker/
│   ├── BillsTrackerApplication.java
│   ├── controller/
│   │   ├── BillController.java
│   │   ├── PayCalculatorController.java
│   │   └── SavingsCalculatorController.java
│   ├── model/
│   │   ├── Bill.java
│   │   ├── BillSummary.java
│   │   ├── PayCalculation.java
│   │   ├── SavingsCalculation.java
│   │   └── MonthlyProjection.java
│   ├── repository/
│   │   └── BillRepository.java
│   └── service/
│       ├── BillService.java
│       ├── PayCalculatorService.java
│       └── SavingsCalculatorService.java
├── src/main/resources/
│   └── application.properties
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── components/
        │   ├── BillForm.jsx
        │   ├── BillList.jsx
        │   ├── BillSplit.jsx
        │   ├── BillSummary.jsx
        │   ├── HouseholdDashboard.jsx
        │   ├── PayCalculator.jsx
        │   └── SavingsCalculator.jsx
        └── services/
            ├── api.js
            ├── payCalculatorApi.js
            └── savingsApi.js
```

## Troubleshooting

- **Port in use:** `lsof -ti:8080 | xargs kill -9` or `lsof -ti:3000 | xargs kill -9`
- **Frontend can't connect:** Make sure backend is running on 8080; check CORS in browser console
- **Data lost on restart:** H2 is in-memory by default — data resets when the backend stops

## License

This project is for educational purposes.

## Author

Built by George Mathis
