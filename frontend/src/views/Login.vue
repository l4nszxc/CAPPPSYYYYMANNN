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
        error: ''
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
            throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            this.$router.push('/home');
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
  </style>