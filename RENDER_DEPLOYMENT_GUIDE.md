# Render Deployment Guide - Full Stack Application

This guide covers deploying your maternal health tracker with **both frontend and backend in a single Render link**.

## Prerequisites

- GitHub account with your repo pushed
- Render account (https://render.com)
- Render CLI or web dashboard access

## Deployment Architecture

```
Render Service (Single URL)
├── Frontend (React - Built & Served)
└── Backend (Flask API - /api routes)
```

---

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your GitHub repository is up to date:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `maternity_health_tracker` repository

### 3. Configure Service Settings

Fill in the following settings in the Render form:

#### **Name**
```
maternal-health-tracker
```

#### **Environment**
```
Python 3
```

#### **Build Command**
```bash
pip install -r backend_requirements.txt && cd maternal-health-frontend && npm install && npm run build && cd ..
```

#### **Start Command**
```bash
gunicorn backend_api:app --bind 0.0.0.0:$PORT
```

#### **Root Directory**
Leave empty (use repository root)

#### **Environment Variables**

Click **"Add Environment Variable"** and add:

| Key | Value | Description |
|-----|-------|-------------|
| `PYTHON_VERSION` | `3.11.0` | Recommended Python version |
| `NODE_VERSION` | `18.17.0` | Node.js version |
| `SECRET_KEY` | `generate-secure-key` | Generate a secure random key |
| `JWT_SECRET_KEY` | `generate-secure-key` | Generate a secure random key |

### 4. Instance Type

Select **Free** tier for testing, or **Starter** for production ($7/month).

### 5. Deploy

Click **"Create Web Service"** and wait for deployment to complete.

---

## What Happens During Build

```
1. Install Python dependencies (backend)
   └─ pip install -r backend_requirements.txt

2. Build React frontend
   └─ cd maternal-health-frontend
   ├─ npm install
   └─ npm run build

3. Return to root directory
   └─ cd ..

4. Start Flask server with Gunicorn
   └─ gunicorn backend_api:app --bind 0.0.0.0:$PORT
```

---

## How It Works

- **Frontend Routes** (e.g., `/dashboard`, `/appointments`)
  - Served by Flask from React's built `index.html`
  - React Router handles client-side navigation
  
- **API Routes** (e.g., `/api/health`, `/api/doctors`)
  - Handled by Flask backend
  - Returns JSON responses

- **Static Assets** (CSS, JS, images)
  - Served from React's built `/static` directory
  - Cached by CDN for performance

---

## Access Your Application

Once deployed, you'll get a URL like:
```
https://maternal-health-tracker.onrender.com
```

### Testing the Deployment

1. **Frontend**: Visit `https://maternal-health-tracker.onrender.com`
2. **API Docs**: Visit `https://maternal-health-tracker.onrender.com/api/docs`
3. **Health Check**: Visit `https://maternal-health-tracker.onrender.com/api/health`

---

## Environment Variables Configuration

### Secure Key Generation

For `SECRET_KEY` and `JWT_SECRET_KEY`, you can generate secure keys:

```python
# Python
import secrets
print(secrets.token_urlsafe(32))
```

```bash
# Bash
openssl rand -hex 32
```

---

## Troubleshooting

### Build Fails with Node.js Error
- **Issue**: `npm: command not found`
- **Solution**: Add `NODE_VERSION` environment variable in Render settings

### Frontend Not Loading
- **Issue**: Blank page or 404 errors
- **Solution**: 
  - Verify React build completed: `npm run build` creates `build/` folder
  - Check build command includes `cd ..` to return to root
  - Ensure `frontend_api.js` uses relative API paths (`/api`)

### API Calls Failing
- **Issue**: CORS errors or 404 API responses
- **Solution**:
  - Check CORS is enabled in Flask (`flask-cors` in requirements)
  - Verify API routes match: `/api/auth/login`, `/api/health/assess`
  - Test with API docs: `/api/docs`

### Port Issues
- **Render Port**: Uses environment variable `$PORT`
- **Gunicorn Config**: `--bind 0.0.0.0:$PORT` automatically uses Render's port
- **Don't hardcode ports** - always use `$PORT`

---

## Performance Optimization

### Frontend Caching
React build generates static files with hash-based names that can be cached.

### API Response Time
- Add database caching for doctor lists
- Implement JWT token refresh logic
- Use connection pooling for DB queries

### Cold Start Issues
- Render might sleep free tier apps
- Use [Render Cron Jobs](https://render.com/docs/cronjobs) for periodic pings
- Upgrade to Starter tier for always-on service

---

## Production Checklist

- [ ] All environment variables set in Render
- [ ] Frontend builds successfully locally
- [ ] API endpoints tested with `/api/docs`
- [ ] JWT authentication works
- [ ] CORS properly configured
- [ ] Database connection strings updated (when using real DB)
- [ ] Error logging enabled
- [ ] Security headers configured in Flask

---

## File Structure for Deployment

```
maternity_health_tracker/
├── backend_api.py              # Main Flask app (modified for frontend serving)
├── backend_requirements.txt     # Python dependencies
├── maternal-health-frontend/   # React app
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── services/api.js    # Uses relative /api paths
│   │   └── ...
│   └── build/                 # Created during npm run build
└── ...other files...
```

---

## Manual Deployment Testing

Test locally before pushing to Render:

```bash
# Build frontend
cd maternal-health-frontend
npm install
npm run build
cd ..

# Install backend
pip install -r backend_requirements.txt

# Run as Render would
gunicorn backend_api:app --bind 0.0.0.0:5000
```

Then visit: `http://localhost:5000`

---

## Next Steps

1. **Database Integration**: Connect to PostgreSQL on Render
2. **Custom Domain**: Add your domain in Render settings
3. **SSL/HTTPS**: Automatic with Render
4. **Monitoring**: Enable Render's built-in monitoring
5. **Auto-Deploy**: Enable GitHub auto-deploy on push

---

## Useful Resources

- [Render Docs - Web Services](https://render.com/docs/deploy-node)
- [Flask + React Deployment](https://render.com/docs/deploy-flask)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/configure.html)

---

## Support

For issues:
1. Check Render logs: Dashboard → Service → Logs
2. Review build output for errors
3. Verify environment variables are set
4. Test API endpoints with curl or Postman

