<template>
    <div class="staff-container">
        <nav class="staff-navbar">
            <div class="nav-brand">
                <h1>Staff Dashboard</h1>
            </div>
            <div class="nav-menu">
                <span class="staff-name">Welcome, {{ username }}</span>
                <button @click="showLogoutModal = true" class="logout-btn">
                    Logout
                </button>
            </div>
        </nav>

        <div class="staff-content">
            <div class="orders-section">
                <h2>Manage Orders</h2>
                
                <div class="filters">
                    <div class="search-box">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            placeholder="Search by order ID or customer name..."
                        >
                    </div>
                    <select v-model="statusFilter" class="status-filter">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready for pickup">Ready for Pickup</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Order Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in filteredOrders" :key="order.order_id">
                                <td>{{ order.order_id }}</td>
                                <td>{{ order.customer_name }}</td>
                                <td>
                                    <select 
                                        v-model="order.status"
                                        @change="updateOrderStatus(order.order_id, order.status)"
                                        :class="['status-select', order.status]"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="ready for pickup">Ready for Pickup</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </td>
                                <td>₱{{ formatPrice(order.total_amount) }}</td>
                                <td>{{ formatDate(order.created_at) }}</td>
                                <td>
                                    <button 
                                        @click="viewOrderDetails(order)"
                                        class="view-btn"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-if="selectedOrder" class="modal-overlay">
            <div class="modal-content order-details">
                <h2>Order Details</h2>
                <div class="order-info">
                    <p><strong>Order ID:</strong> {{ selectedOrder.order_id }}</p>
                    <p><strong>Customer:</strong> {{ selectedOrder.customer_name }}</p>
                    <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
                    <p><strong>Date:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
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
                    <button @click="selectedOrder = null" class="close-btn">Close</button>
                </div>
            </div>
        </div>

        <!-- Logout Modal -->
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
export default {
    name: 'StaffHome',
    data() {
        return {
            username: '',
            showLogoutModal: false,
            orders: [],
            searchQuery: '',
            statusFilter: 'all',
            selectedOrder: null
        }
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => {
                const searchMatch = !this.searchQuery || 
                    order.order_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    order.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase());
                
                const statusMatch = this.statusFilter === 'all' || 
                    order.status === this.statusFilter;
                
                return searchMatch && statusMatch;
            });
        }
    },
    methods: {
        handleImageError(e) {
            e.target.src = '/img/placeholder.jpg';
        },
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
        async fetchOrders() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/staff/orders', {
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
        async updateOrderStatus(orderId, newStatus) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/staff/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    throw new Error('Failed to update order status');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                this.fetchOrders();
            }
        },
        async viewOrderDetails(order) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/staff/orders/${order.order_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const details = await response.json();
                    this.selectedOrder = details;
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
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
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            this.username = decoded.username || 'Staff';
        }
        this.fetchOrders();
    }
}
</script>

<style scoped>
.staff-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.staff-navbar {
    background-color: #3498db;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand h1 {
    margin: 0;
    font-size: 1.5rem;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.staff-name {
    font-weight: 500;
}

.logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.logout-btn:hover {
    background-color: #c0392b;
}

.staff-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

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
    border-radius: 8px;
    padding: 2rem;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
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
.orders-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: 2rem;
}

.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.search-box input,
.status-filter {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
}

.search-box input {
    width: 300px;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
}

.status-select {
    padding: 0.4rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 0.9rem;
}

.status-select.pending {
    background-color: #fff3cd;
    color: #856404;
}

.status-select.preparing {
    background-color: #cce5ff;
    color: #004085;
}

.status-select.ready {
    background-color: #d4edda;
    color: #155724;
}

.status-select.paid {
    background-color: #d1e7dd;
    color: #0f5132;
}

.view-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
}

.view-btn:hover {
    background-color: #45a049;
}

.order-details {
    max-width: 600px !important;
}

.order-info {
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 4px;
}

.order-items {
    margin: 1rem 0;
}

.order-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

.item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.item-details {
    flex: 1;
}

.item-details h4 {
    margin: 0 0 0.5rem 0;
}

.order-total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.close-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: #5a6268;
}
.products-table {
    margin: 1.5rem 0;
    overflow-x: auto;
    max-height: 400px;
}

.products-table table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.products-table th,
.products-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.products-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
}
.total-label {
    text-align: right;
    font-weight: bold;
}
.modal-content.order-details {
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}
.total-amount {
    font-weight: bold;
}

.modal-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
}
</style>