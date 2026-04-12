import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NutritionGuide() {
  const navigate = useNavigate();
  const [pregnancyWeek, setPregnancyWeek] = useState('20');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const nutritionGuide = {
    first_trimester: {
      title: 'First Trimester (Weeks 1-13)',
      calories: '200-300 extra calories per day',
      focus: 'Folic acid, iron, protein',
      foods: {
        vegetables: ['Spinach', 'Broccoli', 'Asparagus', 'Dark leafy greens', 'Kale'],
        fruits: ['Oranges', 'Strawberries', 'Blueberries', 'Grapes', 'Papaya (cooked)'],
        proteins: ['Lentils', 'Chickpeas', 'Tofu', 'Almonds', 'Peanuts'],
        grains: ['Whole wheat bread', 'Brown rice', 'Oats', 'Barley', 'Quinoa'],
        dairy: ['Milk (pasteurized)', 'Yogurt', 'Cheese', 'Paneer', 'Ghee (limited)'],
      },
      tips: ['Eat small, frequent meals', 'Stay hydrated (8-10 glasses water)', 'Take prenatal vitamins with folic acid'],
      benefits: 'Prevents neural tube defects, supports early development',
    },
    second_trimester: {
      title: 'Second Trimester (Weeks 14-27)',
      calories: '300-400 extra calories per day',
      focus: 'Calcium, protein, iron',
      foods: {
        vegetables: ['Carrots', 'Sweet potatoes', 'Bell peppers', 'Tomatoes', 'Cucumbers'],
        fruits: ['Apples', 'Bananas', 'Mangoes', 'Pomegranate', 'Watermelon'],
        proteins: ['Chicken', 'Fish (low-mercury)', 'Eggs', 'Beans', 'Nuts'],
        grains: ['Fortified cereals', 'White rice', 'Pasta', 'Ragi', 'Bajra'],
        dairy: ['Milk', 'Yogurt', 'Curd', 'Cottage cheese', 'Fortified milk'],
      },
      tips: ['Increase calcium intake (1000mg daily)', 'Add more protein (70-100g daily)', 'Include iron-rich foods'],
      benefits: 'Supports baby growth, bone development, reduces anemia risk',
    },
    third_trimester: {
      title: 'Third Trimester (Weeks 28-40)',
      calories: '400-500 extra calories per day',
      focus: 'Protein, omega-3, calcium, iron',
      foods: {
        vegetables: ['Pumpkin', 'Zucchini', 'Beets', 'Brussels sprouts', 'Green beans'],
        fruits: ['Peaches', 'Apricots', 'Dates', 'Prunes', 'Avocado'],
        proteins: ['Salmon', 'Sardines', 'Lean beef', 'Turkey', 'Legumes'],
        grains: ['Whole grain bread', 'Millet', 'Corn', 'Buckwheat', 'Semolina'],
        dairy: ['Milk', 'Greek yogurt', 'Calcium-fortified milk', 'Buttermilk', 'Kheer (cooked)'],
      },
      tips: ['Eat frequent small meals', 'Include omega-3 fatty acids (fish 2x/week)', 'Stay well hydrated'],
      benefits: 'Prepares for labor, supports baby weight gain, boosts energy',
    },
  };

  const getCurrentGuide = () => {
    const week = parseInt(pregnancyWeek);
    if (week < 14) return nutritionGuide.first_trimester;
    if (week < 28) return nutritionGuide.second_trimester;
    return nutritionGuide.third_trimester;
  };

  const guide = getCurrentGuide();

  const categories = [
    { key: 'vegetables', label: '🥗 Vegetables', icon: '🥬' },
    { key: 'fruits', label: '🍎 Fruits', icon: '🍌' },
    { key: 'proteins', label: '🥚 Proteins', icon: '🍗' },
    { key: 'grains', label: '🌾 Grains', icon: '🍚' },
    { key: 'dairy', label: '🥛 Dairy', icon: '🧀' },
  ];

  const getFoodsToDisplay = () => {
    if (selectedCategory === 'all') {
      return guide.foods;
    }
    return { [selectedCategory]: guide.foods[selectedCategory] };
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div style={styles.mainCard}>
        <h1 style={styles.title}>🥗 Nutrition Guide for Healthy Pregnancy</h1>
        <p style={styles.subtitle}>Personalized nutrition based on your pregnancy stage</p>

        <div style={styles.weekSelector}>
          <label style={styles.label}>Your Pregnancy Week:</label>
          <select
            value={pregnancyWeek}
            onChange={(e) => setPregnancyWeek(e.target.value)}
            style={styles.select}
          >
            {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.guideSection}>
          <div style={styles.trimesterCard}>
            <h2 style={styles.guideTitle}>{guide.title}</h2>
            
            <div style={styles.benefitsBox}>
              <span style={styles.benefitsIcon}>✨</span>
              <p style={styles.benefitsText}><strong>Benefits:</strong> {guide.benefits}</p>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <span style={styles.infoIcon}>⚡</span>
                <p style={styles.infoLabel}>Daily Calories</p>
                <p style={styles.infoValue}>{guide.calories}</p>
              </div>
              <div style={styles.infoCard}>
                <span style={styles.infoIcon}>🥗</span>
                <p style={styles.infoLabel}>Key Nutrients</p>
                <p style={styles.infoValue}>{guide.focus}</p>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🍽️ Recommended Foods by Category</h3>
              
              <div style={styles.categoryTabs}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    ...styles.categoryTab,
                    ...(selectedCategory === 'all' ? styles.categoryTabActive : {}),
                  }}
                >
                  All Foods
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      ...styles.categoryTab,
                      ...(selectedCategory === cat.key ? styles.categoryTabActive : {}),
                    }}
                    title={cat.label}
                  >
                    {cat.icon} {cat.label.split(' ')[1]}
                  </button>
                ))}
              </div>

              <div style={styles.foodsGrid}>
                {Object.entries(getFoodsToDisplay()).map(([categoryKey, foods]) => (
                  <div key={categoryKey}>
                    {selectedCategory === 'all' && (
                      <h4 style={styles.categoryHeader}>
                        {categories.find(c => c.key === categoryKey)?.icon} 
                        {' '}
                        {categories.find(c => c.key === categoryKey)?.label.split(' ')[1]}
                      </h4>
                    )}
                    <div style={styles.foodGrid}>
                      {foods.map((food, idx) => (
                        <div key={idx} style={styles.foodCard}>
                          <span style={styles.foodIcon}>✓</span>
                          <span style={styles.foodName}>{food}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💡 Daily Tips for This Trimester</h3>
              <div style={styles.tipsList}>
                {guide.tips.map((tip, idx) => (
                  <div key={idx} style={styles.tipCard}>
                    <span style={styles.tipIcon}>✓</span>
                    <span style={styles.tipText}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            onClick={() => navigate('/food-delivery')}
            style={styles.foodBtn}
          >
            🛒 Order Healthy Food
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '1100px',
    margin: '0 auto',
    boxShadow: '0 12px 35px rgba(16, 185, 129, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: '28px',
    fontWeight: '500',
  },
  weekSelector: {
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '15px',
  },
  select: {
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  guideSection: {
    marginBottom: '30px',
  },
  trimesterCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '28px',
    border: '2px solid #e5e7eb',
  },
  guideTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  },
  benefitsBox: {
    backgroundColor: '#fef3c7',
    border: '2px solid #fcd34d',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '20px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  benefitsIcon: {
    fontSize: '24px',
    minWidth: '24px',
  },
  benefitsText: {
    color: '#78350f',
    fontSize: '14px',
    margin: '0',
    lineHeight: '1.5',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  infoCard: {
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
  },
  infoIcon: {
    fontSize: '28px',
    display: 'block',
    marginBottom: '8px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 6px 0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#111827',
    margin: '0',
    fontWeight: '600',
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  },
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  categoryTab: {
    padding: '8px 14px',
    backgroundColor: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    color: '#6b7280',
  },
  categoryTabActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    color: 'white',
  },
  foodsGrid: {
    marginBottom: '16px',
  },
  categoryHeader: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginTop: '16px',
    marginBottom: '12px',
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '10px',
    marginBottom: '12px',
  },
  foodCard: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#166534',
  },
  foodIcon: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#10b981',
  },
  foodName: {
    fontWeight: '500',
  },
  tipsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px',
  },
  tipCard: {
    backgroundColor: '#eff6ff',
    border: '2px solid #bfdbfe',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: '16px',
    color: '#3b82f6',
    fontWeight: 'bold',
    minWidth: '20px',
  },
  tipText: {
    fontSize: '13px',
    color: '#1e40af',
    lineHeight: '1.4',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '28px',
  },
  foodBtn: {
    padding: '14px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
};
