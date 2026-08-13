# ResidentHub Backend

Node.js + Express + MongoDB Atlas backend for **ResidentHub** by Code Morphicx.
Built to match the existing React/Vite frontend (`residenthub-portal`) exactly — every route
maps to a page in your UI: Login, Dashboard, Maintenance, Visitors, Announcements, Bills, Events,
Directory, Profile.

## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT auth with role-based access (`resident`, `admin`, `security` — matches your Login page tabs)
- bcryptjs for password hashing

## Project Structure
```
residenthub-backend/
├── server.js                  # App entry point
├── src/
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # User, Maintenance, Visitor, Announcement, Bill, Event, Notification
│   ├── controllers/            # Business logic, one file per page
│   ├── routes/                 # Express routers, one file per page
│   ├── middleware/              # JWT auth, role guard, error handler
│   └── utils/                  # generateToken.js, seed.js
├── .env.example
└── package.json
```

## Step 1 — Set up MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas and create a free (M0) cluster.
2. Under **Database Access**, create a user with a username/password.
3. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) for development.
4. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

## Step 2 — Configure environment variables
```bash
cd residenthub-backend
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/residenthub?retryWrites=true&w=majority
JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173,https://luxury-churros-4bb54e.netlify.app
```

## Step 3 — Install & run
```bash
npm install
npm run dev        # nodemon, auto-restarts on changes
# or
npm start           # plain node
```
Server starts on `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's up.

## Step 4 — Seed test data (optional but recommended)
Populates users/maintenance/visitors/bills/events matching your screenshots:
```bash
npm run seed
```
Test logins after seeding:
| Role     | Email                        | Password     |
|----------|-------------------------------|---------------|
| Resident | rahul.sharma@gmail.com        | password123   |
| Admin    | admin@residenthub.com         | admin12345    |
| Security | security@residenthub.com      | security123   |

## Step 5 — Connect your React frontend
In your frontend repo, create `src/api/axios.js`:
```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```
Add to your frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
Then replace dummy-data arrays in your pages with calls like:
```js
const { data } = await api.get("/dashboard");
```

## API Reference

### Auth (`/api/auth`)
| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/register` | Public | Create Account link |
| POST | `/login` | Public | body: `{ identifier, password, role }`; role = resident/admin/security tab |
| GET | `/me` | Private | Current logged-in user |
| POST | `/forgot-password` | Public | Forgot Password link |
| POST | `/reset-password` | Public | body: `{ token, newPassword }` |

### Dashboard (`/api/dashboard`)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private — summary cards + recent announcements + upcoming events |

### Maintenance (`/api/maintenance`)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private — own requests (resident) or all (admin/security), `?category=&status=&search=` |
| POST | `/` | Private — submit new request `{ category, description, priority }` |
| GET | `/:id` | Private |
| PUT | `/:id` | admin/security — `{ status, priority, assignedTo, comment }` |
| DELETE | `/:id` | Private |

### Visitors (`/api/visitors`)
| Method | Route | Access |
|---|---|---|
| GET | `/expected` | Private |
| GET | `/history` | Private — check-in history |
| POST | `/` | Private — pre-register visitor |
| PUT | `/:id` | Private — edit pass |
| PUT | `/:id/revoke` | Private |
| PUT | `/:id/check-in` | security/admin |
| PUT | `/:id/check-out` | security/admin |

### Announcements (`/api/announcements`)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private — `?type=Notice\|Alert\|Event&search=` |
| POST | `/` | admin |
| PUT | `/:id` | admin |
| DELETE | `/:id` | admin |

### Bills (`/api/bills`)
| Method | Route | Access |
|---|---|---|
| GET | `/summary` | Private — Total Due / Last Payment / Next Cycle cards |
| GET | `/pending` | Private |
| GET | `/history` | Private |
| POST | `/` | admin — generate a bill |
| PUT | `/:id/pay` | Private — "Pay Now" |

### Events (`/api/events`)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private — `?filter=upcoming\|past\|my&search=` |
| POST | `/` | admin |
| PUT | `/:id/rsvp` | Private |
| PUT | `/:id/unrsvp` | Private |

### Directory (`/api/directory`)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private — `?search=&tower=` |
| GET | `/:id` | Private — single resident detail panel |

### Profile (`/api/profile`)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private |
| PUT | `/` | Private — Personal Info tab |
| PUT | `/password` | Private — Security tab |
| PUT | `/notifications` | Private — Notifications tab |
| PUT | `/preferences` | Private — currency/language/theme (Preferences tab) |
| POST | `/family` | Private — add family member |
| DELETE | `/family/:memberId` | Private |

## Deploying the backend
Recommended free options: **Render**, **Railway**, or **Fly.io** (Netlify only hosts static frontends,
so your backend needs a separate host). General steps for Render:
1. Push this backend to its own GitHub repo (or a `/backend` folder in your existing repo).
2. On Render: New > Web Service > connect repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Add the same environment variables from `.env` in Render's dashboard.
5. Once deployed, update your frontend's `VITE_API_URL` to the Render URL and redeploy on Netlify.
