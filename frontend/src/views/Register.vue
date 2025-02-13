<template>
    <div class="register-container">
      <div class="register-card">
        <h2>Create Account</h2>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              required
              placeholder="Enter username"
            />
          </div>
          
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
  
          <button type="submit" class="register-btn">Register</button>
        </form>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p class="login-link">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>
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
  
          // Registration successful
          this.$router.push('/login');
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
    background-color: #f5f5f5;
  }
  
  .register-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .register-form {
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
  
  .register-btn {
    background-color: #4CAF50;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
  }
  
  .register-btn:hover {
    background-color: #45a049;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  
  .login-link {
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