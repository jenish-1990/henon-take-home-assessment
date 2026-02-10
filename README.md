# Currency Exchange Rate Dashboard

A dashboard for tracking historical exchange rates between EUR, USD, and CAD. It displays rate data in an interactive line chart and a filterable data table, with support for date range selection and currency toggling.

## Tech Stack

- **Backend:** Django 5.2 + Django REST Framework
- **Frontend:** React 19 (Vite, plain JSX)
- **Database:** SQLite (caches exchange rate data)
- **Chart:** Chart.js + react-chartjs-2
- **Table:** ag-Grid Community Edition
- **HTTP:** axios (frontend), requests (backend)

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

### Frontend

```bash
cd frontend
npm install
```

## Running

Start both servers in separate terminals:

```bash
# Terminal 1 — Django API (port 8000)
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 — React dev server (port 5173)
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## API

The backend proxies requests to the [Frankfurter API](https://frankfurter.dev), which provides exchange rate data published by the European Central Bank. No API key is required.

### Endpoints

- `GET /api/rates/?base=EUR&symbols=USD,CAD&start_date=2024-01-01&end_date=2026-01-01` — historical rates
- `GET /api/currencies/` — supported currencies
