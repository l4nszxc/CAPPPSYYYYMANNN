<template>
    <div class="profile-container">
      <Navbar 
        :username="username"
        @logout="showLogoutModal = true"
      />
      
      <div class="profile-content">
        <div class="profile-card">
          <h2>My Profile</h2>
          
          <div class="profile-grid">
            <!-- Basic Information -->
            <div class="info-section">
              <h3>Basic Information</h3>
              <div class="info-group">
                <label>Username</label>
                <p>{{ profileData.username }}</p>
              </div>
              <div class="info-group">
                <label>Full Name</label>
                <p>{{ formatFullName(profileData.firstname, profileData.middlename, profileData.lastname) }}</p>
              </div>
              <div class="info-group">
                <label>Gender</label>
                <p>{{ capitalizeFirst(profileData.gender) }}</p>
              </div>
              <div class="info-group">
                <label>Civil Status</label>
                <p>{{ capitalizeFirst(profileData.civil_status) }}</p>
              </div>
              <div class="info-group">
                <label>Birthdate</label>
                <p>{{ formatDate(profileData.birthdate) }}</p>
              </div>
            </div>
  
            <!-- Contact Information -->
            <div class="info-section">
              <h3>Contact Information</h3>
              <div class="info-group">
                <label>Email</label>
                <p>{{ profileData.email }}</p>
                <span class="verification-status" :class="profileData.email_verified ? 'verified' : 'unverified'">
                  {{ profileData.email_verified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
              <div class="info-group">
                <label>Phone Number</label>
                <p>{{ profileData.phone_number }}</p>
              </div>
              <div class="info-group">
                <label>Address</label>
                <p>{{ profileData.address }}</p>
              </div>
            </div>
  
            <!-- Account Information -->
            <div class="info-section">
              <h3>Account Information</h3>
              <div class="info-group">
                <label>Member Since</label>
                <p>{{ formatDate(profileData.created_at) }}</p>
              </div>
              <div class="info-group">
                <label>Account Type</label>
                <p>{{ capitalizeFirst(profileData.role) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <LogoutModal 
        :show="showLogoutModal"
        @confirm="handleLogout"
        @cancel="showLogoutModal = false"
      />
    </div>
  </template>
  
  <script>
  import Navbar from '../../components/Navbar.vue'
  import LogoutModal from '../../components/LogoutModal.vue'
  
  export default {
    name: 'Profile',
    components: {
      Navbar,
      LogoutModal
    },
    data() {
      return {
        username: '',
        showLogoutModal: false,
        profileData: {
          username: '',
          firstname: '',
          middlename: '',
          lastname: '',
          gender: '',
          civil_status: '',
          phone_number: '',
          address: '',
          birthdate: '',
          email: '',
          email_verified: false,
          created_at: '',
          role: ''
        }
      }
    },
    methods: {
      formatFullName(firstname, middlename, lastname) {
        const middle = middlename ? ` ${middlename} ` : ' '
        return firstname && lastname ? `${firstname}${middle}${lastname}` : 'N/A'
      },
      capitalizeFirst(str) {
        if (!str) return 'N/A'
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      },
      formatDate(date) {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      async fetchProfile() {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:7904/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
  
          if (response.ok) {
            const data = await response.json()
            this.profileData = data
            this.username = data.username
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      },
      async handleLogout() {
        try {
          const response = await fetch('http://localhost:7904/api/users/logout', {
            method: 'POST',
            credentials: 'include'
          })
  
          if (response.ok) {
            localStorage.removeItem('token')
            this.$router.push('/login')
          }
        } catch (error) {
          console.error('Logout failed:', error)
        }
      }
    },
    mounted() {
      this.fetchProfile()
    }
  }
  </script>
  
  <style scoped>
  .profile-container {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .profile-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .profile-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .info-section {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .info-section h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.2rem;
  }
  
  .info-group {
    margin-bottom: 1.2rem;
  }
  
  .info-group label {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  
  .info-group p {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
  }
  
  .verification-status {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }
  
  .verified {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .unverified {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  @media (max-width: 768px) {
    .profile-content {
      padding: 1rem;
    }
  
    .profile-card {
      padding: 1.5rem;
    }
  
    .profile-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
  </style>