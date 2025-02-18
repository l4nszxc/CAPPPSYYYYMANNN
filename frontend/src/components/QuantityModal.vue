<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <h3>Select Quantity</h3>
            <div class="quantity-controls">
                <button @click="decrementQuantity" :disabled="quantity <= 1">-</button>
                <input 
                    type="number" 
                    v-model.number="quantity" 
                    min="1" 
                    :max="productStock"
                    @input="validateQuantity"
                >
                <button @click="incrementQuantity" :disabled="quantity >= productStock">+</button>
            </div>
            <p class="stock-info">Available stock: {{ productStock }}</p>
            <div class="modal-buttons">
                <button @click="confirm" class="confirm-btn" :disabled="!isValidQuantity">
                    Confirm
                </button>
                <button @click="cancel" class="cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QuantityModal',
    props: {
        show: Boolean,
        productStock: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            quantity: 1
        }
    },
    computed: {
        isValidQuantity() {
            return this.quantity >= 1 && this.quantity <= this.productStock;
        }
    },
    methods: {
        incrementQuantity() {
            if (this.quantity < this.productStock) {
                this.quantity++;
            }
        },
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        validateQuantity() {
            this.quantity = Math.min(Math.max(1, this.quantity), this.productStock);
        },
        confirm() {
            if (this.isValidQuantity) {
                this.$emit('confirm', this.quantity);
                this.quantity = 1;
            }
        },
        cancel() {
            this.$emit('cancel');
            this.quantity = 1;
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.quantity = 1;
            }
        }
    }
}
</script>

<style scoped>
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
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
}

.quantity-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
}

.quantity-controls button {
    padding: 5px 15px;
    border: 1px solid #ddd;
    background-color: #f8f8f8;
    cursor: pointer;
    border-radius: 4px;
}

.quantity-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-controls input {
    width: 60px;
    text-align: center;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.stock-info {
    text-align: center;
    color: #666;
    margin-bottom: 15px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.confirm-btn, .cancel-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    flex: 1;
}

.confirm-btn {
    background-color: #3498db;
    color: white;
}

.confirm-btn:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: #e74c3c;
    color: white;
}
</style>