# THIEF STORE — Production Build

React frontend + Django REST API backend + MySQL database. This replaces the
earlier localStorage prototype: now the public site and the admin dashboard
both read and write the *same* database, over an API.

```
alpha_z_production/
├── backend/     Django + MySQL + REST API (source of truth)
└── frontend/    React (Vite) — public site + admin dashboard
```

How the pieces talk to each other:

```
React (frontend)  --HTTP-->  Django REST API (backend)  <-->  MySQL database
   :5173                          :8000
```

---

## 1. Backend setup (Django + MySQL)

**Prerequisites:** Python 3.11+, MySQL Server running locally (or a cloud MySQL instance).

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create the database in MySQL first:

```sql
CREATE DATABASE alpha_z_db CHARACTER SET utf8mb4;
CREATE USER 'alpha_z_user'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON alpha_z_db.* TO 'alpha_z_user'@'localhost';
```

Configure environment variables:

```bash
cp .env.example .env
# then edit .env — put your real DB_PASSWORD, and generate a DJANGO_SECRET_KEY
# (any long random string works for now, e.g. from https://djecrety.ir)
```

Create tables and your admin account:

```bash
python manage.py migrate
python manage.py createsuperuser
# choose a username + password — this is what you'll log into /admin/login with
```

Run the API:

```bash
python manage.py runserver
```

The API is now live at `http://localhost:8000/api/`. Quick checks:
- `http://localhost:8000/api/products/` → public product list (empty until you add some)
- `http://localhost:8000/admin/` → Django's own built-in admin, if you ever want it

---

## 2. Frontend setup (React)

**Prerequisites:** Node.js 18+.

```bash
cd frontend
npm install
cp .env.example .env      # points the app at http://localhost:8000/api by default
npm run dev
```

Open `http://localhost:5173`. You should see the same black-and-gold site as
the prototype — except now it's empty until you log in as admin and add
real products, and every visitor sees the same data.

---

## 3. The core workflow, end to end

1. Go to `http://localhost:5173/admin/login`, log in with the superuser you created.
2. **Add Product** → fill in code, name, category, price, fabric, GSM, fit, size, stock, description.
3. Click **Add Product** — it's saved to MySQL immediately.
4. You're taken to the edit view of that same product — now upload real photos.
5. Visit the public shop — the product appears automatically (because stock > 0 and visible = true).
6. A customer taps **Order on WhatsApp** — this only opens WhatsApp with a pre-filled message. It does **not** touch stock.
7. Customer pays you, you confirm it yourself.
8. Back in the admin **Products** table, click **Mark Sold (0)** — confirms, sets stock to 0.
9. The product instantly disappears from the public shop. Its own product page still opens if someone has the old link, but shows **SOLD OUT** with ordering disabled — this matches your original spec exactly.
10. Add the next product (`AZ00X`, stock 1) — repeat.

---

## 4. Deploying it for real (export / going live)

This section is about running your **existing account and data name**, not creating a new one — you don't need to rebuild anything, just host what's here.

**Backend (Django + MySQL) — pick one:**
- **Railway** or **Render**: both offer free/low-cost MySQL databases and can run Django directly from this `backend/` folder. You set the same environment variables from `.env` in their dashboard instead of a local file.
- Either way, before going live: set `DJANGO_DEBUG=False`, put your real domain in `DJANGO_ALLOWED_HOSTS`, and run `python manage.py collectstatic`.
- For product photos in production, use cloud storage (e.g. `django-storages` + Cloudinary/S3) instead of local disk — local `MEDIA_ROOT` works for development but files can be wiped on redeploy on most hosts.

**Frontend (React) — pick one:**
- **Vercel** or **Netlify**: connect the `frontend/` folder, set the build command `npm run build`, output directory `dist`.
- Set `VITE_API_URL` in their dashboard to your live backend URL (e.g. `https://api.alphaz.yourdomain.com/api`).

**Connect them:**
- In the backend's `.env` / host dashboard, set `CORS_ALLOWED_ORIGINS` to your live frontend URL (e.g. `https://alphaz.yourdomain.com`).
- Buy/point a domain at the frontend host; the backend can live on a subdomain like `api.alphaz.yourdomain.com`.

You don't have to deploy today — everything above works fully on your own laptop first (`runserver` + `npm run dev`), which is the right way to test the whole workflow before spending money on hosting.

---

## 5. What's intentionally left simple (per your brief)

- Admin auth is one Django superuser account — enough for a single-owner store. Multiple staff logins are just `createsuperuser` again.
- No online payments, no automatic stock deduction — by design, since you confirm every sale manually via WhatsApp.
- No multi-size/multi-variant products yet — the model can be extended later (your brief listed this under future scalability, not v1).
