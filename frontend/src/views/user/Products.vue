<template>
    <div class="product-container">
        <Navbar :username="username" @logout="showLogoutModal = true" />

        <div class="product-content">
            <h1>Our Products</h1>
            <div class="search-filter">
                <label for="search">Search by Name:</label>
                <input type="text" id="search" v-model="searchQuery" @input="fetchProducts" placeholder="Enter product name" />

                <label for="minPrice">Min Price:</label>
                <input type="number" id="minPrice" v-model="minPrice" @input="fetchProducts" placeholder="Min price" />

                <label for="maxPrice">Max Price:</label>
                <input type="number" id="maxPrice" v-model="maxPrice" @input="fetchProducts" placeholder="Max price" />
            </div>
            <div class="category-filter">
                <label for="category">Filter by Category:</label>
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

            <div v-if="loading" class="loading-message">Loading products...</div>
            <div v-else class="products-grid">
                <div v-for="product in filteredProducts" :key="product.products_id" class="product-card">
                    <img :src="product.image ? `http://localhost:7904/uploads/${product.image}` : 'placeholder-image.jpg'"
                        alt="Product Image" class="product-image">
                    <h3>{{ product.name }}</h3>
                    <p class="product-description">{{ product.description }}</p>
                    <p class="product-price">Price: ${{ product.price }}</p>
                    <p class="product-stock">Stock: {{ product.stock_quantity }}</p>
                    <p class="product-category">Category: {{ product.category }}</p>
                </div>
            </div>
            <div v-if="filteredProducts.length === 0 && !loading" class="no-products-message">No products found matching your criteria.</div>
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
.product-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
}

.product-content {
    max-width: 1200px;
    margin: 0 auto;
}

.search-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
}

.search-filter label {
    font-weight: bold;
}

.search-filter input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.product-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}

.product-price {
    color: #27ae60;
    font-weight: bold;
}

.category-filter {
    margin-bottom: 20px;
}

.category-filter label {
    margin-right: 10px;
    font-weight: bold;
}

.category-filter select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.loading-message {
    text-align: center;
    font-style: italic;
    color: #666;
}

.no-products-message {
    text-align: center;
    color: #e74c3c;
    margin-top: 20px;
}
</style>