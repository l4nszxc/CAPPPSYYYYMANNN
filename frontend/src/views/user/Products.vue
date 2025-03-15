<template>
    <div class="product-container">
        <Navbar :username="username" @logout="showLogoutModal = true" />
        
        <div class="product-content">

            <div class="filters-container">
                <div class="search-filter">
                    <label for="search"><i class="fas fa-search"></i> Search by Name:</label>
                    <input type="text" id="search" v-model="searchQuery" @input="fetchProducts"
                        placeholder="Enter product name" />
                </div>

                <div class="price-filter">
                    <label for="minPrice"><i class="fas fa-dollar-sign"></i> Price Range:</label>
                    <input type="number" id="minPrice" v-model="minPrice" @input="fetchProducts" placeholder="Min" />
                    <span class="separator">-</span>
                    <input type="number" id="maxPrice" v-model="maxPrice" @input="fetchProducts" placeholder="Max" />
                </div>

                <div class="category-filter">
                    <label for="category"><i class="fas fa-filter"></i> Category:</label>
                    <select id="category" v-model="selectedCategory" @change="fetchProducts">
                        <option value="">All Categories</option>
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
                <button @click="resetFilters" class="reset-filter-btn"><i class="fas fa-undo"></i> Reset Filters</button>
            </div>

            <div v-if="loading" class="loading-message">
                <i class="fas fa-spinner fa-spin"></i> Loading products...
            </div>
            <div v-else class="products-grid">
                <div v-for="product in filteredProducts" :key="product.products_id" class="product-card">
                    <div class="product-image-container">
                        <img 
                            :src="product.image || '/img/placeholder.jpg'"
                            :alt="product.name" 
                            class="product-image"
                            @error="handleImageError"
                        >
                        <span class="sold-badge" v-if="parseInt(product.total_sold) > 0">
                            <i class="fas fa-fire"></i> {{ parseInt(product.total_sold) }} sold
                        </span>
                    </div>
                    <div class="product-details">
                        <h3>{{ product.name }}</h3>
                        <p class="product-description">{{ product.description }}</p>
                        <div class="product-info">
                            <p class="product-price">₱{{ formatPrice(product.price) }}</p>
                            <p class="product-stock" :class="{ 'low-stock': product.stock_quantity <= 10 }">
                                <i class="fas fa-box"></i> 
                                {{ product.stock_quantity }} in stock
                            </p>
                        </div>
                        <p class="product-category">
                            <i class="fas fa-tag"></i> {{ product.category }}
                            <span v-if="product.total_sold && product.total_sold > 0" class="total-sold">
                                <i class="fas fa-fire"></i> {{ product.total_sold }} sold
                            </span>
                        </p>
                    </div>
                    <button 
                        class="add-to-cart-btn" 
                        @click="showQuantityModal(product)"
                        :disabled="product.stock_quantity === 0"
                    >
                        <i class="fas fa-shopping-cart"></i> 
                        {{ product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
                    </button>
                </div>
            </div>
            <div v-if="filteredProducts.length === 0 && !loading" class="no-products-message">
                <i class="fas fa-box-open"></i>
                No products found matching your criteria.
            </div>
        </div>

        <LogoutModal :show="showLogoutModal" @confirm="handleLogout" @cancel="showLogoutModal = false" />
        <QuantityModal 
            :show="showModal" 
            :productStock="selectedProduct ? selectedProduct.stock_quantity : 0"
            :product="selectedProduct"
            @confirm="confirmAddToCart" 
            @cancel="cancelAddToCart" 
        />
    </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue';
import LogoutModal from '../../components/LogoutModal.vue';
import QuantityModal from '../../components/QuantityModal.vue';

export default {
    name: 'Products',
    components: {
        Navbar,
        LogoutModal,
        QuantityModal
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            products: [],
            loading: false,
            selectedCategory: '',
            searchQuery: '',
            minPrice: null,
            maxPrice: null,
            cart: [],
            showModal: false,
            selectedProduct: null
        };
    },
    computed: {
        filteredProducts() {
            let filtered = this.products.map(product => ({
                ...product,
                total_sold: parseInt(product.total_sold) || 0
            }));

            if (this.searchQuery) {
                const searchTerm = this.searchQuery.toLowerCase();
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(searchTerm)
                );
            }

            if (this.minPrice !== null) {
                filtered = filtered.filter(product => product.price >= this.minPrice);
            }

            if (this.maxPrice !== null) {
                filtered = filtered.filter(product => product.price <= this.maxPrice);
            }

            return filtered; // Removed console.log
        }
    },
    methods: {
        handleImageError(e) {
        e.target.src = '/img/placeholder.jpg'
        },
        formatPrice(price) {
        return Number(price).toFixed(2);
        },
        showQuantityModal(product) {
            this.selectedProduct = product;
            this.showModal = true;
        },
        cancelAddToCart() {
            this.showModal = false;
            this.selectedProduct = null;
        },
        async confirmAddToCart(data) {
            if (!this.selectedProduct) return;
            
            try {
                const token = localStorage.getItem('token');
                const payload = {
                    productId: this.selectedProduct.products_id,
                    quantity: data.quantity
                };
                
                // Add choice_id if a choice was selected
                if (data.choice && data.choice.choice_id) {
                    payload.choiceId = data.choice.choice_id;
                }
                
                const response = await fetch('http://localhost:7904/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log('Product added to cart successfully');
                    await this.fetchCart();
                    window.location.reload();
                } else {
                    const error = await response.json();
                    console.error('Failed to add product:', error);
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
            } finally {
                this.showModal = false;
                this.selectedProduct = null;
            }
        },
    async fetchCart() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:7904/api/cart', {  // Updated endpoint
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                this.cart = await response.json();
            } else {
                console.error('Failed to fetch cart');
                this.cart = [];
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            this.cart = [];
        }
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
        async fetchProducts() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token');
                let url = 'http://localhost:7904/api/products';
                if (this.selectedCategory) {
                    url = `http://localhost:7904/api/products/category/${this.selectedCategory}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.products = data.map(product => ({
                        ...product,
                        total_sold: parseInt(product.total_sold) || 0
                    }));
                } else {
                    if (response.status === 401) {
                        // Handle unauthorized access
                        this.$router.push('/login');
                    }
                    this.products = [];
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                this.products = [];
            } finally {
                this.loading = false;
            }
        },
        resetFilters() {
            this.searchQuery = '';
            this.minPrice = null;
            this.maxPrice = null;
            this.selectedCategory = '';
            this.fetchProducts(); // Refresh products after resetting filters
        }
    },
    async mounted() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.$router.push('/login');
            return;
        }
        
        try {
            await this.getUserData();
            await this.fetchProducts();
            await this.fetchCart();
        } catch (error) {
            console.error('Error in mounted:', error);
            if (error.response?.status === 401) {
                this.$router.push('/login');
            }
        }
    }
};
</script>

<style scoped>
.product-container {
    
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
}
.product-content {
    margin: 0 auto;
    padding: 2rem;
}

.product-content h1 {
    color: #1e293b;
    font-size: 2rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

/* Filters Section */
.filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
}

.search-filter,
.price-filter,
.category-filter {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
    flex: 1;
    min-width: 200px;
}

.search-filter label,
.price-filter label,
.category-filter label {
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.8rem;
    white-space: nowrap;
}

.search-filter input,
.price-filter input,
.category-filter select {
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 0.8rem;
    flex: 1;
}

.search-filter input::placeholder {
    color: #aaa;
}

.price-filter input {
    width: 60px;
}

.separator {
    margin: 0 3px;
    color: #777;
}

.reset-filter-btn {
    background-color: #f44336;
    color: white;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.3s ease;
    white-space: nowrap;
}

.reset-filter-btn:hover {
    background-color: #d32f2f;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Reduced from 280px */
    gap: 1.5rem; /* Reduced from 2rem */
    margin-top: 1.5rem; /* Reduced from 2rem */
}

.product-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.product-image-container {
    position: relative;
    width: 100%;
    height: 160px; /* Reduced from 200px */
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}
.product-card:hover .product-image {
    transform: scale(1.05);
}
.product-details {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.sold-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(239, 68, 68, 0.9);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    z-index: 10; /* Increased z-index */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    font-weight: 600; /* Made text bolder */
}

.sold-badge i {
    font-size: 0.7rem;
}
.product-details h3 {
    margin: 0;
    color: #1e293b;
    font-size: 1rem;
    font-weight: 600;
}

.product-description {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0.5rem 0;
    flex-grow: 1;
}

.product-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
}
.product-price {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.product-stock {
    color: #22c55e;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
}
.low-stock {
    color: #f59e0b;
}
.product-category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #64748b;
    font-size: 0.85rem;
    margin: 0;
    padding: 0.5rem 0;
}

.add-to-cart-btn {
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
    justify-content: center;
    gap: 0.75rem;
    margin: 1rem;
    width: calc(100% - 2rem);
    box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
    transition: all 0.3s ease;
}
.add-to-cart-btn:hover:not(:disabled) {
    background-color: white;
    color: #4CAF50;
    border: 2px solid #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

.add-to-cart-btn:disabled {
    background-color: #cccccc;
    border: 2px solid transparent;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.add-to-cart-btn i {
    font-size: 0.9em;
    line-height: 1;
}
.total-sold {
    margin-left: auto;
    color: #ef4444;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 500;
}
/* Loading and No Products Messages */
.loading-message {
    text-align: center;
    color: #64748b;
    padding: 3rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.no-products-message {
    text-align: center;
    color: #64748b;
    padding: 3rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.1rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .product-content {
        padding: 1.5rem;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .product-content {
        padding: 1rem;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .product-image-container {
        height: 180px;
    }

    .product-details {
        padding: 1rem;
    }

    .product-price {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .product-content h1 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .products-grid {
        grid-template-columns: 1fr;
    }
}
</style>