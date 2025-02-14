<template>
    <div class="admin-container">
      <Navbar 
        :username="username"
        :isAdmin="true"
        @logout="showLogoutModal = true"
      />
      
      <div class="content">
        <h2>Admin Dashboard</h2>
        <div class="admin-stats">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p>{{ stats.totalUsers || 0 }}</p>
          </div>
          <div class="stat-card">
            <h3>Verified Users</h3>
            <p>{{ stats.verifiedUsers || 0 }}</p>
          </div>
        </div>
      </div>
  
      <LogoutModal 
        :show="showLogoutModal"
        @confirm="handleLogout"
        @cancel="showLogoutModal = false"
      />
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue'
  import LogoutModal from '../components/LogoutModal.vue'
  
  export default {
    name: 'AdminHome',
    components: {
      Navbar,
      LogoutModal
    },
    data() {
      return {
        username: '',
        showLogoutModal: false,
        stats: {
          totalUsers: 0,
          verifiedUsers: 0
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
          console.error('Error during logout:', error);
        } finally {
          this.showLogoutModal = false;
        }
      },
      async getUserData() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.$router.push('/login');
            return;
          }
  
          const response = await fetch('http://localhost:7904/api/users/getUsername', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });
  
          if (response.ok) {
            const data = await response.json();
            this.username = data.username;
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      },
      async getStats() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:7904/api/users/admin/stats', {
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
      await this.getUserData();
      await this.getStats();
    }
  }
  </script>
  
  <style scoped>
  .admin-container {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .stat-card h3 {
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .stat-card p {
    font-size: 2rem;
    color: #4CAF50;
    font-weight: bold;
    margin: 0;
  }
  </style>