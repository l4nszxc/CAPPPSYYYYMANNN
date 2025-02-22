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

        <!-- Order Details Modal -->
        <div v-if="selectedOrder" class="modal-overlay">
            <div class="modal-content order-details">
                <h2>Order Details</h2>
                <div class="order-info">
                    <p><strong>Order ID:</strong> {{ selectedOrder.order_id }}</p>
                    <p><strong>Customer:</strong> {{ selectedOrder.customer_name }}</p>
                    <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
                    <p><strong>Date:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                </div>
                <div class="order-items">
                    <h3>Items</h3>
                    <div v-for="item in selectedOrder.items" :key="item.product_id" class="order-item">
                        <img :src="item.image" :alt="item.name" class="item-image">
                        <div class="item-details">
                            <h4>{{ item.name }}</h4>
                            <p>Quantity: {{ item.quantity }}</p>
                            <p>Price: ₱{{ formatPrice(item.price) }}</p>
                        </div>
                    </div>
                </div>
                <div class="order-total">
                    <p><strong>Total Amount:</strong> ₱{{ formatPrice(selectedOrder.total_amount) }}</p>
                </div>
                <button @click="selectedOrder = null" class="close-btn">Close</button>
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
        viewOrderDetails(order) {
            this.selectedOrder = order;
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
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.close-btn:hover {
    background-color: #5a6268;
}
</style>