<template>
    <div class="staff-container">
        <nav class="staff-navbar">
            <div class="nav-brand">
                <h1>Staff Dashboard</h1>
            </div>
            <div class="nav-menu">
                <span class="staff-name">Welcome, {{ username }}</span>
                <button @click="showLogoutModal = true" class="logout-btn">
                    Logout
                </button>
            </div>
        </nav>

        <div class="staff-content">
            <div class="welcome-card">
                <h2>Welcome to Staff Dashboard</h2>
                <p>Access your staff features and manage your tasks here.</p>
            </div>

            <!-- Add more staff-specific content here -->
        </div>

        <!-- Logout Modal -->
        <div v-if="showLogoutModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to logout?</p>
                <div class="modal-buttons">
                    <button @click="handleLogout" class="confirm-btn">Yes, Logout</button>
                    <button @click="showLogoutModal = false" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StaffHome',
    data() {
        return {
            username: '',
            showLogoutModal: false
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
            this.username = decoded.username || 'Staff';
        }
    }
}
</script>

<style scoped>
.staff-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.staff-navbar {
    background-color: #3498db;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand h1 {
    margin: 0;
    font-size: 1.5rem;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.staff-name {
    font-weight: 500;
}

.logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.logout-btn:hover {
    background-color: #c0392b;
}

.staff-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

/* Modal Styles */
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
    max-width: 400px;
    text-align: center;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
}

.confirm-btn, .cancel-btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.confirm-btn {
    background-color: #e74c3c;
    color: white;
}

.cancel-btn {
    background-color: #95a5a6;
    color: white;
}

.confirm-btn:hover {
    background-color: #c0392b;
}

.cancel-btn:hover {
    background-color: #7f8c8d;
}
</style>