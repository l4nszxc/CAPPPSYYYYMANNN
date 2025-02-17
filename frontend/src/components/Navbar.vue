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
      <div class="profile-dropdown" ref="profileDropdown">
        <div class="profile-trigger" @click="toggleDropdown">
          <img 
            :src="profileImage" 
            alt="Profile" 
            class="profile-image"
          >
          <span class="username">{{ username }}</span>
          <i class="fas fa-chevron-down dropdown-icon"></i>
        </div>
        
        <div v-show="showDropdown" class="dropdown-menu">
          <router-link to="/profile" class="dropdown-item">
            <i class="fas fa-user"></i> Profile
          </router-link>
          <div class="dropdown-divider"></div>
          <button @click="$emit('logout')" class="dropdown-item" data-action="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
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
  },
  data() {
    return {
      showDropdown: false,
      profileImage: 'https://ui-avatars.com/api/?name=' + this.username + '&background=random'
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown(event) {
      if (!this.$refs.profileDropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  },
  watch: {
    username(newUsername) {
      this.profileImage = 'https://ui-avatars.com/api/?name=' + newUsername + '&background=random';
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  color: #4CAF50;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #4CAF50;
  background-color: #f5f5f5;
}

.navbar-end {
  display: flex;
  align-items: center;
}

.profile-dropdown {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.profile-trigger:hover {
  background-color: #f5f5f5;
}

.profile-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  color: #333;
  font-weight: 500;
}

.dropdown-icon {
  color: #666;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.profile-trigger:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-top: 0.5rem;
  min-width: 200px;
  padding: 0.5rem 0;
  animation: dropdownFade 0.2s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
  color: #4CAF50;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 0.5rem 0;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.dropdown-item[data-action="logout"],
button.dropdown-item {
  color: #dc3545; /* Red text color */
}

.dropdown-item[data-action="logout"]:hover,
button.dropdown-item:hover {
  background-color: #fdf1f2; /* Light red background on hover */
  color: #dc3545; /* Keep text red on hover */
}
/* Responsive styles */
@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 1rem;
  }

  .navbar-menu {
    display: none;
  }

  .username {
    display: none;
  }
}
</style>