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
            <div class="info-group">
              <label>Username</label>
              <input
                type="text"
                v-model="profileData.username"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>First Name</label>
              <input
                type="text"
                v-model="profileData.firstname"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Middle Name</label>
              <input
                type="text"
                v-model="profileData.middlename"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Last Name</label>
              <input
                type="text"
                v-model="profileData.lastname"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Gender</label>
              <input
                type="text"
                v-model="profileData.gender"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Civil Status</label>
              <input
                type="text"
                v-model="profileData.civil_status"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Birthdate</label>
              <input
                type="date"
                v-model="profileData.birthdate"
                :disabled="!isEditing"
              />
            </div>
          </div>

          <!-- Contact Information -->
          <div class="info-section">
            <div class="info-group">
              <label>Email</label>
              <input
                type="text"
                v-model="profileData.email"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Phone Number</label>
              <input
                type="text"
                v-model="profileData.phone_number"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-group">
              <label>Address</label>
              <input
                type="text"
                v-model="profileData.address"
                :disabled="!isEditing"
              />
            </div>
          </div>
        </div>
        <button @click="toggleEditing" class="edit-button">
          {{ isEditing ? 'Save Profile' : 'Edit Profile' }}
        </button>
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
      isEditing: false,
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
    formatDateForDB(date) {
      if (!date) return null;
      return new Date(date).toISOString().split('T')[0];
    },
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
          // Format the birthdate to YYYY-MM-DD for the date input
          if (data.birthdate) {
            data.birthdate = new Date(data.birthdate).toISOString().split('T')[0]
          }
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
    },
    toggleEditing() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.saveProfile();
      }
    },
    async saveProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7904/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: this.profileData.username,
            firstname: this.profileData.firstname,
            middlename: this.profileData.middlename,
            lastname: this.profileData.lastname,
            gender: this.profileData.gender,
            civil_status: this.profileData.civil_status,
            phone_number: this.profileData.phone_number,
            address: this.profileData.address,
            birthdate: this.profileData.birthdate 
          })
        });

        if (response.ok) {
          this.isEditing = false;
          alert('Profile updated successfully');
          await this.fetchProfile();
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
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


.info-group {
  margin-bottom: 1.2rem;
}

.info-group label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.info-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.info-group input:disabled {
  background-color: #eee;
  cursor: not-allowed;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
.info-group input[type="date"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.info-group input[type="date"]:disabled {
  background-color: #eee;
  cursor: not-allowed;
}
</style>