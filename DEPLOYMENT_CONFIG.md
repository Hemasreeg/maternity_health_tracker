# Full-Stack Deployment Configuration Summary

## What Was Configured

Your maternal health tracker is now configured for **single-link full-stack deployment** on Render (or any platform that supports Node.js + Python apps).

---

## Changes Made

### 1. **Backend Configuration** (`backend_api.py`)
- ✅ Flask app now serves React frontend from built files
- ✅ Configured static folder paths for production
- ✅ Added catch-all route for React Router (SPA routing)
- ✅ Separated API routes from frontend routes

**Key Addition:**
```python
# Serves built React app from maternal-health-frontend/build/
app = Flask(
    __name__,
    static_folder=os.path.join(REACT_BUILD_PATH, 'static'),
    template_folder=REACT_BUILD_PATH
)

# Catch-all route for React routing
@app.route('/<path:path>')
def serve_react(path):
    # Serves index.html for React Router handling
```

### 2. **Frontend Configuration** (`src/services/api.js`)
- ✅ API base URL changed from `http://localhost:5000/api` to `/api`
- ✅ Works with both local and production deployments
- ✅ Uses relative paths for portability

**Key Change:**
```javascript
// Before: const API_URL = 'http://localhost:5000/api';
// After: const API_URL = '/api';  ← Works on any domain
```

### 3. **Deployment Guide** (`RENDER_DEPLOYMENT_GUIDE.md`)
- ✅ Complete step-by-step Render deployment instructions
- ✅ Build and start commands for monorepo
- ✅ Environment variable setup
- ✅ Troubleshooting guide

---

## Single-Link Setup

When deployed to Render, **everything runs from one URL**:

```
https://maternal-health-tracker.onrender.com/
├── / (Frontend - React App)
├── /dashboard (Frontend - React Router)
├── /api/health (Backend - API Endpoint)
├── /api/auth/login (Backend - API Endpoint)
└── ... all routes served from same domain
```

---

## Render Configuration Values

Use these in Render's Web Service form:

| Setting | Value |
|---------|-------|
| **Build Command** | `pip install -r backend_requirements.txt && cd maternal-health-frontend && npm install && npm run build && cd ..` |
| **Start Command** | `gunicorn backend_api:app --bind 0.0.0.0:$PORT` |
| **Root Directory** | (leave empty) |
| **Environment** | Python 3 |

---

## How It All Works Together

```
User Browser
     ↓
Render Service (Single Port)
     ├─ Flask Backend (Python)
     │  ├─ /api/* routes → JSON API responses
     │  └─ /* routes → Serve React files
     │
     └─ React Frontend (JavaScript)
        ├─ Dashboard.js
        ├─ Appointments.js
        └─ ... all React components
```

---

## Next Steps

1. **Deploy to Render**:
   - Go to https://render.com
   - Connect GitHub repo
   - Use settings from `RENDER_DEPLOYMENT_GUIDE.md`

2. **Test Deployment**:
   - Visit `https://your-app.onrender.com`
   - Check `/api/docs` for API documentation
   - Login and test features

3. **Production Considerations**:
   - Add database (PostgreSQL on Render)
   - Configure custom domain
   - Set up monitoring/logging
   - Add environment variables

---

## Files Modified

- `backend_api.py` - Added static serving + React routing
- `maternal-health-frontend/src/services/api.js` - Updated API URL
- `RENDER_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide (new)
- `DEPLOYMENT_CONFIG.md` - This file (new)

---

## Key Features

✅ **One URL** - Frontend and backend from same domain
✅ **No CORS Issues** - Everything served from same origin
✅ **Scalable** - Can separate frontend/backend later if needed
✅ **Production Ready** - Uses Gunicorn for Python
✅ **React Router** - Full SPA routing support
✅ **API Accessible** - Full REST API available at `/api`

---

## Testing Locally

Before deploying, test locally:

```bash
# 1. Build React
cd maternal-health-frontend
npm install
npm run build
cd ..

# 2. Install Python deps
pip install -r backend_requirements.txt

# 3. Run Flask
gunicorn backend_api:app --bind 0.0.0.0:5000

# 4. Visit http://localhost:5000
```

---

## Common Questions

**Q: Can I separate frontend and backend?**
A: Yes! In the future, you can deploy them separately on different Render services.

**Q: Will my API calls work?**
A: Yes! Using relative paths (`/api`) ensures calls work from any domain.

**Q: What about CORS?**
A: Not needed! Same-origin requests don't trigger CORS.

**Q: How do I update the frontend?**
A: Just push to GitHub. Render auto-rebuilds with new changes.

---

## Resources

- [Render Web Services Docs](https://render.com/docs/deploy-node)
- [Flask Deployment](https://render.com/docs/deploy-flask)
- [React Deployment](https://render.com/docs/deploy-node)
- [Gunicorn Docs](https://docs.gunicorn.org/)

---

**Status**: ✅ Ready for deployment!
**Branch**: main
**Last Updated**: May 13, 2026

