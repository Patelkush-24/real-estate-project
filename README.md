# Hearth & Hall - Real Estate Management System
React (Vite) + Django REST Framework + SQL (SQLite by default, MySQL optional)

## Run the backend (terminal 1)
```bash
cd backend
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed          # demo data + users: admin/admin123, demo/demo123
python manage.py runserver     # http://localhost:8000  (Django admin: /admin/)
```

## Run the frontend (terminal 2)
```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```
To point at another API, create `frontend/.env` with `VITE_API_URL=http://host:8000/api`.

## Use MySQL instead of SQLite
Create a database, uncomment `mysqlclient` in requirements.txt, then:
```bash
export DB_ENGINE=mysql DB_NAME=realestate DB_USER=root DB_PASSWORD=yourpass DB_HOST=127.0.0.1
python manage.py migrate && python manage.py seed
```

## Requirement checklist
| # | Requirement | Where |
|---|---|---|
| 1 | Home page | `pages/Home.jsx` |
| 2 | Registration | `pages/Register.jsx`, `POST /api/auth/register/` |
| 3 | Login / logout | `pages/Login.jsx`, Navbar, token auth |
| 4 | User dashboard | `pages/Dashboard.jsx` |
| 5 | Add records | Enquire (user), PropertyForm (admin) |
| 6 | View records | Properties, PropertyDetail, MyEnquiries, admin tables |
| 7 | Update records | PropertyForm (edit), AdminEnquiries status |
| 8 | Delete records | AdminProperties, AdminEnquiries |
| 9 | Database connectivity | `backend/config/settings.py`, Django ORM models |
| 10 | Form validation | Client-side in every form + server-side in `serializers.py` |
| 11 | Responsive design | `styles.css` breakpoints, mobile menu |
| 12 | Basic admin panel | React admin pages + Django `/admin/` |

## API
`/api/properties/` (GET public; POST/PUT/DELETE admin) - filters: `q, type, min_price, max_price, bedrooms, ordering`
`/api/enquiries/` (users: create + own list; admin: all, update, delete) · `/api/stats/` · `/api/auth/{register,login,logout}/`
