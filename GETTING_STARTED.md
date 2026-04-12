# Maternal Health Tracker - Getting Started Guide

Welcome! This comprehensive guide will help you build and deploy your Maternal Health Tracking application.

---

## What You Have Already

✅ **ML Model** - Trained birth weight prediction model (95% accuracy)
✅ **Streamlit App** - Basic pregnancy tracker interface
✅ **Project Plan** - Complete architecture and timeline
✅ **Backend API** - Flask REST API with endpoints ready
✅ **Frontend Guide** - React setup and components

---

## Phase 1: Development Setup (Week 1)

### Step 1A: Prepare Development Environment

**Backend Setup:**
```bash
# Navigate to project directory
cd c:\Users\G HEMASREE\OneDrive\Documents\maternal_health_app

# Create virtual environment for backend
python -m venv backend_venv
backend_venv\Scripts\activate

# Install backend dependencies
pip install -r backend_requirements.txt

# Create .env file
copy .env.example .env
```

**.env file contents:**
```
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
DATABASE_URL=postgresql://user:password@localhost/maternal_health
```

**Frontend Setup:**
```bash
# In another terminal, create React app
npx create-react-app maternal-health-web
cd maternal-health-web

# Install dependencies
npm install axios react-router-dom tailwindcss jwt-decode

# Create .env file
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start development server
npm start
```

### Step 1B: Test Backend API

```bash
# In first terminal (backend)
python backend_api.py

# In another terminal, test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/docs
```

You should see:
```json
{
  "status": "online",
  "service": "Maternal Health Tracker API",
  "version": "1.0.0"
}
```

### Step 1C: Connect Frontend to Backend

Update `maternal-health-web/src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Phase 2: Build Core Features (Weeks 2-3)

### Feature 1: User Authentication

**Frontend (Login Page):**
```javascript
// maternal-health-web/src/pages/Login.js
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### Feature 2: Health Assessment

**Key Implementation Points:**
- Use trained ML model for condition prediction
- Send symptoms to `/api/health/assess` endpoint
- Display risk level and recommendations
- Save assessment to user's history

### Feature 3: Doctor Booking

**Key Implementation Points:**
- Fetch doctors from `/api/doctors` endpoint
- Show available time slots
- Handle appointment booking
- Send confirmation email

---

## Phase 3: Add Integrations (Week 4)

### Integration 1: Payment Gateway (Razorpay)

```bash
npm install razorpay
```

### Integration 2: Food Delivery (Swiggy)

API Documentation: https://developer.swiggy.com/docs

### Integration 3: Medicine Delivery (PharmEasy)

Register for API at: https://partner.pharmeasy.in/

---

## Phase 4: Testing & Deployment (Week 5)

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create maternal-health-tracker

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Set Environment Variables

**On Heroku Dashboard:**
- `FLASK_ENV`: production
- `SECRET_KEY`: your-production-secret-key
- `JWT_SECRET_KEY`: your-production-jwt-key
- `DATABASE_URL`: (automatically set by Heroku Postgres)

**On Vercel Dashboard:**
- `REACT_APP_API_URL`: your-heroku-app-url/api

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd maternal_health_app
backend_venv\Scripts\activate
python backend_api.py

# Terminal 2: Frontend
cd maternal-health-web
npm start

# Terminal 3: Database (if using local PostgreSQL)
# Keep running throughout development
```

### Making Changes

**Backend:**
1. Modify `backend_api.py`
2. Test with curl or Postman
3. Check API documentation at `http://localhost:5000/api/docs`

**Frontend:**
1. Modify React components
2. Changes auto-reload on save
3. Check browser console for errors

---

## Project Checklist

### Month 1 (MVP)
- [ ] Backend API setup
- [ ] Authentication system
- [ ] Health assessment form
- [ ] Basic frontend UI
- [ ] Doctor listing
- [ ] Appointment booking
- [ ] Deployment to staging

### Month 2 (Enhanced)
- [ ] Payment integration
- [ ] Food delivery integration
- [ ] Medicine delivery
- [ ] SMS notifications
- [ ] Email notifications
- [ ] User profile management

### Month 3 (Advanced)
- [ ] Mobile app (React Native)
- [ ] Video consultation
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Performance optimization
- [ ] Production deployment

---

## Common Issues & Solutions

### CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```python
# In backend_api.py
from flask_cors import CORS
CORS(app)
```

### Database Connection Error
**Error:** `could not connect to postgresql`

**Solution:**
```bash
# Install PostgreSQL locally or use cloud service
# Update DATABASE_URL in .env file
```

### Token Expired
**Error:** `401 Unauthorized`

**Solution:**
```javascript
// Refresh token automatically
if (error.response.status === 401) {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
}
```

### Port Already in Use
**Error:** `Address already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
python backend_api.py --port 5001
```

---

## Performance Tips

### Frontend Optimization
```javascript
// Use lazy loading for routes
const Dashboard = lazy(() => import('./Dashboard'));
const HealthAssessment = lazy(() => import('./HealthAssessment'));

// Use production build
npm run build
```

### Backend Optimization
```python
# Enable caching
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/doctors', methods=['GET'])
@cache.cached(timeout=300)
def get_doctors():
    # ...
```

---

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Validate user input on backend
- [ ] Use prepared statements for SQL
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Backup database regularly

---

## Testing

### Backend Testing
```bash
pip install pytest

# Create tests/test_api.py
# Run: pytest tests/
```

### Frontend Testing
```bash
npm test

# Create tests/App.test.js
# Runs on save in watch mode
```

---

## Monitoring & Logging

### Backend Logging
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/health/assess', methods=['POST'])
def assess_health():
    logger.info(f'Health assessment from user')
    # ...
```

### Frontend Error Tracking
```javascript
// Add error boundary
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});
```

---

## Next Steps

1. ✅ **Week 1**: Set up development environment
   - Backend running on http://localhost:5000
   - Frontend running on http://localhost:3000
   - Test API endpoints

2. ✅ **Week 2-3**: Build core features
   - Authentication working
   - Health assessment functional
   - Doctor booking operational

3. ✅ **Week 4**: Add integrations
   - Payment gateway
   - Food delivery
   - Medicine delivery

4. ✅ **Week 5**: Deploy
   - Backend on Heroku
   - Frontend on Vercel
   - Database in cloud

---

## Resources

- [Flask Documentation](https://flask.palletsprojects.com)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Auth](https://jwt.io)
- [Heroku Deployment](https://devcenter.heroku.com)
- [Vercel Deployment](https://vercel.com/docs)

---

## Support & Debugging

### Enable Debug Mode
```python
app.run(debug=True)  # Backend

npm run start  # Frontend (auto-reload)
```

### Check Server Status
```bash
curl http://localhost:5000/api/health

# Response should be:
# {
#   "status": "online",
#   "service": "Maternal Health Tracker API",
#   "version": "1.0.0"
# }
```

---

## Important Notes

⚠️ **Before going to production:**
1. Replace demo credentials
2. Set strong SECRET_KEY
3. Enable HTTPS
4. Configure real database
5. Test all integrations
6. Load test the system
7. Set up monitoring
8. Implement backup strategy
9. Create documentation
10. Train support team

---

**Ready to start? Begin with Step 1A above! 🚀**
