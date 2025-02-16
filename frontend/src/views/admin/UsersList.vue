<template>
  <div class="users-list-container">
    <AdminNavbar 
      :username="username"
      @logout="showLogoutModal = true"
    />
    
    <div class="users-content">
      <div class="header">
        <h2>All Users</h2>
        <div class="filters">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search by username or email..."
            >
          </div>
          <select v-model="statusFilter" class="status-filter">
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(user)]">
                  {{ user.email_verified ? 'Verified' : 'Unverified' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredUsers.length === 0" class="no-results">
          No users found matching your search criteria
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
import AdminNavbar from '../../components/AdminNavbar.vue'
import LogoutModal from '../../components/LogoutModal.vue'

export default {
  name: 'UsersList',
  components: {
      AdminNavbar,
      LogoutModal
  },
  data() {
      return {
          username: '',
          users: [],
          searchQuery: '',
          statusFilter: 'all',
          showLogoutModal: false
      }
  },
  computed: {
      filteredUsers() {
          return this.users.filter(user => {
              const matchesSearch = !this.searchQuery || 
                  user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(this.searchQuery.toLowerCase());

              const matchesStatus = this.statusFilter === 'all' || 
                  (this.statusFilter === 'verified' && user.email_verified) ||
                  (this.statusFilter === 'unverified' && !user.email_verified);

              return matchesSearch && matchesStatus;
          });
      }
  },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      getStatusClass(user) {
        return user.email_verified ? 'verified' : 'unverified';
      },
    async fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7904/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.users = data.map(user => ({
            ...user,
            email_verified: Boolean(user.email_verified)
          }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
      async handleLogout() {
        try {
          const response = await fetch('http://localhost:7904/api/users/logout', {
            method: 'POST',
            credentials: 'include'
          })
          
          if (response.ok) {
            localStorage.removeItem('token')
            this.$router.push('/login')
          }
        } catch (error) {
          console.error('Logout failed:', error)
        }
      }
    },
    mounted() {
      const token = localStorage.getItem('token')
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        this.username = decoded.username || 'Admin'
      }
      this.fetchUsers()
    }
  }
  </script>
  
  
<style scoped>
.users-list-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.users-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.filters {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-box input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 250px;
    font-size: 1rem;
}

.status-filter {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
}

.table-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.verified {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.unverified {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.no-results {
    padding: 2rem;
    text-align: center;
    color: #666;
}

/* Responsive styles */
@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 1rem;
    }

    .filters {
        flex-direction: column;
        width: 100%;
    }

    .search-box input,
    .status-filter {
        width: 100%;
    }
}
</style>