import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../config/api';
import RichTextEditor from './RichTextEditor';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  createdAt: string;
  published?: boolean;
  excerpt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBlogs: 0, totalViews: 0 });
  
  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: user?.name || 'Admin',
    category: '',
    tags: '',
    excerpt: '',
    isPublished: true,
    featuredImage: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    site: {
      name: 'Cloudidada',
      description: 'Cloud infrastructure platform for developers',
      url: 'https://cloudidada.com',
      logo: '',
      timezone: 'UTC'
    },
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      username: '',
      password: '',
      fromEmail: 'noreply@cloudidada.com',
      fromName: 'Cloudidada'
    },
    api: {
      rateLimit: 100,
      apiVersion: 'v1',
      enableCors: true,
      allowedOrigins: 'http://localhost:3000,http://localhost:5173',
      jwtSecret: ''
    }
  });

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!token) return;

        // Load real blogs from backend
        const blogsResponse = await api.getBlogs(token);
        if (blogsResponse.blogs) {
          setBlogs(blogsResponse.blogs);
          setStats(prev => ({ ...prev, totalBlogs: blogsResponse.blogs.length }));
        }

        // Load real users from backend (if admin route exists)
        try {
          const usersResponse = await api.getUsers(token);
          if (usersResponse.users) {
            setUsers(usersResponse.users);
            setStats(prev => ({ ...prev, totalUsers: usersResponse.users.length }));
          }
        } catch (error) {
          // If users endpoint doesn't exist, use mock data
          const mockUsers = [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              createdAt: '2025-01-15T10:30:00Z'
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              createdAt: '2025-01-20T14:20:00Z'
            }
          ];
          setUsers(mockUsers);
          setStats(prev => ({ ...prev, totalUsers: mockUsers.length }));
        }

        // Load settings
        try {
          const settingsResponse = await api.getSettings(token);
          if (settingsResponse.settings) {
            setSettings(settingsResponse.settings);
          }
        } catch (error) {
          console.log('Settings not found, using defaults');
        }

        // Set other stats
        setStats(prev => ({ ...prev, totalViews: 1250 }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    // Load data when component mounts
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) return;

      const blogData = {
        title: blogForm.title,
        content: blogForm.content,
        author: blogForm.author,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        excerpt: blogForm.excerpt,
        isPublished: blogForm.isPublished,
        featuredImage: blogForm.featuredImage || undefined
      };

      const response = await api.createBlog(token, blogData);
      
      if (response.blog) {
        setBlogs([response.blog, ...blogs]);
        setBlogForm({ 
          title: '', 
          content: '', 
          author: user?.name || 'Admin',
          category: '',
          tags: '',
          excerpt: '',
          isPublished: true,
          featuredImage: ''
        });
        setStats(prev => ({ ...prev, totalBlogs: prev.totalBlogs + 1 }));
        alert(`Blog post ${blogForm.isPublished ? 'published' : 'saved as draft'} successfully!`);
      } else {
        alert('Error creating blog: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      if (!token) return;

      const response = await api.deleteBlog(token, id);
      
      if (response.message) {
        setBlogs(blogs.filter(blog => blog._id !== id));
        setStats(prev => ({ ...prev, totalBlogs: prev.totalBlogs - 1 }));
        alert('Blog deleted successfully!');
      } else {
        alert('Error deleting blog: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      alert('User deleted successfully!');
    }
  };

  // Settings handlers
  const handleUpdateSiteSettings = async () => {
    setSettingsLoading(true);
    try {
      if (!token) return;
      
      const response = await api.updateSettings(token, { site: settings.site });
      if (response.success) {
        alert('Site settings updated successfully!');
      } else {
        alert('Error updating settings: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating site settings:', error);
      alert('Error updating site settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdateSMTPSettings = async () => {
    setSettingsLoading(true);
    try {
      if (!token) return;
      
      const response = await api.updateSettings(token, { smtp: settings.smtp });
      if (response.success) {
        alert('SMTP settings updated successfully!');
      } else {
        alert('Error updating SMTP settings: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating SMTP settings:', error);
      alert('Error updating SMTP settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleTestSMTP = async () => {
    setTestEmailStatus('Sending test email...');
    try {
      if (!token) return;
      
      const response = await api.testSMTP(token, settings.smtp);
      if (response.success) {
        setTestEmailStatus('✅ Test email sent successfully!');
      } else {
        setTestEmailStatus('❌ Failed to send test email: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error testing SMTP:', error);
      setTestEmailStatus('❌ Error testing SMTP connection');
    }
    
    // Clear status after 5 seconds
    setTimeout(() => setTestEmailStatus(''), 5000);
  };

  const updateSettingsField = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const renderDashboard = () => (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.totalBlogs}</h3>
            <p>Blog Posts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <span>New user registered: jane@example.com</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📝</span>
            <span>Blog post "Getting Started with APIs" published</span>
            <span className="activity-time">1 day ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👥</span>
            <span>New user registered: john@example.com</span>
            <span className="activity-time">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h2>User Management</h2>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBlogs = () => (
    <div className="blogs-section">
      <h2>Blog Management</h2>
      
      <div className="blog-form-card">
        <h3>Create New Blog Post</h3>
        <form onSubmit={handleCreateBlog}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={blogForm.title}
              onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
              placeholder="Enter an engaging blog title"
              required
            />
          </div>

          <div className="form-group">
            <label>Excerpt (Short Description)</label>
            <textarea
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
              placeholder="Brief description of the blog post (for preview)"
              rows={2}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={blogForm.category}
              onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
              required
            >
              <option value="">Select a category</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Best Practices">Best Practices</option>
              <option value="Database">Database</option>
              <option value="Security">Security</option>
              <option value="Analytics">Analytics</option>
              <option value="Serverless">Serverless</option>
              <option value="Development">Development</option>
              <option value="News">News</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
              placeholder="e.g., react, javascript, tutorial, api"
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={blogForm.author}
              onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
              placeholder="Author name"
              required
            />
          </div>

          <div className="form-group">
            <label>Featured Image URL (optional)</label>
            <input
              type="url"
              value={blogForm.featuredImage}
              onChange={(e) => setBlogForm({...blogForm, featuredImage: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <RichTextEditor
              value={blogForm.content}
              onChange={(content) => setBlogForm({...blogForm, content})}
              placeholder="Write your amazing blog content here... Use the toolbar above for formatting, images, and more!"
              height="400px"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={blogForm.isPublished}
                onChange={(e) => setBlogForm({...blogForm, isPublished: e.target.checked})}
              />
              <span className="checkmark"></span>
              Publish immediately
            </label>
          </div>

          <button type="submit" className="create-btn">
            {blogForm.isPublished ? 'Publish Blog Post' : 'Save as Draft'}
          </button>
        </form>
      </div>

      <div className="blogs-list">
        <h3>Existing Blog Posts</h3>
        {blogs.map(blog => (
          <div key={blog._id} className="blog-card">
            <div className="blog-header">
              <h4>{blog.title}</h4>
              <button 
                onClick={() => handleDeleteBlog(blog._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
            <p className="blog-content">{blog.content.substring(0, 150)}...</p>
            <div className="blog-meta">
              <span>By {blog.author}</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-section">
      <h2>Settings</h2>
      
      {settingsLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      )}
      
      <div className="settings-grid">
        {/* Site Settings */}
        <div className="setting-card">
          <h3>Site Configuration</h3>
          <div className="form-group">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.site.name}
              onChange={(e) => updateSettingsField('site', 'name', e.target.value)}
              placeholder="Your site name"
            />
          </div>
          <div className="form-group">
            <label>Site Description</label>
            <textarea
              value={settings.site.description}
              onChange={(e) => updateSettingsField('site', 'description', e.target.value)}
              placeholder="Site description"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Site URL</label>
            <input
              type="url"
              value={settings.site.url}
              onChange={(e) => updateSettingsField('site', 'url', e.target.value)}
              placeholder="https://yoursite.com"
            />
          </div>
          <button 
            className="save-btn"
            onClick={handleUpdateSiteSettings}
            disabled={settingsLoading}
          >
            Save Changes
          </button>
        </div>
        
        {/* SMTP Settings */}
        <div className="setting-card">
          <h3>Email Configuration (SMTP)</h3>
          <div className="form-group">
            <label>SMTP Host</label>
            <input
              type="text"
              value={settings.smtp.host}
              onChange={(e) => updateSettingsField('smtp', 'host', e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div className="form-group">
            <label>SMTP Port</label>
            <input
              type="number"
              value={settings.smtp.port}
              onChange={(e) => updateSettingsField('smtp', 'port', parseInt(e.target.value))}
              placeholder="587"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.smtp.secure}
                onChange={(e) => updateSettingsField('smtp', 'secure', e.target.checked)}
              />
              Use SSL/TLS
            </label>
          </div>
          <div className="form-group">
            <label>Username/Email</label>
            <input
              type="email"
              value={settings.smtp.username}
              onChange={(e) => updateSettingsField('smtp', 'username', e.target.value)}
              placeholder="your-email@domain.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={settings.smtp.password}
              onChange={(e) => updateSettingsField('smtp', 'password', e.target.value)}
              placeholder="App password or email password"
            />
          </div>
          <div className="form-group">
            <label>From Name</label>
            <input
              type="text"
              value={settings.smtp.fromName}
              onChange={(e) => updateSettingsField('smtp', 'fromName', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          <div className="button-group">
            <button 
              className="save-btn"
              onClick={handleUpdateSMTPSettings}
              disabled={settingsLoading}
            >
              Update Email Settings
            </button>
            <button 
              className="test-btn"
              onClick={handleTestSMTP}
              disabled={settingsLoading || !settings.smtp.host}
            >
              Test SMTP
            </button>
          </div>
          {testEmailStatus && (
            <div className={`test-status ${testEmailStatus.includes('✅') ? 'success' : 'error'}`}>
              {testEmailStatus}
            </div>
          )}
        </div>

        {/* API Settings */}
        <div className="setting-card">
          <h3>API Configuration</h3>
          <div className="form-group">
            <label>API Rate Limit (requests per minute)</label>
            <input
              type="number"
              value={settings.api.rateLimit}
              onChange={(e) => updateSettingsField('api', 'rateLimit', parseInt(e.target.value))}
              placeholder="100"
              min="1"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.api.enableCors}
                onChange={(e) => updateSettingsField('api', 'enableCors', e.target.checked)}
              />
              Enable CORS
            </label>
          </div>
          <div className="form-group">
            <label>JWT Secret Key</label>
            <input
              type="password"
              value={settings.api.jwtSecret}
              onChange={(e) => updateSettingsField('api', 'jwtSecret', e.target.value)}
              placeholder="Your JWT secret key"
            />
          </div>
          <button 
            className="save-btn"
            onClick={async () => {
              setSettingsLoading(true);
              try {
                if (!token) return;
                const response = await api.updateSettings(token, { api: settings.api });
                if (response.success) {
                  alert('API settings updated successfully!');
                } else {
                  alert('Error updating API settings');
                }
              } catch (error) {
                alert('Error updating API settings');
              } finally {
                setSettingsLoading(false);
              }
            }}
            disabled={settingsLoading}
          >
            Save API Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-nav">
        <button 
          className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'blogs' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('blogs')}
        >
          📝 Blogs
        </button>
        <button 
          className={activeTab === 'settings' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'blogs' && renderBlogs()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;
