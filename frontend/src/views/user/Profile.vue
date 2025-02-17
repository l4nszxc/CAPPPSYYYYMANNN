<template>
  <div class="profile-container">
    <Navbar
      :username="username"
      @logout="showLogoutModal = true"
    />

    <div class="profile-content">
      <div class="profile-card">
        <h2>My Profile</h2>
        
        <!-- Add notification component -->
        <div v-if="notification.show" 
             :class="['notification', notification.type]">
          {{ notification.message }}
        </div>

        <div class="profile-picture-section">
          <div class="profile-picture-container">
            <img 
              :src="profilePictureUrl" 
              alt="Profile Picture"
              class="profile-picture"
            >
        <div v-if="isEditing" class="upload-overlay">
          <label for="profile-picture-input" class="upload-button">
            <i class="fas fa-camera"></i>
            Change Picture
          </label>
          <input
            type="file"
            id="profile-picture-input"
            accept="image/*"
            @change="handleProfilePictureChange"
            style="display: none"
          >
        </div>
      </div>
    </div>

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
              <select
                v-model="profileData.gender"
                :disabled="!isEditing"
                class="select-input"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
          </div>

          <!-- Contact Information -->
          <div class="info-section">
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
            <div class="info-group">
              <label>Civil Status</label>
              <select
                v-model="profileData.civil_status"
                :disabled="!isEditing"
                class="select-input"
              >
                <option value="">Select civil status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="divorced">Divorced</option>
                <option value="separated">Separated</option>
              </select>
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
        defaultProfilePicture: 'https://ui-avatars.com/api/?name=' + this.username + '&background=random',
        showLogoutModal: false,
        isEditing: false,
        notification: {
            show: false,
            message: '',
            type: 'success'
            
        },
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
        created_at: '',
        role: ''
      }
    }
  },
  computed: {
    profilePictureUrl() {
      if (this.profileData.profile_picture) {
        return `http://localhost:7904${this.profileData.profile_picture}`;
      }
      return this.defaultProfilePicture;
    }
  },
  methods: {
    showNotification(message, type = 'success') {
        this.notification = {
            show: true,
            message,
            type
        };
        
    },
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

          const data = await response.json();

          if (response.ok) {
              if (data.token) {
                  localStorage.setItem('token', data.token);
              }
              
              this.isEditing = false;
              this.showNotification('Profile updated successfully', 'success');
              await this.fetchProfile();
              
              setTimeout(() => {
                  window.location.reload();
              }, 1000); 
          } else {
              throw new Error('Failed to update profile');
          }
      } catch (error) {
          console.error('Error updating profile:', error);
          this.showNotification('Failed to update profile. Please try again.', 'error');
      }
  },
  async handleProfilePictureChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7904/api/users/upload-profile-picture', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          this.profileData.profile_picture = data.imageUrl;
          this.$emit('profile-updated'); 
          this.showNotification('Profile picture updated successfully', 'success');
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        this.showNotification('Failed to upload profile picture', 'error');
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
.notification {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    text-align: center;
}

.notification.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.notification.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
.select-input {
  width: 103.5%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  background-color: white;
  cursor: pointer;
}

.select-input:disabled {
  background-color: #eee;
  cursor: not-allowed;
}

/* Add custom dropdown arrow */
.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.2rem center;
  background-size: 1em;
  padding-right: 2rem;
}
.profile-picture-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.profile-picture-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;
  text-align: center;
  transition: opacity 0.3s ease;
}

.upload-button {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.upload-button:hover {
  text-decoration: underline;
}
</style>