<template>
  <div class="admin-container">
    <AdminNavbar 
      :username="username"
      @logout="showLogoutModal = true"
    />
    
    <div class="admin-content">
      <!-- Summary Statistics Cards -->
      <div class="dashboard-cards">
        <div class="card">
          <i class="fas fa-dollar-sign"></i>
          <h3>Total Sales</h3>
          <p class="number">₱{{ formatPrice(stats.totalSales || 0) }}</p>
        </div>

        <router-link to="/admin/products" class="card clickable">
          <i class="fas fa-box"></i>
          <h3>Total Products</h3>
          <p class="number">{{ stats.totalProducts || 0 }}</p>
      </router-link>

        <div class="card">
          <i class="fas fa-shopping-cart"></i>
          <h3>Total Orders</h3>
          <p class="number">{{ stats.totalOrders || 0 }}</p>
        </div>

        <div class="card">
          <i class="fas fa-warehouse"></i>
          <h3>Total Stock</h3>
          <p class="number">{{ stats.totalStock || 0 }}</p>
        </div>

        <router-link to="/admin/users" class="card clickable">
          <i class="fas fa-users"></i>
          <h3>Total Users</h3>
          <p class="number">{{ stats.totalUsers || 0 }}</p>
        </router-link>
      </div>

      <!-- Low Stock Alert Section -->
      <div class="dashboard-section">
        <h2>
          <i class="fas fa-exclamation-triangle"></i>
          Low Stock Alert
        </h2>
        <div class="table-container">
          <table v-if="stats.lowStock && stats.lowStock.length">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock Left</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in stats.lowStock" :key="product.products_id">
                <td>{{ product.name }}</td>
                <td>
                  <span :class="{'critical-stock': product.stock_quantity <= 5}">
                    {{ product.stock_quantity }}
                  </span>
                </td>
                <td>₱{{ formatPrice(product.price) }}</td>
                <td>
                  <button @click="editProduct(product)" class="edit-btn">
                    <i class="fas fa-edit"></i> Edit Stock
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">
            <i class="fas fa-check-circle"></i>
            No products with low stock
          </p>
        </div>
      </div>

      <!-- Top Selling Products Section -->
      <div class="dashboard-section">
        <h2>
          <i class="fas fa-chart-line"></i>
          Top Selling Products
        </h2>
        <div class="table-container">
          <table v-if="stats.topProducts && stats.topProducts.length">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Total Revenue</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in stats.topProducts" :key="product.name">
                <td>
                  <span class="rank">{{ index + 1 }}</span>
                  {{ product.name }}
                </td>
                <td>
                  <span class="units-sold">{{ product.quantity }}</span>
                </td>
                <td>₱{{ formatPrice(product.total) }}</td>
                <td>
                  <div class="performance-indicator">
                    <i class="fas fa-arrow-up"></i>
                    High Demand
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">
            <i class="fas fa-chart-bar"></i>
            No sales data available yet
          </p>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
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
    name: 'AdminHome',
    components: {
      AdminNavbar,
      LogoutModal
    },
    data() {
    return {
      username: '',
      showLogoutModal: false,
      stats: {
        totalSales: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalStock: 0,
        lowStock: [],
        topProducts: []
      }
    }
  },
    methods: {
      formatPrice(price) {
      return Number(price).toFixed(2);
    },
    async fetchDashboardStats() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7904/api/admin/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.stats = data;
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    },
    editProduct(product) {
      // Implement edit product functionality
    },
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
            const data = await response.json();
            this.stats = {
              totalUsers: data.totalUsers || 0,
              verifiedUsers: data.verifiedUsers || 0
            };
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
    },
    mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.username = decoded.username || 'Admin';
    }
    this.fetchDashboardStats();
  }
  }
  </script>
  <style scoped>
  /* Base Layout */
  .admin-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-left: 250px; /* Match sidebar width */
  }
  
  .admin-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Dashboard Cards */
  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .clickable {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }
  
  .clickable:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  .card h3 {
    margin: 0;
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .card .number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #1e293b;
    margin: 1rem 0 0;
    line-height: 1;
  }
  
  /* Dashboard Sections */
  .dashboard-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
  }
  
  .dashboard-section h2 {
    color: #1e293b;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  /* Tables */
  .table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }
  
  tr:hover {
    background-color: #f8fafc;
  }
  
  .critical-stock {
    color: #dc2626;
    font-weight: 600;
    background-color: #fee2e2;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .edit-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .edit-btn:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
  
  .no-data {
    text-align: center;
    color: #64748b;
    padding: 3rem;
    font-size: 1rem;
  }
  
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .admin-container {
      padding-left: 60px; /* Match collapsed sidebar width */
    }
    .admin-content {
      padding: 1rem;
    }
  
    .dashboard-cards {
      grid-template-columns: 1fr;
    }
  
    .card {
      padding: 1.5rem;
    }
  
    .dashboard-section {
      padding: 1.5rem;
    }
  
    th, td {
      padding: 0.75rem 1rem;
    }
  
    .card .number {
      font-size: 2rem;
    }
  
    .modal-content {
      padding: 2rem;
      margin: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .table-container {
      margin: 0 -1rem;
      border-radius: 0;
    }
  }
  </style>