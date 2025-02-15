<template>
    <div class="recruit-container">
        <AdminNavbar :username="username" @logout="showLogoutModal = true" />
        
        <div class="recruit-content">
            <div class="recruit-card">
                <h2>Recruit New Staff Member</h2>
                <form @submit.prevent="handleStaffRegistration" class="recruit-form">
                    <div class="form-group">
                        <label for="fullname">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            v-model="formData.fullname"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            v-model="formData.email"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="position">Position</label>
                        <select id="position" v-model="formData.position" required>
                            <option value="">Select Position</option>
                            <option value="staff">Staff</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="password">Initial Password</label>
                        <input
                            type="password"
                            id="password"
                            v-model="formData.password"
                            required
                        />
                    </div>

                    <button type="submit" class="submit-btn">Register Staff</button>
                </form>
                <p v-if="error" class="error-message">{{ error }}</p>
                <p v-if="success" class="success-message">{{ success }}</p>
            </div>
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
import AdminNavbar from '../../components/AdminNavbar.vue'
export default {
    name: 'RecruitStaff',
    components: {
        AdminNavbar
    },
    data() {
        return {
            username: '',
            showLogoutModal: false,
            formData: {
                fullname: '',
                email: '',
                position: '',
                password: ''
            },
            error: '',
            success: ''
        }
    },
    methods: {
        async handleStaffRegistration() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:7904/api/admin/recruit-staff', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                this.success = 'Staff member registered successfully!';
                this.formData = {
                    fullname: '',
                    email: '',
                    position: '',
                    password: ''
                };
            } catch (err) {
                this.error = err.message;
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
    }
}
</script>

<style scoped>
.recruit-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.recruit-content {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.recruit-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recruit-form {
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

input, select {
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