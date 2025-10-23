// RentHub Frontend Integration Example
// This file shows how to integrate your React frontend with the Laravel backend

// API Configuration
const API_CONFIG = {
  // For production (separate VPS)
  production: 'https://admin.yourdomain.com/api',
  
  // For development
  development: 'http://127.0.0.1:8000/api',
  
  // Get current environment
  getBaseURL: () => {
    return process.env.NODE_ENV === 'production' 
      ? API_CONFIG.production 
      : API_CONFIG.development;
  }
};

// API Service Class
class RentHubAPI {
  constructor() {
    this.baseURL = API_CONFIG.getBaseURL();
    this.token = localStorage.getItem('auth_token');
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ========== Settings API ==========
  
  // Get public website settings
  async getWebsiteSettings() {
    return this.request('/settings/public');
  }

  // Test CORS configuration
  async testCORS() {
    return this.request('/test-cors');
  }

  // ========== Authentication API ==========
  
  // User registration
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User login
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  // User logout
  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Update password
  async updatePassword(passwordData) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // ========== Properties API ==========
  
  // Get all properties
  async getProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/properties${queryString ? `?${queryString}` : ''}`);
  }

  // Get single property
  async getProperty(id) {
    return this.request(`/properties/${id}`);
  }

  // Create property (authenticated)
  async createProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // Update property (authenticated)
  async updateProperty(id, propertyData) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  // Delete property (authenticated)
  async deleteProperty(id) {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Bookings API ==========
  
  // Get user bookings (authenticated)
  async getBookings() {
    return this.request('/bookings');
  }

  // Get single booking (authenticated)
  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  // Create booking (authenticated)
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Update booking (authenticated)
  async updateBooking(id, bookingData) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  // Delete booking (authenticated)
  async deleteBooking(id) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Reviews API ==========
  
  // Get reviews
  async getReviews() {
    return this.request('/reviews');
  }

  // Create review (authenticated)
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // ========== Search API ==========
  
  // Advanced search
  async search(searchParams) {
    const queryString = new URLSearchParams(searchParams).toString();
    return this.request(`/search?${queryString}`);
  }
}

// Create API instance
const api = new RentHubAPI();

// ========== React Hooks for Integration ==========

// Custom hook for website settings
export const useWebsiteSettings = () => {
  const [settings, setSettings] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.getWebsiteSettings();
        setSettings(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.getCurrentUser()
        .then(response => setUser(response.user))
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return { user, login, logout, loading };
};

// ========== React Components Examples ==========

// Website Settings Component
export const WebsiteHeader = () => {
  const { settings, loading, error } = useWebsiteSettings();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading settings</div>;

  return (
    <header>
      <h1>{settings?.website_name || 'RentHub'}</h1>
      <p>{settings?.website_description}</p>
      <div className="contact-info">
        {settings?.contact_email && (
          <a href={`mailto:${settings.contact_email}`}>
            {settings.contact_email}
          </a>
        )}
        {settings?.contact_phone && (
          <a href={`tel:${settings.contact_phone}`}>
            {settings.contact_phone}
          </a>
        )}
      </div>
      <div className="social-links">
        {settings?.facebook_url && (
          <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        )}
        {settings?.twitter_url && (
          <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
        {settings?.instagram_url && (
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        )}
      </div>
    </header>
  );
};

// Maintenance Mode Component
export const MaintenanceMode = () => {
  const { settings } = useWebsiteSettings();

  if (!settings?.maintenance_mode) return null;

  return (
    <div className="maintenance-mode">
      <h2>Site Under Maintenance</h2>
      <p>{settings.maintenance_message || 'We\'ll be back soon!'}</p>
    </div>
  );
};

// Login Component
export const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // Redirect or update UI
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

// ========== Utility Functions ==========

// Test API connection
export const testAPIConnection = async () => {
  try {
    const response = await api.testCORS();
    console.log('✅ API Connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    return false;
  }
};

// Initialize app with settings
export const initializeApp = async () => {
  try {
    // Test connection
    await testAPIConnection();
    
    // Load website settings
    const settingsResponse = await api.getWebsiteSettings();
    
    // Update document title
    if (settingsResponse.data?.website_name) {
      document.title = settingsResponse.data.website_name;
    }
    
    // Update meta description
    if (settingsResponse.data?.website_description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settingsResponse.data.website_description);
      }
    }
    
    return settingsResponse.data;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
};

// Export API instance
export default api;

// ========== Usage Example in Main App ==========

/*
// In your main App.js or App.tsx

import React from 'react';
import api, { 
  useWebsiteSettings, 
  useAuth, 
  WebsiteHeader, 
  MaintenanceMode,
  initializeApp 
} from './renthub-api';

function App() {
  const { settings } = useWebsiteSettings();
  const { user, logout } = useAuth();
  const [apiReady, setApiReady] = React.useState(false);

  React.useEffect(() => {
    initializeApp()
      .then(() => setApiReady(true))
      .catch(console.error);
  }, []);

  if (!apiReady) {
    return <div>Loading RentHub...</div>;
  }

  // Show maintenance mode if enabled
  if (settings?.maintenance_mode) {
    return <MaintenanceMode />;
  }

  return (
    <div className="App">
      <WebsiteHeader />
      
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginForm />
      )}
      
      // Your app content here
    </div>
  );
}

export default App;
*/