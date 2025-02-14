<template>
    <nav class="admin-navbar">
      <div class="nav-brand">
        <h1>Admin Dashboard</h1>
      </div>
      <div class="nav-menu">
        <span class="admin-name">Welcome, {{ username }}</span>
        <button @click="$emit('logout')" class="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'AdminNavbar',
    props: {
      username: {
        type: String,
        default: 'Admin'
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-navbar {
    background-color: #2c3e50;
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
  
  .admin-name {
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
  </style>