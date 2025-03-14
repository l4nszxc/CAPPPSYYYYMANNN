<template>
  <div class="admin-container">
    <AdminNavbar 
      :username="username"
      @logout="showLogoutModal = true"
    />
    
    <div class="admin-content">
      <div class="dashboard-cards">
        <router-link to="/admin/users" class="card clickable">
          <i class="fas fa-users"></i>
          <h3>Total Users</h3>
          <p class="number">{{ stats.totalUsers || 0 }}</p>
        </router-link>  

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

        <router-link to="/admin/orders" class="card clickable">
          <i class="fas fa-shopping-cart"></i>
          <h3>Total Orders</h3>
          <p class="number">{{ stats.totalOrders || 0 }}</p>
        </router-link>

        <router-link to="/admin/products" class="card clickable">
          <i class="fas fa-warehouse"></i>
          <h3>Total Stock</h3>
          <p class="number">{{ stats.totalStock || 0 }}</p>
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
      
    <div class="dashboard-section">
      <h2>
          <i class="fas fa-star"></i>
          Top Performing Staff
      </h2>
      <div class="table-container">
          <table v-if="stats.topStaff && stats.topStaff.length">
              <thead>
                  <tr>
                      <th>Rank</th>
                      <th>Staff Name</th>
                      <th>Orders Handled</th>
                      <th>Total Sales</th>
                      <th>Performance</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(staff, index) in stats.topStaff" :key="staff.id">
                      <td>
                          <span class="rank">{{ index + 1 }}</span>
                      </td>
                      <td>{{ staff.username }}</td>
                      <td>{{ staff.orders_handled }}</td>
                      <td>₱{{ formatPrice(staff.total_sales) }}</td>
                      <td>
                          <div class="performance-indicator">
                              <i class="fas fa-trophy" v-if="index === 0"></i>
                              <i class="fas fa-medal" v-else-if="index === 1"></i>
                              <i class="fas fa-award" v-else-if="index === 2"></i>
                              {{ getPerformanceLabel(staff.orders_handled) }}
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p v-else class="no-data">
              <i class="fas fa-users"></i>
              No staff performance data available yet
          </p>
      </div>
  </div>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-content">
            <h2>Edit Product</h2>
            <form @submit.prevent="handleEditSubmit" class="edit-form">
                <div class="form-group">
                    <label for="name">Product Name</label>
                    <input type="text" id="name" v-model="editingProduct.name" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="editingProduct.description" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="price">Price</label>
                    <input type="number" id="price" v-model="editingProduct.price" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="stock">Stock Quantity</label>
                    <input type="number" id="stock" v-model="editingProduct.stock_quantity" required>
                </div>
                
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" v-model="editingProduct.category" required>
                        <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                        <option value="Dairy & Eggs">Dairy & Eggs</option>
                        <option value="Meat & Seafood">Meat & Seafood</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Bakery & Snacks">Bakery & Snacks</option>
                        <option value="Canned & Packaged Goods">Canned & Packaged Goods</option>
                        <option value="Frozen Foods">Frozen Foods</option>
                        <option value="Grains & Pasta">Grains & Pasta</option>
                        <option value="Condiments & Sauces">Condiments & Sauces</option>
                        <option value="Spices & Seasonings">Spices & Seasonings</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="newImage">New Image (optional)</label>
                    <input type="file" id="newImage" @change="handleImageUpload" accept="image/*">
                </div>

                <div class="modal-buttons">
                    <button type="submit" class="save-btn">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button type="button" @click="closeModal" class="cancel-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
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
            showEditModal: false, 
            editingProduct: null, 
            newImage: null, 
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
      getPerformanceLabel(ordersHandled) {
        if (ordersHandled >= 50) return 'Outstanding';
        if (ordersHandled >= 30) return 'Excellent';
        if (ordersHandled >= 20) return 'Great';
        if (ordersHandled >= 10) return 'Good';
        return 'New';
    },
      editProduct(product) {
        this.editingProduct = { ...product };
        this.showEditModal = true;
    },

    closeModal() {
        this.showEditModal = false;
        this.editingProduct = null;
        this.newImage = null;
    },

    handleImageUpload(event) {
        this.newImage = event.target.files[0];
    },
      formatPrice(price) {
          const num = Number(price);
          if (num >= 1000) {
              return `${(num / 1000).toFixed(1)}k`;
          }
          return num.toFixed(2);
    },
    async handleEditSubmit() {
        try {
            const formData = new FormData();
            Object.keys(this.editingProduct).forEach(key => {
                formData.append(key, this.editingProduct[key]);
            });
            if (this.newImage) {
                formData.append('image', this.newImage);
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:7904/api/admin/products/${this.editingProduct.products_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                this.closeModal();
                await this.fetchDashboardStats(); // Refresh the dashboard data
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
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
    await this.fetchDashboardStats();
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
    margin: 0 auto;
  }
  
  /* Dashboard Cards */
  .dashboard-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
  
.card {
  background: white;
  padding: 1.5rem; /* Reduced padding */
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
  .rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #f3f4f6;
    color: #4b5563;
    font-weight: 600;
    font-size: 0.875rem;
}

.performance-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    background-color: #f0fdf4;
    color: #166534;
}

.performance-indicator i {
    color: #fbbf24;
}

tr:nth-child(1) .rank {
    background-color: #fef3c7;
    color: #92400e;
}

tr:nth-child(2) .rank {
    background-color: #f1f5f9;
    color: #475569;
}

tr:nth-child(3) .rank {
    background-color: #fff7ed;
    color: #9a3412;
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
    max-width: 500px;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.95rem;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.save-btn, .cancel-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    border: none;
}

.save-btn {
    background-color: #10b981;
    color: white;
}

.cancel-btn {
    background-color: #ef4444;
    color: white;
}

.save-btn:hover {
    background-color: #059669;
}

.cancel-btn:hover {
    background-color: #dc2626;
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
      grid-template-columns: repeat(2, 1fr);
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
  @media (max-width: 1200px) {
  .dashboard-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
  @media (max-width: 480px) {
    .table-container {
      margin: 0 -1rem;
      border-radius: 0;
    }
    .dashboard-cards {
    grid-template-columns: 1fr;
  }
  }
  </style>