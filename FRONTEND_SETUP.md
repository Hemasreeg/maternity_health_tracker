# Maternal Health Tracker - Frontend Setup Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn installed
- Git
- Code editor (VS Code recommended)

### Installation Steps

```bash
# 1. Create React app
npx create-react-app maternal-health-frontend
cd maternal-health-frontend

# 2. Install dependencies
npm install axios react-router-dom tailwindcss postcss autoprefixer jwt-decode

# 3. Setup Tailwind CSS
npx tailwindcss init -p

# 4. Create project structure
mkdir -p src/{components,pages,services,context,utils}

# 5. Start development server
npm start
```

---

## Project Structure

```
maternal-health-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── HealthCard.js
│   │   ├── DoctorCard.js
│   │   ├── AppointmentForm.js
│   │   └── NutritionGuide.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   ├── HealthAssessment.js
│   │   ├── DoctorDirectory.js
│   │   ├── Appointments.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Profile.js
│   ├── services/
│   │   ├── api.js (API client)
│   │   ├── auth.js
│   │   └── health.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── utils/
│   │   └── localStorage.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── public/
├── package.json
└── README.md
```

---

## Key Files to Create

### 1. API Service (`services/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. Authentication Service (`services/auth.js`)

```javascript
import api from './api';

export const authService = {
  register: (email, password, fullName) => 
    api.post('/auth/register', { email, password, full_name: fullName }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
  
  getToken: () => localStorage.getItem('access_token'),
  
  isAuthenticated: () => !!localStorage.getItem('access_token'),
};
```

### 3. Health Service (`services/health.js`)

```javascript
import api from './api';

export const healthService = {
  assessHealth: (symptoms, lmpDate) =>
    api.post('/health/assess', { symptoms, lmp_date: lmpDate }),
  
  getHistory: () =>
    api.get('/health/history'),
  
  getCurrentStatus: () =>
    api.get('/health/current'),
  
  getNutrition: (condition) =>
    api.get(`/nutrition/suggestions?condition=${condition}`),
};
```

### 4. Auth Context (`context/AuthContext.js`)

```javascript
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data;
  };

  const register = async (email, password, fullName) => {
    await authService.register(email, password, fullName);
    return await login(email, password);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5. Environment Variables (`.env.example`)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## Component Templates

### Health Assessment Form

```javascript
// pages/HealthAssessment.js
import React, { useState } from 'react';
import { healthService } from '../services/health';

const HealthAssessment = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await healthService.assessHealth(symptoms);
      setAssessment(result.data);
    } catch (error) {
      console.error('Assessment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Health Assessment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Symptoms:</label>
          <div className="space-y-2">
            {['Bleeding', 'Severe Headache', 'Abdominal Pain', 'Swelling'].map(symptom => (
              <label key={symptom} className="flex items-center">
                <input
                  type="checkbox"
                  value={symptom}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSymptoms([...symptoms, e.target.value]);
                    } else {
                      setSymptoms(symptoms.filter(s => s !== e.target.value));
                    }
                  }}
                  className="mr-2"
                />
                {symptom}
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Assessing...' : 'Get Assessment'}
        </button>
      </form>

      {assessment && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="text-xl font-bold mb-2">{assessment.assessment.condition}</h2>
          <p>Risk Level: {assessment.assessment.risk_level}</p>
          <p>Weeks Pregnant: {assessment.assessment.weeks_pregnant}</p>
        </div>
      )}
    </div>
  );
};

export default HealthAssessment;
```

### Doctor Directory

```javascript
// pages/DoctorDirectory.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Doctor Directory</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {doctors.map(doctor => (
          <div key={doctor.id} className="p-4 border rounded-lg shadow">
            <h3 className="text-xl font-bold">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className="text-yellow-500">★ {doctor.rating}</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDirectory;
```

---

## Installation & Running

### Backend Setup

```bash
# Install dependencies
pip install -r backend_requirements.txt

# Create .env file
echo "SECRET_KEY=your-secret-key" > .env
echo "JWT_SECRET_KEY=your-jwt-key" >> .env

# Run backend
python backend_api.py
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

Open `http://localhost:3000` in your browser!

---

## Available Scripts

### Frontend
- `npm start` - Run dev server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from CRA (one-way operation)

### Backend
- `python backend_api.py` - Run Flask server
- `python -m pytest` - Run tests

---

## API Documentation

All endpoints are available at: `http://localhost:5000/api/docs`

---

## Next Steps

1. ✓ Set up React project
2. ✓ Connect to Flask backend
3. ✓ Build authentication pages
4. ✓ Create health assessment form
5. ✓ Implement doctor booking
6. ✓ Add nutrition guides
7. ✓ Integrate payment gateway
8. ✓ Deploy to production

---

## Troubleshooting

### CORS Issues
Add to Flask backend:
```python
from flask_cors import CORS
CORS(app)
```

### API Connection Fails
Check if backend is running on `http://localhost:5000`

### Logout not working
Clear browser storage:
```javascript
localStorage.clear()
sessionStorage.clear()
```

---

**Ready to build? Start with the backend API first, then connect the frontend!**
