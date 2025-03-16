<template>
    <div class="cart-container">
        <Navbar :username="username" @logout="showLogoutModal = true"/>
        
        <div class="cart-content">
            <div class="cart-header">
                <h1><i class="fas fa-shopping-cart"></i> Shopping Cart</h1>
            </div>
            
            <div v-if="cartItems.length > 0" class="select-all-container">
                <div class="select-all-checkbox">
                    <label>
                        <input 
                            type="checkbox" 
                            :checked="allItemsSelected"
                            @change="toggleSelectAll"
                            id="select-all"
                        >
                        <span class="checkbox-label">Select All</span>
                    </label>
                </div>
            </div>

            <div v-if="cartItems.length > 0" class="cart-items">
                <div v-for="item in cartItems" :key="item.id" class="cart-item">
                    <div class="cart-item-checkbox">
                        <input 
                            type="checkbox" 
                            :checked="checkedItems.has(item.id)"
                            @change="toggleItemCheck(item.id)"
                        >
                    </div>
                    <img 
                        :src="item.image || '/img/placeholder.jpg'"
                        :alt="item.name"
                        class="cart-item-image"
                        @error="handleImageError"
                    >
                    <div class="cart-item-details">
                        <h3><i class="fas fa-box"></i> {{ item.name }}</h3>
                        <p v-if="item.choice_name" class="choice-info">
                            <i class="fas fa-tag"></i> Option: {{ item.choice_name }}
                        </p>
                        <p class="price"><i class="fas fa-tag"></i> Price: ₱{{ (item.price || 0).toFixed(2) }}</p>
                        <div class="quantity-controls">
                            <span class="quantity-label"><i class="fas fa-cubes"></i> Quantity:</span>
                            <button @click="updateQuantity(item.id, item.quantity - 1)" 
                                    :disabled="item.quantity <= 1"
                                    class="quantity-btn">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-value">{{ item.quantity }}</span>
                            <button @click="updateQuantity(item.id, item.quantity + 1)"
                                    class="quantity-btn">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <p class="subtotal"><i class="fas fa-calculator"></i> Subtotal: ₱{{ ((item.price || 0) * item.quantity).toFixed(2) }}</p>
                        <button class="remove-btn" @click="removeFromCart(item.id)">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
                <div class="cart-summary">
                    <h3><i class="fas fa-receipt"></i> Cart Summary</h3>
                    <div class="summary-details">
                        <p class="total-items">
                            <i class="fas fa-shopping-basket"></i> Selected Items: {{ checkedItemsCount }}
                        </p>
                        <p class="total-amount">
                            <i class="fas fa-dollar-sign"></i> Total Amount: ₱{{ cartTotal.toFixed(2) }}
                        </p>
                    </div>
                    <div class="cart-actions">
                        <div v-if="availableDiscounts.length" class="discount-section mb-4">
                            <h3 class="text-lg font-semibold mb-2">Available Discounts</h3>
                            <select v-model="selectedDiscountId" class="w-full p-2 border rounded">
                                <option value="">No discount</option>
                                <option v-for="discount in availableDiscounts" 
                                        :key="discount.id" 
                                        :value="discount.id">
                                    ₱{{ discount.amount }} off
                                </option>
                            </select>
                        </div>
                        <button 
                            class="checkout-btn" 
                            @click="showOrdersModal = true" 
                            :disabled="checkedItemsCount === 0"
                        >
                            <i class="fas fa-credit-card"></i> Place Order
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="empty-cart">
                <i class="fas fa-shopping-cart empty-cart-icon"></i>
                <p>Your cart is empty</p>
                <button class="continue-shopping" @click="$router.push('/products')">
                    <i class="fas fa-store"></i> Continue Shopping
                </button>
            </div>
        </div>

        <LogoutModal 
            :show="showLogoutModal" 
            @confirm="handleLogout" 
            @cancel="showLogoutModal = false" 
        />

        <ViewOrdersModal 
            :show="showOrdersModal"
            :selectedItems="selectedItems"
            :availableDiscounts="availableDiscounts"
            @close="showOrdersModal = false"
            @place-order="handlePlaceOrder"
        />
    </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue';
import LogoutModal from '../../components/LogoutModal.vue';
import ViewOrdersModal from '../../components/ViewOrdersModal.vue';

export default {
    name: 'Cart',
    components: {
        Navbar,
        LogoutModal,
        ViewOrdersModal
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            showOrdersModal: false,
            cartItems: [],
            checkedItems: new Set(),
            availableDiscounts: [],
            selectedDiscountId: null,
            loading: false,
            error: null
        };
    },
    computed: {
        allItemsSelected() {
            return this.cartItems.length > 0 && this.checkedItems.size === this.cartItems.length;
        },
        selectedItems() {
            return this.cartItems.filter(item => this.checkedItems.has(item.id));
        },
        cartTotal() {
            let total = this.cartItems.reduce((sum, item) => {
                if (this.checkedItems.has(item.id)) {
                    return sum + (parseFloat(item.price) * item.quantity);
                }
                return sum;
            }, 0);

            // Apply selected discount if any
            if (this.selectedDiscountId && this.availableDiscounts.length > 0) {
                const selectedDiscount = this.availableDiscounts.find(d => d.id === this.selectedDiscountId);
                if (selectedDiscount) {
                    total = Math.max(0, total - selectedDiscount.amount);
                }
            }

            return total;
        },
        checkedItemsCount() {
            return this.checkedItems.size;
        }
    },
    methods: {
        async fetchAvailableDiscounts() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/rewards/available-discounts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.availableDiscounts = data;
                }
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        },
        toggleSelectAll() {
            if (this.allItemsSelected) {
                this.checkedItems.clear();
            } else {
                this.cartItems.forEach(item => {
                    this.checkedItems.add(item.id);
                });
            }
        },
        handleCartUpdate() {
            this.fetchCart(); // Refresh cart when updated
        },
        toggleItemCheck(itemId) {
            if (this.checkedItems.has(itemId)) {
                this.checkedItems.delete(itemId);
            } else {
                this.checkedItems.add(itemId);
            }
        },
        async handlePlaceOrder({ items, discountId }) {
            try {
                const token = localStorage.getItem('token');
                
                const requestBody = {
                    items: items,
                    totalAmount: items.reduce((sum, item) => 
                        sum + (parseFloat(item.price) * item.quantity), 0
                    ),
                    discountId: discountId
                };

                const response = await fetch('http://localhost:7904/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error('Failed to place order');
                }

                const { orderId, finalAmount, appliedDiscount, pointsEarned } = await response.json();

                // Clear selected items
                for (const item of items) {
                    await this.removeFromCart(item.id);
                }

                this.checkedItems.clear();
                await this.fetchCart();
                await this.fetchAvailableDiscounts();

                this.showOrdersModal = false;
                this.$router.push('/view-orders');

            } catch (error) {
                console.error('Error placing order:', error);
                alert('Failed to place order');
            }
        },
        
        handleImageError(e) {
            e.target.src = 'placeholder-image.jpg'; // Fallback image
        },
        async handleLogout() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/users/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                } else {
                    throw new Error('Logout failed');
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
        async fetchCart() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const response = await fetch('http://localhost:7904/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart');
                }

                const data = await response.json();
                this.cartItems = data;
            } catch (error) {
                console.error('Error fetching cart:', error);
                this.cartItems = [];
            }
        },
        async removeFromCart(itemId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/cart/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
                    this.checkedItems.delete(itemId);
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                }
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        },

        async updateQuantity(itemId, newQuantity) {
            if (newQuantity < 1) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/cart/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });
                
                if (response.ok) {
                    await this.fetchCart(); // Refresh cart after update
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        }
    },
    async mounted() {
        await this.getUserData();
        await this.fetchCart();
        await this.fetchAvailableDiscounts();
    }
};
</script>

<style scoped>
.cart-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.cart-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.cart-header {
    margin-bottom: 2rem;
}

.cart-header h1 {
    color: #2c3e50;
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cart-item {
    display: flex;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.cart-item:hover {
    transform: translateY(-2px);
}

.cart-item-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-details {
    flex-grow: 1;
}

.cart-item-details h3 {
    font-size: 1.25rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price, .subtotal {
    font-size: 1.1rem;
    color: #2c3e50;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.quantity-label {
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #4CAF50;
    color: #4CAF50;
}

.quantity-value {
    font-size: 1.1rem;
    min-width: 2rem;
    text-align: center;
}

.remove-btn {
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

.remove-btn:hover {
    background-color: #c82333;
    transform: translateY(-1px);
}

.cart-summary {
    margin-top: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cart-summary h3 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.summary-details {
    margin-bottom: 1.5rem;
}

.summary-details p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: #2c3e50;
}

.checkout-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.checkout-btn:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.empty-cart {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-cart-icon {
    font-size: 4rem;
    color: #cbd5e0;
    margin-bottom: 1rem;
}

.empty-cart p {
    color: #2c3e50;
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
}

.continue-shopping {
    background-color: #4CAF50;
    color: white;
    border: 2px solid transparent;
    padding: 1rem 2rem;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 auto;
    box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
    transition: all 0.3s ease;
}

.continue-shopping:hover {
    background-color: white;
    color: #4CAF50;
    border: 2px solid #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}
.cart-item-checkbox {
    display: flex;
    align-items: center;
    margin-right: 1rem;
}
.cart-item-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}
.checkout-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
.checkout-btn:disabled:hover {
    background-color: #cccccc;
    transform: none;
    box-shadow: none;
}
.cart-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.view-orders-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.view-orders-btn:hover:not(:disabled) {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2);
}

.view-orders-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.cart-actions button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
.select-all-container {
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}

.select-all-checkbox {
    display: flex;
    align-items: center;
}

.select-all-checkbox label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    color: #2c3e50;
    font-size: 1rem;
}

.select-all-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.checkbox-label {
    user-select: none;
}
@media (max-width: 768px) {
    .cart-item {
        flex-direction: column;
    }

    .cart-item-image {
        width: 100%;
        margin-right: 0;
        margin-bottom: 1rem;
    }

    .quantity-controls {
        justify-content: center;
    }
}
.choice-info {
    font-size: 0.95rem;
    color: #3498db;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #eef6fd;
    padding: 0.5rem;
    border-radius: 4px;
    width: fit-content;
}
</style>