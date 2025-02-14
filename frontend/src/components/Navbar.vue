<template>
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/home" class="logo">
          Dashboard
        </router-link>
      </div>
  
      <div class="navbar-menu">
        <router-link to="/home" class="nav-link">Home</router-link>
        <router-link to="/profile" class="nav-link">Profile</router-link>
        <router-link to="/settings" class="nav-link">Settings</router-link>
      </div>
  
      <div class="navbar-end">
        <span class="username">{{ username }}</span>
        <button @click="$emit('logout')" class="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    props: {
      username: {
        type: String,
        default: 'User'
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: #4CAF50;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .navbar-brand {
    display: flex;
    align-items: center;
  }
  
  .logo {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
  }
  
  .navbar-menu {
    display: flex;
    gap: 2rem;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .navbar-end {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .username {
    color: white;
    font-weight: 500;
  }
  
  .logout-btn {
    background-color: white;
    color: #4CAF50;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #f0f0f0;
  }
  
  @media (max-width: 768px) {
    .navbar {
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }
  
    .navbar-menu {
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      text-align: center;
    }
  
    .navbar-end {
      width: 100%;
      justify-content: center;
    }
  }
  </style>