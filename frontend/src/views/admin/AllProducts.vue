<template>
    <div class="admin-container">
        <AdminNavbar :username="username" @logout="showLogoutModal = true" />
        
        <div class="admin-content">
            <div class="header">
                <h2>MANAGE  PRODUCTS</h2>
                <div class="filters">
                    <div class="search-box">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            placeholder="Search by product name..."
                        >
                    </div>
                    <select v-model="selectedCategory" class="status-filter">
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
                    <button @click="resetFilters" class="reset-btn">
                        <i class="fas fa-undo"></i> Reset Filters
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table v-if="filteredProducts.length">
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
                        <tr v-for="product in filteredProducts" :key="product.products_id">
                            <td>
                                <img 
                                    :src="product.image || '/img/placeholder.jpg'"
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
                                <button @click="showDeleteConfirmation(product)" class="delete-btn">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-results">
                    <i class="fas fa-box-open"></i>
                    No products found
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
        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content delete-modal">
                <h2>Delete Product</h2>
                <p>Are you sure you want to delete "{{ productToDelete?.name }}"?</p>
                <div class="modal-buttons">
                    <button @click="confirmDelete" class="confirm-delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button @click="closeDeleteModal" class="cancel-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
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
            selectedCategory: '' ,
            showDeleteModal: false,
            productToDelete: null,
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
        showDeleteConfirmation(product) {
            this.productToDelete = product;
            this.showDeleteModal = true;
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
            this.productToDelete = null;
        },

        async confirmDelete() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:7904/api/admin/products/${this.productToDelete.products_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                // Remove product from local array
                this.products = this.products.filter(p => p.products_id !== this.productToDelete.products_id);
                
                // Close modal and clear selection
                this.closeDeleteModal();

            } catch (error) {
                console.error('Error deleting product:', error);
                // You could add error notification here
            }
        },
        resetFilters() {
            this.searchQuery = '';
            this.selectedCategory = '';
        },
        async fetchProducts() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/products', {
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
                    console.error('Failed to fetch products:', response.status);
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
                const token = localStorage.getItem('token');
                
                // Create FormData for the request
                const formData = new FormData();
                formData.append('name', this.editingProduct.name);
                formData.append('description', this.editingProduct.description);
                formData.append('price', parseFloat(this.editingProduct.price));
                formData.append('stock_quantity', parseInt(this.editingProduct.stock_quantity));
                formData.append('category', this.editingProduct.category);

                // Add image if there's a new one
                if (this.newImage) {
                    formData.append('image', this.newImage);
                }

                const response = await fetch(`http://localhost:7904/api/products/${this.editingProduct.products_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to update product');
                }

                await this.fetchProducts(); // Refresh products list
                this.closeModal();
            } catch (error) {
                console.error('Error updating product:', error);
                // Add error handling UI feedback here if needed
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
                console.error('Logout failed:', error);
            } finally {
                this.showLogoutModal = false;
            }
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.$router.push('/login');
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            this.username = decoded.username || 'Admin';
            this.fetchProducts(); // Fetch products after confirming authentication
        } catch (error) {
            console.error('Token validation error:', error);
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.admin-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-left: 250px;
}

.admin-content {
    padding: 2rem;
    margin: 0 auto;
}

/* Header and Filters */
.header {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

.header h2 {
    color: #2c3e50;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.filters {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-box {
    flex: 1;
    min-width: 250px;
}

.search-box input {
    width: 98%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
}

.status-filter {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    min-width: 200px;
}

.reset-btn {
    padding: 0.75rem 1.5rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.reset-btn:hover {
    background-color: #dc2626;
}

/* Table Styles */
.table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: auto;
    max-height: calc(100vh - 200px);
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

thead {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #f8fafc;
}

th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #475569;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;
}

td {
    padding: 1rem;
    color: #1e293b;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.95rem;
}

tbody tr:hover {
    background-color: #f8fafc;
}

.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}

.critical-stock {
    color: #dc2626;
    background-color: #fee2e2;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
}

.highlight-sales {
    color: #047857;
    background-color: #ecfdf5;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
}
td > span:not(.highlight-sales):not(.critical-stock) {
    padding: 0.4rem 1rem;
}
.edit-btn {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.edit-btn:hover {
    background-color: #2563eb;
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
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
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
    border-radius: 6px;
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

.save-btn:hover {
    background-color: #059669;
}

.cancel-btn {
    background-color: #ef4444;
    color: white;
}

.cancel-btn:hover {
    background-color: #dc2626;
}

.no-results {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
    font-size: 1rem;
}
.delete-btn {
    padding: 0.5rem 1rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
    margin-left: 0.5rem;
}

.delete-btn:hover {
    background-color: #dc2626;
}

.delete-modal {
    max-width: 400px;
    text-align: center;
}

.delete-modal h2 {
    color: #dc2626;
    margin-bottom: 1rem;
}

.delete-modal p {
    margin-bottom: 1.5rem;
    color: #4b5563;
}

.confirm-delete-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    border: none;
    background-color: #ef4444;
    color: white;
}

.confirm-delete-btn:hover {
    background-color: #dc2626;
}
/* Responsive Design */
@media (max-width: 1200px) {
    .filters {
        flex-wrap: wrap;
    }
    
    .search-box {
        width: 100%;
        min-width: 100%;
    }
}

@media (max-width: 768px) {
    .admin-container {
        padding-left: 60px;
    }
    
    .admin-content {
        padding: 1rem;
    }
    
    .header {
        padding: 1rem;
    }
    
    .header h2 {
        font-size: 1.25rem;
    }
    
    td, th {
        padding: 0.75rem;
    }
    
    .modal-content {
        width: 95%;
        margin: 1rem;
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .filters {
        gap: 0.5rem;
    }
    
    .status-filter {
        width: 100%;
        min-width: 100%;
    }
    
    .reset-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>