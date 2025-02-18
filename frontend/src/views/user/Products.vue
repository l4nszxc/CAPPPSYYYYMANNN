<template>
    <div class="product-container">
        <Navbar :username="username" @logout="showLogoutModal = true" />

        <div class="product-content">
            <h1>Our Products</h1>

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
            </div>

            <div v-if="loading" class="loading-message">Loading products...</div>
            <div v-else class="products-grid">
                <div v-for="product in filteredProducts" :key="product.products_id" class="product-card">
                    <img :src="product.image ? `http://localhost:7904/uploads/${product.image}` : 'placeholder-image.jpg'"
                        alt="Product Image" class="product-image">
                    <div class="product-details">
                        <h3>{{ product.name }}</h3>
                        <p class="product-description">{{ product.description }}</p>
                        <p class="product-price">Price: ${{ product.price }}</p>
                        <p class="product-stock">Stock: {{ product.stock_quantity }}</p>
                        <p class="product-category">Category: {{ product.category }}</p>
                    </div>
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
            </div>
            <div v-if="filteredProducts.length === 0 && !loading" class="no-products-message">No products found matching
                your criteria.</div>
        </div>

        <LogoutModal :show="showLogoutModal" @confirm="handleLogout" @cancel="showLogoutModal = false" />
    </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue';
import LogoutModal from '../../components/LogoutModal.vue';

export default {
    name: 'Products',
    components: {
        Navbar,
        LogoutModal
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
            maxPrice: null
        };
    },
    computed: {
        filteredProducts() {
            let filtered = this.products;

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

            return filtered;
        }
    },
    methods: {
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
        async fetchProducts() {
            this.loading = true;
            try {
                let url = 'http://localhost:7904/api/products';
                if (this.selectedCategory) {
                    url = `http://localhost:7904/api/products/category/${this.selectedCategory}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    this.products = await response.json();
                } else {
                    console.error('Failed to fetch products');
                    this.products = [];
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                this.products = [];
            } finally {
                this.loading = false;
            }
        }
    },
    async mounted() {
        await this.getUserData();
        await this.fetchProducts();
    },
};
</script>

<style scoped>
.product-content {
    max-width: 1200px;
    margin: 0 auto;
}

/* Filters Section */
.filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Reduced gap for better responsiveness */
    margin-bottom: 20px;
    align-items: center;
    background-color: #fff;
    padding: 10px; /* Reduced padding for better responsiveness */
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: space-around; /* Distribute filters evenly */
}

.search-filter,
.price-filter,
.category-filter {
    display: flex;
    align-items: center;
    gap: 5px; /* Reduced gap for better responsiveness */
    margin-bottom: 5px; /* Added margin for better stacking on smaller screens */
}

.search-filter label,
.price-filter label,
.category-filter label {
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
    gap: 3px; /* Reduced gap for better responsiveness */
    font-size: 0.8rem; /* Reduced font size for better responsiveness */
}

.search-filter input,
.price-filter input,
.category-filter select {
    padding: 6px; /* Reduced padding for better responsiveness */
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 0.8rem; /* Reduced font size for better responsiveness */
}

.price-filter input {
    width: 60px; /* Reduced width for better responsiveness */
}

.separator {
    margin: 0 3px; /* Reduced margin for better responsiveness */
    color: #777;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Adjust minmax for smaller cards */
    grid-template-columns: repeat(auto-fit, minmax(150px, calc(100% / 8))); /* Max 8 columns */
    gap: 25px; /* Adjust gap for smaller cards */
    margin-top: 20px;
}

.product-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    overflow: hidden;
    display: flex; /* Use flexbox to align button to the bottom */
    flex-direction: column; /* Stack image, details, and button vertically */
    /* Ensure content doesn't overflow */
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-image {
    width: 100%;
    height: 150px; /* Adjust height for smaller cards */
    object-fit:cover;
    border-bottom: 1px solid #eee;
    /* Visual separation */
}

.product-details {
    padding: 10px; /* Adjust padding for smaller cards */
    flex-grow: 1; /* Allow details to take up remaining space */
}

.product-details h3 {
    margin-top: 0;
    margin-bottom: 5px; /* Adjust margin for smaller cards */
    color: #222;
    /* Darker heading */
    font-size: 1rem; /* Adjust font size for smaller cards */
}

.product-description {
    color: #555;
    /* Muted description */
    margin-bottom: 8px; /* Adjust margin for smaller cards */
    line-height: 1.2; /* Adjust line height for smaller cards */
    font-size: 0.8rem; /* Adjust font size for smaller cards */
}

.product-price {
    color: #27ae60;
    font-weight: bold;
    margin-bottom: 5px; /* Adjust margin for smaller cards */
    font-size: 0.9rem; /* Adjust font size for smaller cards */
}

.product-stock {
    color: #777;
    font-size: 0.7rem; /* Adjust font size for smaller cards */
    margin-bottom: 5px; /* Adjust margin for smaller cards */
}

.product-category {
    color: #888;
    font-size: 0.7rem; /* Adjust font size for smaller cards */
}

.add-to-cart-btn {
    background-color: #3498db;
    color: white;
    padding: 8px 12px; /* Adjust padding for smaller cards */
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem; /* Adjust font size for smaller cards */
    transition: background-color 0.3s ease;
    width: 100%;
    /* Full width button */
    display: block;
    /* Ensures it takes full width */
    text-align: center;
    /* Centers the text */
    margin-top: auto; /* Push button to the bottom */
    /* Adds some space above the button */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.add-to-cart-btn:hover {
    background-color: #2980b9;
}

/* Loading and No Products Messages */
.loading-message {
    text-align: center;
    font-style: italic;
    color: #666;
    padding: 20px;
}

.no-products-message {
    text-align: center;
    color: #e74c3c;
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .filters-container {
        flex-direction: column;
        align-items: stretch;
        /* Full width items */
        padding: 5px; /* Further reduced padding for very small screens */
    }

    .search-filter,
    .price-filter,
    .category-filter {
        width: 100%;
        /* Each filter takes full width */
        margin-bottom: 5px; /* Added margin for better stacking on smaller screens */
    }

    .price-filter {
        flex-direction: row;
        /* Restore row direction */
    }

    .price-filter input {
        width: auto;
        /* Adjust input width */
        flex-grow: 1;
        /* Distribute space evenly */
    }

    .products-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Adjust minmax for smaller cards */
    }
}
</style>