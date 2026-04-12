# Maternal Health Tracker - Database Setup Guide

## 📊 Database Overview

**Type**: PostgreSQL (Relational Database)  
**ORM**: SQLAlchemy (Python)  
**Migrations**: Alembic

---

## Installation

### Option 1: Local PostgreSQL (Windows)

1. **Download** from https://www.postgresql.org/download/windows/
2. **Install** with default settings
3. **Remember**: Password during installation
4. **Verify**: 
   ```bash
   psql --version
   ```

### Option 2: Docker

```bash
docker run --name maternal_health_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=maternal_health \
  -p 5432:5432 \
  -d postgres:14
```

### Option 3: Cloud (Recommended for Production)

- **Heroku Postgres**: Free tier available
- **AWS RDS**: Scalable, reliable
- **ElephantSQL**: PostgreSQL specifically
- **Cloud SQL (Google)**: Fully managed

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  lmp_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Health Records Table
```sql
CREATE TABLE health_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symptoms TEXT[],
  health_condition VARCHAR(100),
  risk_level VARCHAR(50),
  weeks_pregnant INTEGER,
  assessment_data JSONB,
  nutrition_suggestions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(100),
  license_number VARCHAR(100),
  experience_years INTEGER,
  rating FLOAT DEFAULT 0,
  availability JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE SET NULL,
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  consultation_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, appointment_date)
);
```

### Nutrition Plans Table
```sql
CREATE TABLE nutrition_plans (
  id SERIAL PRIMARY KEY,
  health_condition VARCHAR(100) NOT NULL,
  trimester VARCHAR(20),
  pregnancy_week INTEGER,
  recommended_foods TEXT[],
  foods_to_avoid TEXT[],
  daily_calories INTEGER,
  protein_grams INTEGER,
  calcium_mg INTEGER,
  iron_mg INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Emergency Services Table
```sql
CREATE TABLE emergency_services (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(50),
  status VARCHAR(50),
  delivery_address TEXT,
  phone_number VARCHAR(20),
  order_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Setup Instructions

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE maternal_health;

# Connect to new database
\c maternal_health
```

### Step 2: Create Tables

Run all SQL statements above in order:

```bash
# Using psql
psql -U postgres -d maternal_health -f schema.sql

# Or paste each CREATE TABLE statement individually
```

### Step 3: Create Indexes

```sql
-- For faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_reviews_doctor_id ON reviews(doctor_id);
```

### Step 4: Update .env

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/maternal_health
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maternal_health
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## SQLAlchemy Models

Create `models.py`:

```python
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, ARRAY, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    date_of_birth = Column(DateTime)
    lmp_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    health_records = relationship('HealthRecord', back_populates='user')
    appointments = relationship('Appointment', back_populates='user')
    reviews = relationship('Review', back_populates='user')

class HealthRecord(Base):
    __tablename__ = 'health_records'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    symptoms = Column(ARRAY(String))
    health_condition = Column(String(100))
    risk_level = Column(String(50))
    weeks_pregnant = Column(Integer)
    assessment_data = Column(JSON)
    nutrition_suggestions = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='health_records')

class Doctor(Base):
    __tablename__ = 'doctors'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20))
    specialization = Column(String(100))
    license_number = Column(String(100))
    experience_years = Column(Integer)
    rating = Column(Float, default=0)
    availability = Column(JSON)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    appointments = relationship('Appointment', back_populates='doctor')
    reviews = relationship('Review', back_populates='doctor')

class Appointment(Base):
    __tablename__ = 'appointments'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    appointment_date = Column(DateTime, nullable=False)
    status = Column(String(50), default='confirmed')
    consultation_type = Column(String(50))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='appointments')
    doctor = relationship('Doctor', back_populates='appointments')

class NutritionPlan(Base):
    __tablename__ = 'nutrition_plans'
    
    id = Column(Integer, primary_key=True)
    health_condition = Column(String(100), nullable=False)
    trimester = Column(String(20))
    pregnancy_week = Column(Integer)
    recommended_foods = Column(ARRAY(String))
    foods_to_avoid = Column(ARRAY(String))
    daily_calories = Column(Integer)
    protein_grams = Column(Integer)
    calcium_mg = Column(Integer)
    iron_mg = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    doctor = relationship('Doctor', back_populates='reviews')
    user = relationship('User', back_populates='reviews')

class EmergencyService(Base):
    __tablename__ = 'emergency_services'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    service_type = Column(String(50))
    status = Column(String(50))
    delivery_address = Column(Text)
    phone_number = Column(String(20))
    order_details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
```

---

## Database Initialization

Create `init_db.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Doctor, NutritionPlan
import os

# Database URL from environment
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost/maternal_health')

# Create engine
engine = create_engine(DATABASE_URL)

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

# Add sample data
def seed_db():
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Sample doctors
    doctors = [
        Doctor(
            name='Dr. Sarah Johnson',
            email='sarah@example.com',
            specialization='Obstetrics',
            experience_years=10,
            is_verified=True
        ),
        Doctor(
            name='Dr. Priya Patel',
            email='priya@example.com',
            specialization='Maternal Care',
            experience_years=8,
            is_verified=True
        ),
    ]
    
    # Sample nutrition plans
    nutrition = [
        NutritionPlan(
            health_condition='Normal Pregnancy',
            trimester='First',
            pregnancy_week=12,
            daily_calories=2500,
            protein_grams=75,
            calcium_mg=1000,
            iron_mg=27
        )
    ]
    
    session.add_all(doctors + nutrition)
    session.commit()
    session.close()
    print("✓ Sample data added successfully!")

if __name__ == '__main__':
    init_db()
    seed_db()
```

Run:
```bash
python init_db.py
```

---

## Backup & Restore

### Backup Database

```bash
# Full backup
pg_dump -U postgres maternal_health > backup.sql

# Compressed backup
pg_dump -U postgres maternal_health | gzip > backup.sql.gz
```

### Restore Database

```bash
# From SQL file
psql -U postgres maternal_health < backup.sql

# From compressed file
gunzip < backup.sql.gz | psql -U postgres maternal_health
```

---

## Database Performance Tips

### Enable Slow Query Logging
```sql
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

### Analyze & Vacuum
```sql
-- Optimize database
VACUUM ANALYZE;

-- Check table size
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitor Connections
```sql
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

---

## Migration with Alembic

### Setup

```bash
pip install alembic

alembic init alembic

# Edit alembic/env.py
# Update sqlalchemy.url with DATABASE_URL
```

### Create Migration

```bash
# Auto-generate migration
alembic revision --autogenerate -m "Initial schema"

# Review and edit alembic/versions/xxx_initial_schema.py
# Apply migration
alembic upgrade head
```

---

## Connection Pooling

For production applications:

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True
)
```

---

## Testing Database

Create `test_db.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User

# Use separate test database
TEST_DATABASE_URL = "postgresql://postgres:password@localhost/maternal_health_test"

engine = create_engine(TEST_DATABASE_URL)

def setup_test_db():
    Base.metadata.create_all(bind=engine)

def teardown_test_db():
    Base.metadata.drop_all(bind=engine)

def test_user_creation():
    setup_test_db()
    Session = sessionmaker(bind=engine)
    session = Session()
    
    user = User(
        email='test@example.com',
        password='hashed_password',
        full_name='Test User'
    )
    session.add(user)
    session.commit()
    
    assert user.id is not None
    
    teardown_test_db()

if __name__ == '__main__':
    test_user_creation()
```

---

## Database Maintenance

### Weekly Tasks
- Backup database
- Check disk space
- Monitor slow queries
- Review error logs

### Monthly Tasks
- Optimize indexes
- Analyze query performance
- Update statistics
- Test restore procedures

### Quarterly Tasks
- Security audit
- Performance tuning
- Capacity planning
- Disaster recovery drill

---

## Troubleshooting

### Connection Refused
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (if not running)
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

### Authentication Failed
```bash
# Reset PostgreSQL password
psql -U postgres

ALTER USER postgres WITH PASSWORD 'new_password';
```

### Disk Space Issues
```sql
-- Find large tables
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC 
LIMIT 10;
```

---

**Database setup complete! Your Maternal Health Tracker is ready to store data.** 🗄️
