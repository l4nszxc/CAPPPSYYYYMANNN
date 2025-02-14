<template>
    <div class="admin-container">
      <AdminNavbar 
        :username="username"
        @logout="showLogoutModal = true"
      />
      
      <div class="admin-content">
        <div class="dashboard-cards">
          <div class="card">
            <h3>Total Users</h3>
            <p class="number">{{ stats.totalUsers || 0 }}</p>
          </div>
          <div class="card">
            <h3>Verified Users</h3>
            <p class="number">{{ stats.verifiedUsers || 0 }}</p>
          </div>
          <div class="card">
            <h3>Active Users</h3>
            <p class="number">{{ stats.activeUsers || 0 }}</p>
          </div>
        </div>
  
        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <!-- Add your activity list here -->
          </div>
        </div>
      </div>
  
      <!-- Logout Confirmation Modal -->
      <div v-if="showLogoutModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to logout?</p>
          <div class="modal-buttons">
            <button @click="handleLogout" class="confirm-btn">Yes, Logout</button>
            <button @click="showLogoutModal = false" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AdminNavbar from '../components/AdminNavbar.vue'
  
  export default {
    name: 'AdminHome',
    components: {
      AdminNavbar
    },
    data() {
      return {
        username: '',
        showLogoutModal: false,
        stats: {
          totalUsers: 0,
          verifiedUsers: 0,
          activeUsers: 0
        }
      }
    },
    methods: {
      async handleLogout() {
        try {
          const response = await fetch('http://localhost:7904/api/users/logout', {
            method: 'POST',
            credentials: 'include'
          });
  
          if (response.ok) {
            localStorage.removeItem('token');
            this.$router.push('/login');
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
      async fetchStats() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:7904/api/admin/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            this.stats = await response.json();
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    },
    async mounted() {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        this.username = decoded.username || 'Admin';
      }
      await this.fetchStats();
    }
  }
  </script>
  
  <style scoped>
  .admin-container {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .admin-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .card h3 {
    margin: 0;
    color: #666;
    font-size: 1rem;
  }
  
  .card .number {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0.5rem 0 0;
  }
  
  .recent-activity {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .recent-activity h2 {
    margin: 0 0 1rem;
    color: #2c3e50;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    text-align: center;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .confirm-btn, .cancel-btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .confirm-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .cancel-btn {
    background-color: #95a5a6;
    color: white;
  }
  
  .confirm-btn:hover {
    background-color: #c0392b;
  }
  
  .cancel-btn:hover {
    background-color: #7f8c8d;
  }
  </style>