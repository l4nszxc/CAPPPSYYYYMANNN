<template>
    <div class="cart-container">
        <Navbar :username="username" :cart="cart" @logout="showLogoutModal = true"/>
        
        <div class="cart-content">
            
            <div v-if="cart.length > 0" class="cart-items">
                <div v-for="item in cart" :key="item.product_id" class="cart-item">
                    <img :src="item.image ? `http://localhost:7904/uploads/${item.image}` : 'placeholder-image.jpg'"
                        :alt="item.name" 
                        class="cart-item-image"
                        @error="handleImageError">
                    <div class="cart-item-details">
                        <h3>{{ item.name }}</h3>
                        <p class="price">Price: ${{ (item.price || 0).toFixed(2) }}</p>
                        <div class="quantity-controls">
                            <button @click="updateQuantity(item.product_id, item.quantity - 1)" 
                                    :disabled="item.quantity <= 1">-</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="updateQuantity(item.product_id, item.quantity + 1)">+</button>
                        </div>
                        <p class="subtotal">Subtotal: ${{ ((item.price || 0) * item.quantity).toFixed(2) }}</p>
                        <button class="remove-btn" @click="removeFromCart(item.product_id)">Remove</button>
                    </div>
                </div>
                <div class="cart-summary">
                    <h3>Cart Total: ${{ cartTotal.toFixed(2) }}</h3>
                    <button class="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
            <div v-else class="empty-cart">
                <p>Your cart is empty.</p>
                <button class="continue-shopping" @click="$router.push('/products')">
                    Continue Shopping
                </button>
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
    name: 'Cart',
    components: {
        Navbar,
        LogoutModal
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            cart: [],
        };
    },
    computed: {
        cartTotal() {
            return this.cart.reduce((total, item) => {
                const price = parseFloat(item.price) || 0;
                return total + (price * item.quantity);
            }, 0);
        }
    },
    methods: {
        handleImageError(e) {
            e.target.src = 'placeholder-image.jpg'; // Fallback image
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
                } else {
                    console.error('Logout failed');
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
            const response = await fetch('http://localhost:7904/api/cart', { // Updated endpoint
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                this.cart = await response.json();
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            this.cart = [];
        }
    },
    async removeFromCart(productId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:7904/api/cart/${productId}`, { // Updated endpoint
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                await this.fetchCart();
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    },

    async updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:7904/api/cart/${productId}`, { // Updated endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quantity: newQuantity
                })
            });
            
            if (response.ok) {
                await this.fetchCart();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }
    },
    async mounted() {
        await this.getUserData();
        await this.fetchCart();
    }
};
</script>

<style scoped>
.cart-item-image {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 1rem;
}
.cart-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.cart-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cart-item {
    display: flex;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 1rem;
}

.cart-item-details {
    flex-grow: 1;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.quantity-controls button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
}

.remove-btn {
    background-color: #ff4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.cart-summary {
    margin-top: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkout-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    margin-top: 1rem;
}

.empty-cart {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.continue-shopping {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
}
</style>