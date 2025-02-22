<template>
    <div class="view-order-container">
        <Navbar 
        :username="username"
        @logout="showLogoutModal = true"
      />    

        <div class="view-order-content">
            <h1><i class="fas fa-truck-loading"></i> Track Orders</h1>
            
            <div class="active-orders">
                <div v-if="activeOrders.length > 0">
                    <div v-for="order in activeOrders" :key="order.order_id" class="order-card">
                        <div class="order-header">
                            <div class="order-info">
                                <h3>Order #{{ order.order_id }}</h3>
                                <span :class="['status-badge', order.status.toLowerCase()]">
                                    {{ order.status }}
                                </span>
                            </div>
                            <p class="order-date">{{ formatDate(order.created_at) }}</p>
                        </div>

                        <div class="order-items">
                            <div v-for="item in order.items" :key="item.product_id" class="order-item">
                                <img :src="item.image ? `http://localhost:7904/uploads/${item.image}` : '/img/placeholder.jpg'"
                                    :alt="item.name" 
                                    class="item-image"
                                    @error="handleImageError">
                                <div class="item-details">
                                    <h4>{{ item.name }}</h4>
                                    <p class="item-price">₱{{ item.price }} x {{ item.quantity }}</p>
                                    <p class="item-subtotal">Subtotal: ₱{{ (item.price * item.quantity).toFixed(2) }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="order-footer">
                            <div class="total-amount">
                                <p>Total Amount: ₱{{ order.total_amount.toFixed(2) }}</p>
                            </div>
                            <button 
                                v-if="order.status === 'pending'"
                                @click="showCancelModal(order)" 
                                class="cancel-btn"
                            >
                                <i class="fas fa-times"></i> Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="no-orders">
                    <i class="fas fa-box-open"></i>
                    <p>No active orders found</p>
                    <router-link to="/products" class="shop-now-btn">
                        <i class="fas fa-shopping-cart"></i> Shop Now
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Cancel Order Modal -->
        <div v-if="showCancelOrderModal" class="modal-overlay">
            <div class="modal-content">
                <h3>Cancel Order</h3>
                <p>Are you sure you want to cancel this order?</p>
                <div class="cancel-reason">
                    <label for="cancelReason">Please provide a reason:</label>
                    <select v-model="cancelReason" id="cancelReason" required>
                        <option value="">Select a reason</option>
                        <option value="Changed my mind">Changed my mind</option>
                        <option value="Ordered by mistake">Ordered by mistake</option>
                        <option value="Found better price elsewhere">Found better price elsewhere</option>
                        <option value="Other">Other</option>
                    </select>
                    <textarea 
                        v-if="cancelReason === 'Other'"
                        v-model="otherReason"
                        placeholder="Please specify your reason"
                        rows="3"
                    ></textarea>
                </div>
                <div class="modal-buttons">
                    <button 
                        @click="confirmCancelOrder" 
                        class="confirm-btn"
                        :disabled="!cancelReason"
                    >
                        Confirm Cancel
                    </button>
                    <button @click="closeCancelModal" class="close-btn">
                        Close
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
import Navbar from '../../components/Navbar.vue';
import LogoutModal from '../../components/LogoutModal.vue';

export default {
    name: 'ViewOrder',
    components: {
        Navbar,
        LogoutModal
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            orders: [],
            showCancelOrderModal: false,
            selectedOrder: null,
            cancelReason: '',
            otherReason: ''
        }
    },
    computed: {
        activeOrders() {
            return this.orders.filter(order => 
                ['pending', 'preparing', 'ready for pickup'].includes(order.status.toLowerCase())
            );
        }
    },
    methods: {
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
        showCancelModal(order) {
            this.selectedOrder = order;
            this.showCancelOrderModal = true;
            this.cancelReason = '';
            this.otherReason = '';
        },
        closeCancelModal() {
            this.showCancelOrderModal = false;
            this.selectedOrder = null;
            this.cancelReason = '';
            this.otherReason = '';
        },
        async confirmCancelOrder() {
            if (!this.cancelReason) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/orders/${this.selectedOrder.order_id}/cancel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reason: this.cancelReason === 'Other' ? this.otherReason : this.cancelReason
                    })
                });

                if (response.ok) {
                    await this.fetchOrders();
                    this.closeCancelModal();
                }
            } catch (error) {
                console.error('Error canceling order:', error);
            }
        },
        async fetchOrders() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/orders/user', {
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
        async getUserData() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                // Get username from token
                const decoded = JSON.parse(atob(token.split('.')[1]));
                this.username = decoded.username;
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        }
    },
    mounted() {
        this.getUserData();
        this.fetchOrders();
    }
}
</script>

<style scoped>
.view-order-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.view-order-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.view-order-content h1 {
    color: #2c3e50;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.order-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.order-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.order-info h3 {
    margin: 0;
    color: #2c3e50;
}

.status-badge {
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

.order-date {
    color: #666;
    margin: 0;
}

.order-items {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.order-item {
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
}

.item-details {
    flex-grow: 1;
}

.item-details h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
}

.total-amount {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
}

.cancel-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.cancel-btn:hover {
    background-color: #c82333;
    transform: translateY(-1px);
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
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
}

.cancel-reason {
    margin: 1.5rem 0;
}

.cancel-reason label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.cancel-reason select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.cancel-reason textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    resize: vertical;
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.confirm-btn, .close-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    border: none;
    transition: all 0.3s ease;
}

.confirm-btn {
    background-color: #dc3545;
    color: white;
}

.confirm-btn:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.close-btn {
    background-color: #6c757d;
    color: white;
}

.no-orders {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-orders i {
    font-size: 4rem;
    color: #cbd5e0;
    margin-bottom: 1rem;
}

.no-orders p {
    color: #2c3e50;
    font-size: 1.25rem;
    margin-bottom: 2rem;
}

.shop-now-btn {
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.shop-now-btn:hover {
    background-color: #45a049;
    transform: translateY(-1px);
}
</style>