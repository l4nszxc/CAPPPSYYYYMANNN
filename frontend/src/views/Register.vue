<template>
  <div class="register-container">
    <div class="register-card">
      <div class="form-header">
        <i class="fas fa-user-plus logo-icon"></i>
        <h2>Create Account</h2>
        <p class="subtitle">Join our community today</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-group">
            <i class="fas fa-user input-icon"></i>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              required
              placeholder="Choose a username"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-group">
            <i class="fas fa-envelope input-icon"></i>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              placeholder="Enter your email"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              required
              placeholder="Create a password"
            />
          </div>
        </div>

        <button type="submit" class="register-btn">
          <i class="fas fa-user-plus"></i>
          Create Account
        </button>
      </form>

      <p v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </p>

      <div class="form-footer">
        <p class="login-link">
          <i class="fas fa-sign-in-alt"></i>
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'Register',
    data() {
      return {
        formData: {
          username: '',
          email: '',
          password: ''
        },
        error: ''
      }
    },
    methods: {
      async handleRegister() {
        try {
          const response = await fetch('http://localhost:7904/api/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formData)
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          // Redirect to OTP verification with email
          this.$router.push({
            path: '/verify-otp',
            query: { email: this.formData.email }
          });
        } catch (err) {
          this.error = err.message;
        }
      }
    }
  }
  </script>
  
  <style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0f2e9 100%);
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.input-group {
  position: relative;
  margin-top: 0.5rem;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4CAF50;
}

input {
  width: 83%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.register-btn {
  width: 100%;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.register-btn:hover {
  background: linear-gradient(45deg, #45a049, #3d8b40);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fdecea;
  border-radius: 6px;
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
}

.login-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #666;
}

a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

a:hover {
  color: #45a049;
  text-decoration: underline;
}
</style>