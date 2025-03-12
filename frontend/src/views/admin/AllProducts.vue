<template>
    <div class="admin-container">
        <AdminNavbar :username="username" @logout="showLogoutModal = true" />
        
        <div class="admin-content">
            <h1><i class="fas fa-box"></i> Manage Products</h1>
            <div class="filters-container">
                <div class="search-filter">
                    <label for="search"><i class="fas fa-search"></i> Search:</label>
                    <input 
                        type="text" 
                        id="search" 
                        v-model="searchQuery" 
                        placeholder="Search by product name..."
                    >
                </div>
                
                <div class="category-filter">
                    <label for="category"><i class="fas fa-filter"></i> Category:</label>
                    <select id="category" v-model="selectedCategory">
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

                <button @click="resetFilters" class="reset-btn">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
            
            <div class="products-section">
                <div class="table-container">
                    <table v-if="products.length">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Total Sold</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in filteredProducts" :key="product.products_id">                                <td>
                                    <img 
                                        :src="product.image ? `http://localhost:7904/uploads/${product.image}` : '/img/placeholder.jpg'"
                                        :alt="product.name"
                                        class="product-image"
                                        @error="handleImageError"
                                    >
                                </td>
                                <td>{{ product.name }}</td>
                                <td>{{ product.category }}</td>
                                <td>₱{{ formatPrice(product.price) }}</td>
                                <td>
                                    <span :class="{'critical-stock': product.stock_quantity <= 5}">
                                        {{ product.stock_quantity }}
                                    </span>
                                </td>
                                    <td>
                                        <span :class="{'highlight-sales': product.total_sold > 0}">
                                            {{ product.total_sold || 0 }}
                                        </span>
                                    </td>                                
                                <td>
                                    <button @click="showEditModal(product)" class="edit-btn">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="no-data">
                        <i class="fas fa-box-open"></i>
                        <p>No products found</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Product Modal -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Edit Product</h2>
                <form @submit.prevent="handleEditSubmit" class="edit-form">
                    <div class="form-group">
                        <label for="name">Product Name</label>
                        <input type="text" id="name" v-model="editingProduct.name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" v-model="editingProduct.description" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="number" id="price" v-model="editingProduct.price" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="stock">Stock Quantity</label>
                        <input type="number" id="stock" v-model="editingProduct.stock_quantity" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" v-model="editingProduct.category" required>
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
                    
                    <div class="form-group">
                        <label for="newImage">New Image (optional)</label>
                        <input type="file" id="newImage" @change="handleImageUpload" accept="image/*">
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" @click="closeModal" class="cancel-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
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
import AdminNavbar from '../../components/AdminNavbar.vue';
import LogoutModal from '../../components/LogoutModal.vue';

export default {
    name: 'AllProducts',
    components: {
        AdminNavbar,
        LogoutModal
    },
    data() {
        return {
            username: '',
            products: [],
            showLogoutModal: false,
            showModal: false,
            editingProduct: null,
            newImage: null,
            searchQuery: '', 
            selectedCategory: '' 
        };
    },
    computed: {
        filteredProducts() {
            return this.products.filter(product => {
                const matchesSearch = !this.searchQuery || 
                    product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = !this.selectedCategory || 
                    product.category === this.selectedCategory;
                
                return matchesSearch && matchesCategory;
            });
        }
    },
    methods: {
        resetFilters() {
            this.searchQuery = '';
            this.selectedCategory = '';
        },
        async fetchProducts() {
            try {
                const response = await fetch('http://localhost:7904/api/products');
                if (response.ok) {
                    const data = await response.json();
                    this.products = data.map(product => ({
                        ...product,
                        total_sold: parseInt(product.total_sold) || 0
                    }));
                    console.log('Products with sales:', this.products); // Debug log
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        formatPrice(price) {
            return Number(price).toFixed(2);
        },
        handleImageError(e) {
            e.target.src = '/img/placeholder.jpg';
        },
        async fetchProducts() {
        try {
            const response = await fetch('http://localhost:7904/api/products');
            if (response.ok) {
                const data = await response.json();
                this.products = data.map(product => ({
                    ...product,
                    total_sold: parseInt(product.total_sold) || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    },
        showEditModal(product) {
            this.editingProduct = { ...product };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.editingProduct = null;
            this.newImage = null;
        },
        handleImageUpload(event) {
            this.newImage = event.target.files[0];
        },
        async handleEditSubmit() {
            try {
                const formData = new FormData();
                Object.keys(this.editingProduct).forEach(key => {
                    formData.append(key, this.editingProduct[key]);
                });
                if (this.newImage) {
                    formData.append('image', this.newImage);
                }

                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/admin/products/${this.editingProduct.products_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    this.closeModal();
                    await this.fetchProducts();
                }
            } catch (error) {
                console.error('Error updating product:', error);
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
            this.username = decoded.username || 'Admin';
        }
        this.fetchProducts();
    }
};
</script>

<style scoped>
.admin-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-left: 250px;
}.highlight-sales {
    color: #047857;
    font-weight: 600;
    background-color: #ecfdf5;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    display: inline-block;
}

.highlight-sales:hover {
    background-color: #d1fae5;
}
.admin-content {
    padding: 2rem;
    margin: 0 auto;
}

h1 {
    color: #1e293b;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.table-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}

.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
}

.critical-stock {
    color: #dc2626;
    font-weight: 600;
    background-color: #fee2e2;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.edit-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.edit-btn:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
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
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.95rem;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.save-btn, .cancel-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    border: none;
}

.save-btn {
    background-color: #10b981;
    color: white;
}

.cancel-btn {
    background-color: #ef4444;
    color: white;
}

.no-data {
    text-align: center;
    padding: 3rem;
    color: #64748b;
}

.no-data i {
    font-size: 3rem;
    margin-bottom: 1rem;
}
.filters-container {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.search-filter, .category-filter {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 200px;
}

.search-filter input, .category-filter select {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    flex: 1;
}

.search-filter label, .category-filter label {
    color: #64748b;
    font-weight: 600;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.reset-btn {
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: all 0.2s;
}

.reset-btn:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
}
@media (max-width: 768px) {
    .admin-container {
        padding-left: 0;
    }

    .admin-content {
        padding: 1rem;
    }

    .modal-content {
        margin: 1rem;
        padding: 1.5rem;
    }
    .filters-container {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .search-filter, .category-filter {
        width: 100%;
    }
}
</style>