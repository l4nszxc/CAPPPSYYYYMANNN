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
                        <select id="category" v-model="product.category" required @change="updateSuggestedChoices">
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
                        <label for="image">Product Image</label>
                        <input type="file" id="image" @change="handleImageUpload" accept="image/*" />
                    </div>

                    <div class="product-choices-section">
                        <div class="choices-header">
                            <h3>Product Choices (Optional)</h3>
                            <button type="button" class="add-choice-btn" @click="addChoice">
                                <i class="fas fa-plus"></i> Add Choice
                            </button>
                        </div>
                        
                        <div v-if="suggestedChoicesVisible" class="suggested-choices">
                            <p>Suggested choices for {{ product.category }}:</p>
                            <div class="suggestion-chips">
                                <span 
                                    v-for="(suggestion, index) in suggestedChoices" 
                                    :key="index" 
                                    class="suggestion-chip"
                                    @click="applyChoices(suggestion)"
                                >
                                    {{ suggestion.label }}
                                </span>
                            </div>
                        </div>
                        
                        <div v-for="(choice, index) in choices" :key="index" class="product-choice">
                            <div class="choice-header">
                                <h4>Choice #{{ index + 1 }}</h4>
                                <button type="button" class="remove-choice-btn" @click="removeChoice(index)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div class="choice-form">
                                <div class="form-group">
                                    <label :for="'choice-name-' + index">Name</label>
                                    <input 
                                        type="text" 
                                        :id="'choice-name-' + index" 
                                        v-model="choice.name" 
                                        placeholder="e.g., 750ml, 1.65L, Medium, Large, etc." 
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <label :for="'choice-price-' + index">Price</label>
                                    <input 
                                        type="number" 
                                        :id="'choice-price-' + index" 
                                        v-model="choice.price" 
                                        step="0.01" 
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <label :for="'choice-stock-' + index">Stock Quantity</label>
                                    <input 
                                        type="number" 
                                        :id="'choice-stock-' + index" 
                                        v-model="choice.stock" 
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <label :for="'choice-image-' + index">Image (Optional)</label>
                                    <input 
                                        type="file" 
                                        :id="'choice-image-' + index" 
                                        @change="(e) => handleChoiceImageUpload(e, index)" 
                                        accept="image/*" 
                                    />
                                </div>
                            </div>
                        </div>
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
            success: '',
            choices: [],
            choiceImages: [],
            suggestedChoicesVisible: false,
            suggestedChoices: []
        };
    },
    methods: {
        updateSuggestedChoices() {
            this.suggestedChoicesVisible = true;
            
            // Define suggested choices based on category
            const categoryChoices = {
                'Beverages': [
                    {
                        label: 'Drink Sizes',
                        choices: [
                            { name: '330ml', price: null, stock: null },
                            { name: '500ml', price: null, stock: null },
                            { name: '1 Liter', price: null, stock: null },
                            { name: '1.5 Liter', price: null, stock: null },
                            { name: '1.65 Liter', price: null, stock: null },
                            { name: '2 Liter', price: null, stock: null }
                        ]
                    },
                    {
                        label: 'Alcohol Sizes',
                        choices: [
                            { name: '375ml', price: null, stock: null },
                            { name: '750ml', price: null, stock: null },
                            { name: '1 Liter', price: null, stock: null },
                            { name: '1.75 Liter', price: null, stock: null }
                        ]
                    }
                ],
                'Bakery & Snacks': [
                    {
                        label: 'Bread Sizes',
                        choices: [
                            { name: 'Small', price: null, stock: null },
                            { name: 'Medium', price: null, stock: null },
                            { name: 'Large', price: null, stock: null }
                        ]
                    },
                    {
                        label: 'Pack Sizes',
                        choices: [
                            { name: 'Single', price: null, stock: null },
                            { name: 'Pack of 3', price: null, stock: null },
                            { name: 'Pack of 6', price: null, stock: null },
                            { name: 'Family Size', price: null, stock: null }
                        ]
                    }
                ],
                'Dairy & Eggs': [
                    {
                        label: 'Milk Sizes',
                        choices: [
                            { name: '250ml', price: null, stock: null },
                            { name: '500ml', price: null, stock: null },
                            { name: '1 Liter', price: null, stock: null }
                        ]
                    },
                    {
                        label: 'Egg Packs',
                        choices: [
                            { name: '6-pack', price: null, stock: null },
                            { name: '12-pack', price: null, stock: null },
                            { name: '24-pack', price: null, stock: null },
                            { name: '30-pack', price: null, stock: null }
                        ]
                    }
                ],
                'Meat & Seafood': [
                    {
                        label: 'Weight Options',
                        choices: [
                            { name: '250g', price: null, stock: null },
                            { name: '500g', price: null, stock: null },
                            { name: '1kg', price: null, stock: null }
                        ]
                    },
                    {
                        label: 'Cut Options',
                        choices: [
                            { name: 'Fillet', price: null, stock: null },
                            { name: 'Whole', price: null, stock: null },
                            { name: 'Sliced', price: null, stock: null },
                            { name: 'Ground', price: null, stock: null }
                        ]
                    }
                ],
                'Fruits & Vegetables': [
                    {
                        label: 'Package Options',
                        choices: [
                            { name: 'Per Piece', price: null, stock: null },
                            { name: '250g Pack', price: null, stock: null },
                            { name: '500g Pack', price: null, stock: null },
                            { name: '1kg Pack', price: null, stock: null }
                        ]
                    }
                ],
                'Condiments & Sauces': [
                    {
                        label: 'Bottle Sizes',
                        choices: [
                            { name: 'Small (100ml)', price: null, stock: null },
                            { name: 'Medium (250ml)', price: null, stock: null },
                            { name: 'Large (500ml)', price: null, stock: null },
                            { name: 'Family Size (1L)', price: null, stock: null }
                        ]
                    }
                ],
                'Frozen Foods': [
                    {
                        label: 'Package Sizes',
                        choices: [
                            { name: 'Single Serve', price: null, stock: null },
                            { name: 'Family Size', price: null, stock: null },
                            { name: 'Party Size', price: null, stock: null }
                        ]
                    }
                ],
                'Grains & Pasta': [
                    {
                        label: 'Package Weights',
                        choices: [
                            { name: '500g', price: null, stock: null },
                            { name: '1kg', price: null, stock: null },
                            { name: '2kg', price: null, stock: null },
                            { name: '5kg', price: null, stock: null }
                        ]
                    }
                ],
                'Canned & Packaged Goods': [
                    {
                        label: 'Can Sizes',
                        choices: [
                            { name: 'Small (150g)', price: null, stock: null },
                            { name: 'Medium (400g)', price: null, stock: null },
                            { name: 'Large (800g)', price: null, stock: null }
                        ]
                    }
                ],
                'Spices & Seasonings': [
                    {
                        label: 'Container Sizes',
                        choices: [
                            { name: 'Small (50g)', price: null, stock: null },
                            { name: 'Medium (100g)', price: null, stock: null },
                            { name: 'Large (250g)', price: null, stock: null }
                        ]
                    }
                ]
            };
            
            this.suggestedChoices = categoryChoices[this.product.category] || [];
        },
        
        applyChoices(suggestion) {
            this.choices = JSON.parse(JSON.stringify(suggestion.choices));
            this.choiceImages = this.choices.map(() => null);
        },
        
        addChoice() {
            this.choices.push({
                name: '',
                price: null,
                stock: null
            });
            this.choiceImages.push(null);
        },
        
        removeChoice(index) {
            this.choices.splice(index, 1);
            this.choiceImages.splice(index, 1);
        },
        
        handleImageUpload(event) {
            this.image = event.target.files[0];
        },
        
        handleChoiceImageUpload(event, index) {
            this.choiceImages[index] = event.target.files[0];
        },
        
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
                
                // Add choices data
                if (this.choices.length > 0) {
                    formData.append('hasChoices', 'true');
                    formData.append('choices', JSON.stringify(this.choices));
                    
                    // Add choice images
                    this.choiceImages.forEach((img, idx) => {
                        if (img) {
                            formData.append(`choiceImage_${idx}`, img);
                        }
                    });
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
                    // Reset form
                    this.product = { 
                        name: '', 
                        description: '', 
                        price: null, 
                        stock_quantity: null, 
                        category: '' 
                    };
                    this.image = null;
                    this.choices = [];
                    this.choiceImages = [];
                    this.suggestedChoicesVisible = false;
                    document.getElementById('image').value = '';
                } else {
                    throw new Error(data.message || 'Failed to add product');
                }
            } catch (error) {
                this.error = error.message;
                console.error('Error:', error);
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

/* New styles for product choices */
.product-choices-section {
    margin-top: 1.5rem;
    border: 1px solid #eee;
    padding: 1.5rem;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.choices-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.choices-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
}

.add-choice-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.add-choice-btn:hover {
    background-color: #2980b9;
}

.product-choice {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.choice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.choice-header h4 {
    margin: 0;
    color: #2c3e50;
}

.remove-choice-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
}

.remove-choice-btn:hover {
    background-color: #c0392b;
}

.choice-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}

.suggested-choices {
    background-color: #ecf0f1;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.suggested-choices p {
    margin-top: 0;
    font-weight: 500;
    color: #2c3e50;
}

.suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.suggestion-chip {
    background-color: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.suggestion-chip:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .insert-products-container {
        padding-left: 0;
    }
    
    .choice-form {
        grid-template-columns: 1fr;
    }
}
</style>