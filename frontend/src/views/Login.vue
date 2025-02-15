<template>
  <div class="login-container">
      <div class="login-card">
          <h2>Login</h2>
          <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              placeholder="Enter email"
            />
          </div>
          
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              required
              placeholder="Enter password"
            />
          </div>
  
          <button type="submit" class="login-btn">Login</button>
        </form>
            <p v-if="error" class="error-message">{{ error }}</p>
            <p class="register-link">
                Don't have an account? <router-link to="/register">Register here</router-link>
            </p>
            <p class="forgot-password-link">
                Forgot your password? <router-link to="/forgot-password">Reset it here</router-link>
            </p>
        </div>
        

        <!-- Verification Dialog -->
        <div v-if="showVerificationDialog" class="modal-overlay">
            <div class="modal-content">
                <h3>Account Not Verified</h3>
                <p>Your account is not verified yet. Would you like to receive a new verification code?</p>
                <div class="modal-buttons">
                    <button @click="resendVerification" class="confirm-btn">Yes, Send Code</button>
                    <button @click="cancelVerification" class="cancel-btn">No, Go Back</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'Login',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            error: '',
            showVerificationDialog: false,
            unverifiedEmail: ''
        }
    },
    methods: {
    async handleLogin() {
        try {
            const response = await fetch('http://localhost:7904/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(this.formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if it's an invalid credentials error
                if (data.message === 'Invalid email or password') {
                    throw new Error('Invalid email or password');
                }
                
                // If credentials are correct but user is not verified
                if (data.needsVerification && data.validCredentials) {
                    this.unverifiedEmail = data.email;
                    // Store password temporarily
                    localStorage.setItem('tempPassword', this.formData.password);
                    this.showVerificationDialog = true;
                    return;
                }

                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            
            // Check user role and redirect accordingly
            const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
            switch(decodedToken.role) {
                case 'admin':
                    this.$router.push('/admin');
                    break;
                case 'staff':
                    this.$router.push('/staff');
                    break;
                default:
                    this.$router.push('/home');
            }
        } catch (err) {
            this.error = err.message;
        }
    },

    async resendVerification() {
        try {
            const response = await fetch('http://localhost:7904/api/users/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.unverifiedEmail })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            this.showVerificationDialog = false;
            this.$router.push({
                path: '/verify-otp',
                query: { 
                    email: this.unverifiedEmail,
                    fromLogin: 'true' // Add this parameter
                }
            });
        } catch (err) {
            this.error = err.message;
        }
    }
}
}
</script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
  
  input {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .login-btn {
    background-color: #4CAF50;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
  }
  
  .login-btn:hover {
    background-color: #45a049;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  
  .register-link {
    margin-top: 1rem;
    text-align: center;
  }
  
  a {
    color: #4CAF50;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
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
    background-color: #4CAF50;
    color: white;
}

.cancel-btn {
    background-color: #95a5a6;
    color: white;
}

.confirm-btn:hover {
    background-color: #45a049;
}

.cancel-btn:hover {
    background-color: #7f8c8d;
}
</style>