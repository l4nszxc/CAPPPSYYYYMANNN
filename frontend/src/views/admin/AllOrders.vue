<template>
    <div class="admin-container">
        <AdminNavbar :username="username" @logout="showLogoutModal = true" />
        
        <div class="admin-content">
            <h1><i class="fas fa-shopping-cart"></i> All Orders</h1>
            
            <div class="filters-container">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Search by order ID or customer name..."
                    >
                </div>
                <div class="status-filter">
                    <select v-model="selectedStatus">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready for pickup">Ready for Pickup</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div class="orders-section">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Order Date</th>
                                <th>Staff Assigned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in filteredOrders" :key="order.order_id">
                                <td>{{ order.order_id }}</td>
                                <td>{{ order.customer_name }}</td>
                                <td>
                                    <span :class="['status-badge', order.status]">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td>₱{{ formatPrice(order.total_amount) }}</td>
                                <td>{{ formatDate(order.created_at) }}</td>
                                <td>
                                    <span v-if="order.staff_name" class="staff-badge">
                                        <i class="fas fa-user"></i> {{ order.staff_name }}
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <button @click="viewOrderDetails(order)" class="view-btn">
                                        <i class="fas fa-eye"></i> View Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Order Details Modal -->
        <div v-if="selectedOrder" class="modal-overlay">
            <div class="modal-content">
                <h2>Order Details</h2>
                <div class="order-info">
                    <p><strong>Order ID:</strong> {{ selectedOrder.order_id }}</p>
                    <p><strong>Customer:</strong> {{ selectedOrder.customer_name }}</p>
                    <p><strong>Status:</strong> 
                        <span :class="['status-badge', selectedOrder.status]">
                            {{ selectedOrder.status }}
                        </span>
                    </p>
                    <p><strong>Order Date:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                    <p v-if="selectedOrder.staff_name">
                        <strong>Staff Assigned:</strong> {{ selectedOrder.staff_name }}
                    </p>
                    <p v-if="selectedOrder.status === 'cancelled'">
                        <strong>Cancellation Reason:</strong> {{ selectedOrder.cancel_reason }}
                    </p>
                </div>

                <div class="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Image</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in selectedOrder.items" :key="item.product_id">
                                <td>{{ item.name }}</td>
                                <td>
                                    <img 
                                        :src="item.image ? `http://localhost:7904/uploads/${item.image}` : '/img/placeholder.jpg'" 
                                        :alt="item.name"
                                        class="product-image"
                                        @error="handleImageError"
                                    >
                                </td>
                                <td>₱{{ formatPrice(item.price) }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>₱{{ formatPrice(item.price * item.quantity) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="total-label">Total Amount:</td>
                                <td class="total-amount">₱{{ formatPrice(selectedOrder.total_amount) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="modal-actions">
                    <button @click="selectedOrder = null" class="close-btn">
                        <i class="fas fa-times"></i> Close
                    </button>
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
    name: 'AllOrders',
    components: {
        AdminNavbar,
        LogoutModal
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            orders: [],
            selectedOrder: null,
            searchQuery: '',
            selectedStatus: ''
        }
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => {
                const matchesSearch = !this.searchQuery || 
                    order.order_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    order.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesStatus = !this.selectedStatus || 
                    order.status.toLowerCase() === this.selectedStatus.toLowerCase();
                
                return matchesSearch && matchesStatus;
            });
        }
    },
    methods: {
        formatPrice(price) {
            return Number(price).toFixed(2);
        },
        formatDate(date) {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        handleImageError(e) {
            e.target.src = '/img/placeholder.jpg';
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
        async fetchOrders() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/admin/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    this.orders = await response.json();
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        },
        async viewOrderDetails(order) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/admin/orders/${order.order_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    this.selectedOrder = await response.json();
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            this.username = decoded.username;
        }
        this.fetchOrders();
    }
}
</script>

<style scoped>
.admin-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-left: 250px;
}

.admin-content {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

h1 {
    color: #1e293b;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.filters-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.search-bar {
    flex: 1;
    min-width: 300px;
    position: relative;
}

.search-bar i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
}

.search-bar input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
}

.status-filter select {
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
    cursor: pointer;
    min-width: 200px;
}

.orders-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #64748b;
}

.status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
}

.pending {
    background-color: #fff3cd;
    color: #856404;
}

.preparing {
    background-color: #cce5ff;
    color: #004085;
}

.ready {
    background-color: #d4edda;
    color: #155724;
}

.paid {
    background-color: #d1e7dd;
    color: #0f5132;
}

.cancelled {
    background-color: #f8d7da;
    color: #842029;
}

.staff-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
}

.view-btn {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.view-btn:hover {
    background-color: #2563eb;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
}

.order-info {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.order-info p {
    margin: 0.5rem 0;
}

.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}

.total-label {
    text-align: right;
    font-weight: 600;
}

.total-amount {
    font-weight: 600;
    color: #1e293b;
}

.modal-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
}

.close-btn {
    padding: 0.75rem 1.5rem;
    background-color: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.close-btn:hover {
    background-color: #4b5563;
}

@media (max-width: 768px) {
    .admin-container {
        padding-left: 0;
    }

    .admin-content {
        padding: 1rem;
    }

    .filters-container {
        flex-direction: column;
    }

    .search-bar, .status-filter select {
        min-width: 100%;
    }

    .modal-content {
        width: 95%;
        padding: 1rem;
    }
}
</style>