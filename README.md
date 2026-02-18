# Sales Call Intelligence V2

## Prerequisites

- Python 3.8+
- Node.js & npm (or bun)

## Getting Started

### Backend

The backend is a FastAPI application.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at http://localhost:8000.

### Frontend

The frontend is a React + Vite application.

1. Navigate to the ui directory:
   ```bash
   cd ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # OR if using bun
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # OR
   bun run dev
   ```
   The UI will be available at http://localhost:5173 (or similar port shown in terminal).
