# Personal Finance Tools - Modern Web Application

A full-stack web application for managing personal finances, built with Spring Boot (backend) and React (frontend).

## Features

### 📋 Bills Tracker
- ✨ Add, view, and delete monthly bills
- 📊 Real-time statistics (total, average, count)
- 💾 Persistent storage with H2 database
- 🎨 Modern, responsive UI
- ⚡ Fast and reactive user experience

### 💰 Pay Calculator
- 💵 Calculate take-home pay from hourly rate or yearly salary
- 📈 Comprehensive breakdown (weekly, biweekly, monthly, yearly)
- 🧾 Tax estimation (Federal, State, Social Security, Medicare)
- 🔄 Toggle between hourly and salary calculations
- 📱 Real-time calculations

## Technology Stack

### Backend
- **Spring Boot 3.2.3** - Java web framework
- **Spring Data JPA** - Database persistence
- **H2 Database** - In-memory database
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

## Prerequisites

Before running this application, ensure you have the following installed:

1. **Java 17 or higher**
   ```bash
   java -version
   ```

2. **Maven** (or use the Maven wrapper included with Spring Boot)
   ```bash
   mvn -version
   ```

3. **Node.js 18+ and npm** (for the frontend)
   ```bash
   node -version
   npm -version
   ```

### Installing Node.js on macOS

If Node.js is not installed, you can install it using Homebrew:

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node -version
npm -version
```

Alternatively, download from [nodejs.org](https://nodejs.org/)

## Getting Started

### 1. Clone or Navigate to the Project

```bash
cd /Users/georgemathis/IdeaProjects/HelloWorld
```

### 2. Start the Backend (Spring Boot)

Open a terminal and run:

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or using installed Maven
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

You can verify it's running by visiting:
- API: http://localhost:8080/api/bills
- H2 Console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:billsdb)

### 3. Start the Frontend (React)

Open a **new terminal** window and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Bills Tracker
1. **Add a Bill**: Enter the bill name and amount, then click "Add Bill"
2. **View Bills**: All bills are displayed in a table with name, amount, and date
3. **View Summary**: See total bills, average amount, and bill count
4. **Delete a Bill**: Click the delete button next to any bill

### Pay Calculator
1. **Choose Calculation Type**: Select either "Hourly Rate" or "Yearly Salary"
2. **Enter Amount**: Input your hourly wage or annual salary
3. **Calculate**: Click the calculate button to see your pay breakdown
4. **View Results**: See detailed breakdown by pay period with gross and net amounts
5. **Reset**: Click reset to start a new calculation

## API Endpoints

The backend exposes the following REST API endpoints:

### Bills Tracker Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bills` | Get all bills |
| POST | `/api/bills` | Create a new bill |
| GET | `/api/bills/{id}` | Get a bill by ID |
| DELETE | `/api/bills/{id}` | Delete a bill |
| GET | `/api/bills/summary` | Get statistics summary |

### Pay Calculator Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pay-calculator/from-hourly` | Calculate pay from hourly rate |
| POST | `/api/pay-calculator/from-yearly` | Calculate pay from yearly salary |

### Example API Requests

**Create a bill:**
```bash
curl -X POST http://localhost:8080/api/bills \
  -H "Content-Type: application/json" \
  -d '{"name": "Electric Bill", "amount": 120.50}'
```

**Get all bills:**
```bash
curl http://localhost:8080/api/bills
```

**Get summary:**
```bash
curl http://localhost:8080/api/bills/summary
```

**Calculate pay from hourly rate:**
```bash
curl -X POST http://localhost:8080/api/pay-calculator/from-hourly \
  -H "Content-Type: application/json" \
  -d '{"hourlyRate": 25.00}'
```

**Calculate pay from yearly salary:**
```bash
curl -X POST http://localhost:8080/api/pay-calculator/from-yearly \
  -H "Content-Type: application/json" \
  -d '{"yearlySalary": 52000}'
```

## Project Structure

```
HelloWorld/
├── pom.xml                                 # Maven configuration
├── src/
│   └── main/
│       ├── java/com/billstracker/
│       │   ├── BillsTrackerApplication.java    # Main Spring Boot app
│       │   ├── model/
│       │   │   ├── Bill.java                   # Bill entity
│       │   │   └── BillSummary.java            # Summary DTO
│       │   ├── repository/
│       │   │   └── BillRepository.java         # Database repository
│       │   ├── service/
│       │   │   └── BillService.java            # Business logic
│       │   └── controller/
│       │       └── BillController.java         # REST endpoints
│       └── resources/
│           └── application.properties          # App configuration
└── frontend/
    ├── package.json                        # NPM dependencies
    ├── vite.config.js                      # Vite configuration
    ├── index.html                          # HTML template
    └── src/
        ├── main.jsx                        # React entry point
        ├── App.jsx                         # Main App component
        ├── App.css                         # Global styles
        ├── components/
        │   ├── BillForm.jsx                # Add bill form
        │   ├── BillList.jsx                # Bills table
        │   └── BillSummary.jsx             # Statistics cards
        └── services/
            └── api.js                      # API client
```

## Development

### Backend Development

The backend uses Spring Boot DevTools for hot reloading. Changes to Java files will automatically restart the application.

To rebuild without running:
```bash
mvn clean package
```

### Frontend Development

Vite provides hot module replacement (HMR). Changes to React components will update instantly in the browser.

To build for production:
```bash
cd frontend
npm run build
```

## Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Check if port 8080 is already in use
- Look for errors in the Maven output

### Frontend won't start
- Ensure Node.js is installed: `node -version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check if port 3000 is already in use

### Frontend can't connect to backend
- Ensure the backend is running on port 8080
- Check browser console for CORS errors
- Verify the API URL in `frontend/src/services/api.js`

### Database issues
- The H2 database is in-memory, so data is lost when the backend stops
- Access H2 console at http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:billsdb`, username: `sa`, password: (leave empty)

## Future Enhancements

- [ ] Persistent database (PostgreSQL/MySQL)
- [ ] User authentication
- [ ] Monthly/yearly bill tracking
- [ ] Bill categories
- [ ] Data visualization with charts
- [ ] Export to CSV/PDF
- [ ] Bill due dates and reminders
- [ ] Multi-currency support

## License

This project is for educational purposes.

## Author

Built with Spring Boot & React
