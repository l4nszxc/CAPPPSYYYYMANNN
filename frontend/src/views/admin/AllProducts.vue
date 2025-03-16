<template>
    <div class="admin-container">
        <AdminNavbar :username="username" @logout="showLogoutModal = true" />
        
        <div class="admin-content">
            <div class="header">
                <h2>MANAGE PRODUCTS</h2>
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
                        <option value="Beverages">Beverages</option>
                        <option value="Milk and Chocolate Drink">Milk and Chocolate Drink</option>
                        <option value="Coffee and Creamer">Coffee and Creamer</option>
                        <option value="Condiments">Condiments</option>
                        <option value="Canned Goods">Canned Goods</option>
                        <option value="Biscuits">Biscuits</option>
                        <option value="Candies and Snacks">Candies and Snacks</option>
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
                            <th>Options</th>
                            <th>Stock</th>
                            <th>Total Sold</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="product in filteredProducts" :key="product.products_id">
                            <!-- Main product row -->
                            <tr :class="{'product-row': true}">
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
                                    <div class="options-count">
                                        <span v-if="product.choices && product.choices.length">
                                            {{ product.choices.length }} options
                                            <button @click="toggleChoices(product)" class="toggle-choices-btn">
                                                <i :class="['fas', expandedProducts.has(product.products_id) ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                                            </button>
                                        </span>
                                        <span v-else>No options</span>
                                    </div>
                                </td>
                                <td>
                                    <span 
                                        :class="getStockStatusClass(product.stock_quantity)" 
                                        class="stock-badge">
                                        {{ product.stock_quantity }}
                                    </span>
                                </td>
                                <td>
                                    <span class="sales-badge" :class="getSalesStatusClass(product.total_sold)">
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
                            
                            <!-- Product choices row (conditionally rendered) -->
                            <tr v-if="expandedProducts.has(product.products_id) && product.choices && product.choices.length > 0"
                                :key="`choices-${product.products_id}`" 
                                class="choices-row">
                                <td colspan="8">
                                    <div class="choices-container">
                                        <h4>Product Options for {{ product.name }}</h4>
                                        <table class="choices-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Option Name</th>
                                                    <th>Price</th>
                                                    <th>Stock</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="choice in product.choices" :key="choice.choice_id">
                                                    <td>
                                                        <img 
                                                            :src="choice.image || product.image || '/img/placeholder.jpg'"
                                                            :alt="choice.name"
                                                            class="choice-image"
                                                            @error="handleImageError"
                                                        >
                                                    </td>
                                                    <td>{{ choice.name }}</td>
                                                    <td>₱{{ formatPrice(choice.price) }}</td>
                                                    <td>
                                                        <span 
                                                            :class="getStockStatusClass(choice.stock)" 
                                                            class="stock-badge">
                                                            {{ choice.stock }}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button @click="showEditChoiceModal(choice, product)" class="edit-choice-btn">
                                                            <i class="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button @click="showDeleteChoiceConfirmation(choice, product)" class="delete-choice-btn">
                                                            <i class="fas fa-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </template>
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
                            <option value="Beverages">Beverages</option>
                            <option value="Milk and Chocolate Drink">Milk and Chocolate Drink</option>
                            <option value="Coffee and Creamer">Coffee and Creamer</option>
                            <option value="Condiments">Condiments</option>
                            <option value="Canned Goods">Canned Goods</option>
                            <option value="Biscuits">Biscuits</option>
                            <option value="Candies and Snacks">Candies and Snacks</option>
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

        <!-- Edit Choice Modal -->
        <div v-if="showChoiceModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Edit Product Option</h2>
                <h3>{{ editingChoiceProductName }}</h3>
                <form @submit.prevent="handleEditChoiceSubmit" class="edit-form">
                    <div class="form-group">
                        <label for="choiceName">Option Name</label>
                        <input type="text" id="choiceName" v-model="editingChoice.name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="choicePrice">Price</label>
                        <input type="number" id="choicePrice" v-model="editingChoice.price" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="choiceStock">Stock Quantity</label>
                        <input type="number" id="choiceStock" v-model="editingChoice.stock" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="choiceImage">New Image (optional)</label>
                        <input type="file" id="choiceImage" @change="handleChoiceImageUpload" accept="image/*">
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" @click="closeChoiceModal" class="cancel-btn">
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
        <div v-if="showDeleteChoiceModal" class="modal-overlay">
            <div class="modal-content delete-modal">
                <h2>Delete Product Option</h2>
                <p>Are you sure you want to delete "{{ choiceToDelete?.name }}" from "{{ choiceProductName }}"?</p>
                <div class="modal-buttons">
                    <button @click="confirmDeleteChoice" class="confirm-delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button @click="closeDeleteChoiceModal" class="cancel-btn">
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
            showChoiceModal: false,
            editingProduct: null,
            editingChoice: null,
            editingChoiceProductName: '',
            newImage: null,
            newChoiceImage: null,
            searchQuery: '', 
            selectedCategory: '',
            showDeleteModal: false,
            productToDelete: null,
            expandedProducts: new Set(),
            showDeleteChoiceModal: false,
            choiceToDelete: null,
            choiceProductName: '',
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
        showDeleteChoiceConfirmation(choice, product) {
            this.choiceToDelete = choice;
            this.choiceProductName = product.name;
            this.showDeleteChoiceModal = true;
        },
        
        closeDeleteChoiceModal() {
            this.showDeleteChoiceModal = false;
            this.choiceToDelete = null;
            this.choiceProductName = '';
        },
        
        async confirmDeleteChoice() {
            try {
                const token = localStorage.getItem('token');
                if (!token || !this.choiceToDelete || !this.choiceToDelete.choice_id) {
                    console.error('Missing required data for deletion');
                    return;
                }
                
                const response = await fetch(`http://localhost:7904/api/products/choices/${this.choiceToDelete.choice_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to delete product option');
                }
                
                // Refresh products to get updated data
                await this.fetchProducts();
                this.closeDeleteChoiceModal();
            } catch (error) {
                console.error('Error deleting product choice:', error);
                // You could add error notification here
            }
        },
        toggleChoices(product) {
            if (!product || typeof product.products_id === 'undefined') {
                console.error('Invalid product or missing product ID', product);
                return;
            }
            
            if (this.expandedProducts.has(product.products_id)) {
                this.expandedProducts.delete(product.products_id);
            } else {
                this.expandedProducts.add(product.products_id);
            }
        },
        
        getSalesStatusClass(totalSold) {
            totalSold = parseInt(totalSold) || 0;
            if (totalSold >= 50) return 'high-sales';
            if (totalSold >= 20) return 'good-sales';
            if (totalSold > 0) return 'some-sales';
            return 'no-sales';
        },
        
        getStockStatusClass(stock) {
            stock = parseInt(stock) || 0;
            if (stock <= 10) return 'critical-stock';
            if (stock <= 20) return 'low-stock';
            return 'normal-stock';
        },tatusClass(stock) {
            if (stock <= 10) return 'critical-stock';
            if (stock <= 20) return 'low-stock';
            return 'normal-stock';
        },
        
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
                const response = await fetch(`http://localhost:7904/api/products/${this.productToDelete.products_id}`, {
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
                if (!token) {
                    this.$router.push('/login');
                    return;
                }
                
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
                        total_sold: parseInt(product.total_sold) || 0,
                        choices: Array.isArray(product.choices) ? product.choices : []
                    }));
                    // Debug log to verify data
                    console.log("Fetched products:", this.products);
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
        
        showEditChoiceModal(choice, product) {
            if (!choice || !product) {
                console.error('Invalid choice or product', { choice, product });
                return;
            }
            
            this.editingChoice = { ...choice };
            this.editingChoiceProductName = product.name || 'Unknown Product';
            this.showChoiceModal = true;
        },
        
        closeChoiceModal() {
            this.showChoiceModal = false;
            this.editingChoice = null;
            this.editingChoiceProductName = '';
            this.newChoiceImage = null;
        },
        
        handleImageUpload(event) {
            if (event.target.files && event.target.files[0]) {
                this.newImage = event.target.files[0];
                console.log('Main product image selected:', this.newImage.name);
            }
        },

        handleChoiceImageUpload(event) {
            if (event.target.files && event.target.files[0]) {
                this.newChoiceImage = event.target.files[0];
                console.log('Choice image selected:', this.newChoiceImage.name);
            }
        },
        
        async handleEditSubmit() {
            try {
                const token = localStorage.getItem('token');
                
                console.log('Editing product:', this.editingProduct);
                console.log('Has new image?', this.newImage ? 'Yes' : 'No');
                
                // Create FormData for the request
                const formData = new FormData();
                formData.append('name', this.editingProduct.name);
                formData.append('description', this.editingProduct.description);
                formData.append('price', parseFloat(this.editingProduct.price));
                formData.append('stock_quantity', parseInt(this.editingProduct.stock_quantity));
                formData.append('category', this.editingProduct.category);

                // Add image if there's a new one
                if (this.newImage) {
                    console.log('Attaching image file:', this.newImage.name);
                    formData.append('image', this.newImage);
                }
                
                // Debug log - print all form data being sent
                console.log('Sending form data with these fields:');
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File: ' + pair[1].name : pair[1]));
                }

                const response = await fetch(`http://localhost:7904/api/products/${this.editingProduct.products_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Do NOT set Content-Type here - the browser will set it with the proper multipart boundary
                    },
                    body: formData
                });

                // Parse the response to get the updated image URL
                const responseData = await response.json();
                
                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to update product');
                }
                
                console.log('Product update response:', responseData);
                
                // Instead of using this.$set, directly modify a copy of the products array
                const updatedProducts = [...this.products];
                const productIndex = updatedProducts.findIndex(p => p.products_id === this.editingProduct.products_id);
                
                if (productIndex !== -1) {
                    // Create updated product with all edited fields
                    const updatedProduct = { 
                        ...updatedProducts[productIndex],
                        name: this.editingProduct.name,
                        description: this.editingProduct.description,
                        price: parseFloat(this.editingProduct.price),
                        stock_quantity: parseInt(this.editingProduct.stock_quantity),
                        category: this.editingProduct.category
                    };
                    
                    // If we have a new image URL in the response, update that too
                    if (responseData.imageUrl) {
                        updatedProduct.image = responseData.imageUrl;
                        console.log('Updated product image to:', responseData.imageUrl);
                    }
                    
                    // Replace the product in the array
                    updatedProducts[productIndex] = updatedProduct;
                    
                    // Update the products array
                    this.products = updatedProducts;
                    console.log('Updated product in local array');
                }
                
                this.closeModal();
            } catch (error) {
                console.error('Error updating product:', error);
                // Add error handling UI feedback here if needed
            }
        },
        
        async handleEditChoiceSubmit() {
            try {
                if (!this.editingChoice || !this.editingChoice.choice_id) {
                    console.error('Invalid choice data', this.editingChoice);
                    return;
                }
                
                const token = localStorage.getItem('token');
                
                // Create FormData for the request
                const formData = new FormData();
                
                // Add all form fields
                formData.append('name', this.editingChoice.name);
                formData.append('price', parseFloat(this.editingChoice.price));
                formData.append('stock', parseInt(this.editingChoice.stock));

                // Add image if there's a new one - fixed field name to match the controller
                if (this.newChoiceImage) {
                    console.log('Attaching image file:', this.newChoiceImage.name);
                    formData.append('image', this.newChoiceImage);
                }

                // Debug log - should see name, price, stock and image if available
                console.log('Sending form data with these fields:');
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File: ' + pair[1].name : pair[1]));
                }
                
                const response = await fetch(`http://localhost:7904/api/products/choices/${this.editingChoice.choice_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Do NOT set Content-Type here - the browser will set it with the proper multipart boundary
                    },
                    body: formData
                });

                const responseData = await response.json();
                
                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to update product option');
                }

                console.log('Product choice update successful:', responseData);
                
                // Refresh products list to show updated data
                await this.fetchProducts();
                this.closeChoiceModal();
            } catch (error) {
                console.error('Error updating product choice:', error);
                // Add error notification here if you have one
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

.stock-badge, .sales-badge {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    min-width: 60px;
}

.critical-stock {
    color: #dc2626;
    background-color: #fee2e2;
}

.low-stock {
    color: #854d0e;
    background-color: #fef3c7;
}

.normal-stock {
    color: #475569;
    background-color: #f1f5f9;
}

.high-sales {
    color: #15803d;
    background-color: #dcfce7;
}

.good-sales {
    color: #047857;
    background-color: #ecfdf5;
}

.some-sales {
    color: #0369a1;
    background-color: #e0f2fe;
}

.no-sales {
    color: #6b7280;
    background-color: #f3f4f6;
}

.highlight-sales {
    color: #047857;
    background-color: #ecfdf5;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
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

/* Product Choices Styles */
.options-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.toggle-choices-btn {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.toggle-choices-btn:hover {
    color: #2563eb;
}

.choices-row {
    background-color: #f8fafc;
}

.choices-container {
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 8px;
    margin: 0.5rem 0;
}

.choices-container h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1e293b;
    font-size: 1rem;
}

.choices-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.choices-table th {
    background-color: #e2e8f0;
    font-size: 0.875rem;
    padding: 0.75rem;
}

.choices-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
}

.choice-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.edit-choice-btn {
    padding: 0.4rem 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
}

.edit-choice-btn:hover {
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

.modal-content h3 {
    color: #6b7280;
    font-size: 1rem;
    margin-top: -1rem;
    margin-bottom: 1.5rem;
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
.delete-choice-btn {
    padding: 0.4rem 0.75rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
    margin-left: 0.5rem;
}

.delete-choice-btn:hover {
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