<template>
    <div class="insert-products-container">
        <AdminNavbar :username="username" @logout="showLogoutModal = true" />

        <div class="insert-products-content">
            <div class="insert-products-card">
                <h2>Insert New Product</h2>
                <form @submit.prevent="handleSubmit" class="insert-products-form">
                    <div class="form-group">
                        <label for="name">Product Name</label>
                        <input type="text" id="name" v-model="product.name" required />
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" v-model="product.description" rows="4" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="number" id="price" v-model="product.price" required />
                    </div>
                    <div class="form-group">
                        <label for="stock_quantity">Stock Quantity</label>
                        <input type="number" id="stock_quantity" v-model="product.stock_quantity" required />
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" v-model="product.category" required>
                            <option value="" disabled>Select a category</option>
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
                        <label for="image">Image</label>
                        <input type="file" id="image" @change="handleImageUpload" accept="image/*" />
                    </div>

                    <button type="submit" class="submit-btn">Add Product</button>
                </form>
                <p v-if="error" class="error-message">{{ error }}</p>
                <p v-if="success" class="success-message">{{ success }}</p>
            </div>
        </div>

        <LogoutModal :show="showLogoutModal" @confirm="handleLogout" @cancel="showLogoutModal = false" />
    </div>
</template>

<script>
import AdminNavbar from '../../components/AdminNavbar.vue';
import LogoutModal from '../../components/LogoutModal.vue';

export default {
    name: 'InsertProducts',
    components: {
        AdminNavbar,
        LogoutModal
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            product: {
                name: '',
                description: '',
                price: null,
                stock_quantity: null,
                category: '',
            },
            image: null,
            error: '',
            success: ''
        };
    },
    methods: {
        async handleSubmit() {
            try {
                this.error = '';
                this.success = '';

                const formData = new FormData();
                formData.append('name', this.product.name);
                formData.append('description', this.product.description);
                formData.append('price', this.product.price);
                formData.append('stock_quantity', this.product.stock_quantity);
                formData.append('category', this.product.category);
                if (this.image) {
                    formData.append('image', this.image);
                }

                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/products', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    this.success = 'Product added successfully!';
                    this.product = { 
                        name: '', 
                        description: '', 
                        price: null, 
                        stock_quantity: null, 
                        category: '' 
                    };
                    this.image = null;
                    document.getElementById('image').value = '';
                } else {
                    throw new Error(data.message || 'Failed to add product');
                }
            } catch (error) {
                this.error = error.message;
                console.error('Error:', error);
            }
        },
        handleImageUpload(event) {
            this.image = event.target.files[0];
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
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            this.username = decoded.username || 'Admin';
        }
    }
};
</script>

<style scoped>
.insert-products-container {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-left: 250px; /* Match sidebar width */
}

.insert-products-content {
    padding: 2rem;
    margin: 0 auto;
}

.insert-products-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.insert-products-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-weight: bold;
    color: #333;
}

input,
textarea,
select {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.submit-btn {
    background-color: #27ae60;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
}

.submit-btn:hover {
    background-color: #219a52;
}

.error-message {
    color: #e74c3c;
    margin-top: 1rem;
}

.success-message {
    color: #27ae60;
    margin-top: 1rem;
}
</style>