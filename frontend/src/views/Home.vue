<template>
    <div class="home-container">
      <nav class="navbar">
        <h1>Welcome {{ username }}</h1>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </nav>
      <div class="content">
        <h2>Dashboard</h2>
        <p>Welcome to your dashboard! This is your protected home page.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
    data() {
      return {
        username: 'User' // This should be updated with actual user data
      }
    },
    methods: {
      handleLogout() {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        this.$router.push('/login');
      }
    },
    // Add navigation guard to check if user is authenticated
    beforeMount() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style scoped>
  .home-container {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .navbar {
    background-color: #4CAF50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logout-btn {
    background-color: white;
    color: #4CAF50;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .logout-btn:hover {
    background-color: #f0f0f0;
  }
  </style>