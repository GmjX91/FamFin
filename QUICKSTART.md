# Quick Start Guide

## Prerequisites Installation

### Install Node.js (Required for Frontend)
```bash
brew install node
```

## Running the Application

### Option 1: Use the Start Script (Easiest)
```bash
./start.sh
```
This will start both backend and frontend automatically.

### Option 2: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

## Access the Application

- **Web App**: http://localhost:3000
- **API**: http://localhost:8080/api/bills
- **H2 Database Console**: http://localhost:8080/h2-console

## Testing the API

### Add a bill:
```bash
curl -X POST http://localhost:8080/api/bills \
  -H "Content-Type: application/json" \
  -d '{"name": "Netflix", "amount": 15.99}'
```

### Get all bills:
```bash
curl http://localhost:8080/api/bills
```

### Get summary:
```bash
curl http://localhost:8080/api/bills/summary
```

### Delete a bill (replace {id} with actual ID):
```bash
curl -X DELETE http://localhost:8080/api/bills/{id}
```

## Common Issues

**Port 8080 already in use?**
```bash
lsof -ti:8080 | xargs kill -9
```

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Frontend dependencies issues?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Backend won't compile?**
```bash
mvn clean install
```

## Project Structure Summary

```
├── pom.xml                          # Maven config
├── src/main/java/com/billstracker/ # Backend code
│   ├── BillsTrackerApplication.java # Main app
│   ├── controller/                  # REST endpoints
│   ├── service/                     # Business logic
│   ├── repository/                  # Database
│   └── model/                       # Data models
├── src/main/resources/              # Config files
└── frontend/                        # React app
    ├── src/
    │   ├── App.jsx                  # Main component
    │   ├── components/              # UI components
    │   └── services/api.js          # API client
    └── package.json                 # Dependencies
```

## Next Steps

1. Open http://localhost:3000 in your browser
2. Try the **Bills Tracker**:
   - Add some bills using the form
   - View the summary statistics
   - Try deleting bills
3. Try the **Pay Calculator**:
   - Click the "Pay Calculator" tab
   - Enter your hourly rate or yearly salary
   - View your comprehensive pay breakdown

Enjoy managing your finances! 💰
