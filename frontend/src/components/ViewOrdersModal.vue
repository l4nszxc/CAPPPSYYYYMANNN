<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <h3><i class="fas fa-clipboard-list"></i> Order Summary</h3>
            
            <div class="order-items">
                <div v-for="item in selectedItems" :key="item.product_id" class="order-item">
                    <img :src="item.image ? `http://localhost:7904/uploads/${item.image}` : 'placeholder-image.jpg'"
                         :alt="item.name" 
                         class="order-item-image">
                    <div class="order-item-details">
                        <h4>{{ item.name }}</h4>
                        <p class="item-price">Price: ₱{{ item.price }}</p>
                        <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                        <p class="item-subtotal">Subtotal: ₱{{ (item.price * item.quantity).toFixed(2) }}</p>
                    </div>
                </div>
            </div>

            <div class="order-total">
                <h4>Total Amount: ₱{{ totalAmount.toFixed(2) }}</h4>
            </div>

            <div class="modal-buttons">
                <button @click="$emit('place-order')" class="place-order-btn">
                    <i class="fas fa-check"></i> Confirm Order
                </button>
                <button @click="$emit('close')" class="cancel-btn">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ViewOrdersModal',
    props: {
        show: Boolean,
        selectedItems: Array
    },
    computed: {
        totalAmount() {
            return this.selectedItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
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
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.order-items {
    margin: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.order-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.order-item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.order-item-details {
    flex-grow: 1;
}

.order-item-details h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.item-price, .item-quantity, .item-subtotal {
    margin: 0.25rem 0;
    color: #666;
}

.order-total {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 2px solid #eee;
    text-align: right;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.place-order-btn, .cancel-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.place-order-btn {
    background-color: #4CAF50;
    color: white;
}

.cancel-btn {
    background-color: #6c757d;
    color: white;
}

.place-order-btn:hover {
    background-color: #45a049;
}

.cancel-btn:hover {
    background-color: #5a6268;
}
</style>