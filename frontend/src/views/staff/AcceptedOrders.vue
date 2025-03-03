<template>
    <div class="staff-container">
        <StaffNavbar />
        <div class="staff-content">
            <h1><i class="fas fa-tasks"></i> My Accepted Orders</h1>

            <div class="orders-section">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Accepted On</th>
                                <th>Estimated Ready By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in acceptedOrders" :key="order.order_id">
                                <td>{{ order.order_id }}</td>
                                <td>{{ order.customer_name }}</td>
                                <td>
                                    <select 
                                        v-model="order.status"
                                        @change="updateOrderStatus(order.order_id, order.status)"
                                        :class="['status-select', order.status]"
                                    >
                                        <option value="preparing">Preparing</option>
                                        <option value="ready for pickup">Ready for Pickup</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </td>
                                <td>₱{{ formatPrice(order.total_amount) }}</td>
                                <td>{{ formatDate(order.accepted_at) }}</td>
                                <td class="estimated-time">
                                    {{ formatDate(order.estimatedPickupTime) }}
                                    <div class="time-remaining" :class="{'past-due': isPastDue(order.estimatedPickupTime)}">
                                        {{ getTimeRemaining(order.estimatedPickupTime) }}
                                    </div>
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
            <div class="modal-content order-details">
                <h2>Order Details</h2>
                <div class="order-info">
                    <p><strong>Order ID:</strong> {{ selectedOrder.order_id }}</p>
                    <p><strong>Customer:</strong> {{ selectedOrder.customer_name }}</p>
                    <p><strong>Status:</strong> 
                        <span :class="['status-badge', selectedOrder.status]">
                            {{ selectedOrder.status }}
                        </span>
                    </p>
                    <p><strong>Accepted On:</strong> {{ formatDate(selectedOrder.accepted_at) }}</p>
                    <p><strong>Estimated Ready By:</strong> {{ formatDate(selectedOrder.estimatedPickupTime) }}</p>
                    <p class="time-remaining" :class="{'past-due': isPastDue(selectedOrder.estimatedPickupTime)}">
                        <i class="fas fa-clock"></i> {{ getTimeRemaining(selectedOrder.estimatedPickupTime) }}
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
    </div>
</template>

<script>
import StaffNavbar from '../../components/StaffNavbar.vue'

export default {
    name: 'AcceptedOrders',
    components: {
        StaffNavbar
    },
    data() {
        return {
            acceptedOrders: [],
            selectedOrder: null
        }
    },
    methods: {
        formatPrice(price) {
            return Number(price).toFixed(2)
        },
        formatDate(date) {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        isPastDue(estimatedTime) {
            return new Date(estimatedTime) < new Date()
        },
        getTimeRemaining(estimatedTime) {
            const now = new Date()
            const estimated = new Date(estimatedTime)
            const diff = estimated - now

            if (diff < 0) {
                return 'Past due'
            }

            const minutes = Math.floor(diff / 60000)
            if (minutes < 60) {
                return `${minutes} minutes remaining`
            }

            const hours = Math.floor(minutes / 60)
            const remainingMinutes = minutes % 60
            return `${hours}h ${remainingMinutes}m remaining`
        },
        handleImageError(e) {
            e.target.src = '/img/placeholder.jpg'
        },
        calculateEstimatedTime(order) {
            try {
                const baseTime = 15; // Base preparation time in minutes
                const timePerItem = 5; // Additional time per item in minutes
                
                const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const estimatedMinutes = baseTime + (timePerItem * totalQuantity);
                
                // Use accepted_at as base time
                const estimatedTime = new Date(order.accepted_at);
                estimatedTime.setMinutes(estimatedTime.getMinutes() + estimatedMinutes);
                
                return estimatedTime.toISOString();
            } catch (error) {
                console.error('Error calculating estimated time:', error);
                return null;
            }
        },
        async fetchAcceptedOrders() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/staff/orders/accepted', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const orders = await response.json();
                    // Calculate estimated time for each order
                    this.acceptedOrders = orders.map(order => ({
                        ...order,
                        estimatedPickupTime: this.calculateEstimatedTime(order)
                    }));
                }
            } catch (error) {
                console.error('Error fetching accepted orders:', error);
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
                    const orderData = await response.json();
                    this.selectedOrder = {
                        ...orderData,
                        estimatedPickupTime: this.calculateEstimatedTime(orderData)
                    };
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        },
        async updateOrderStatus(orderId, newStatus) {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`http://localhost:7904/api/staff/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                })

                if (!response.ok) {
                    throw new Error('Failed to update order status')
                }

                await this.fetchAcceptedOrders()
            } catch (error) {
                console.error('Error updating order status:', error)
            }
        }
    },
    mounted() {
        this.fetchAcceptedOrders()
        // Refresh orders every minute to update time remaining
        setInterval(this.fetchAcceptedOrders, 60000)
    }
}
</script>

<style scoped>
.staff-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-left: 250px;
}

.staff-content {
    padding: 2rem;
}

.staff-content h1 {
    color: #2c3e50;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.orders-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1.5rem;
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
    color: #2c3e50;
}

.status-select {
    padding: 0.5rem;
    border-radius: 20px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    width: 150px;
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

.view-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.view-btn:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
}

.estimated-time {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.time-remaining {
    font-size: 0.85rem;
    color: #2e7d32;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.time-remaining.past-due {
    color: #d32f2f;
}

/* Modal Styles */
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
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.order-info {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.order-info p {
    margin: 0.5rem 0;
}

.status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
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
    color: #2c3e50;
}

.modal-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
}

.close-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background-color: #5a6268;
}

@media (max-width: 768px) {
    .staff-container {
        padding-left: 60px;
    }

    .staff-content {
        padding: 1rem;
    }

    .modal-content {
        width: 95%;
        padding: 1rem;
    }

    .status-select {
        width: 120px;
    }
}
</style>