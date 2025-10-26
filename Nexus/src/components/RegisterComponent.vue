<template>
  <div class="register-container">
    <div style="margin-bottom: 60px" class="row items-center justify-center">
      <div
        style="width: 46px; height: 46px; border-radius: 16px"
        class="row items-center justify-center bg-gradient-secondary"
      >
        <img src="~assets/Icon.svg" alt="Icon" width="24px" height="24px" />
      </div>
      <p style="font-weight: 700" class="text-white text-h3 q-ma-none q-ml-sm">Nexus</p>
    </div>

    <div class="register-form">
      <q-input
        v-model="registerData.name"
        label="Name"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        @blur="validateName"
      />
      <div v-if="nameError" class="error-message">{{ nameError }}</div>

      <q-input
        v-model="registerData.email"
        label="Email"
        type="email"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        @blur="validateEmail"
      />
      <div v-if="emailError" class="error-message">{{ emailError }}</div>

      <q-input
        v-model="registerData.nickname"
        label="Nickname"
        type="text"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        @blur="validateNickname"
      />
      <div v-if="nicknameError" class="error-message">{{ nicknameError }}</div>

      <q-input
        v-model="registerData.password"
        label="Password"
        type="password"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        @blur="validatePassword"
      />
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

      <q-btn
        color="primary"
        label="Register"
        class="full-width q-mb-md q-py-sm"
        size="md"
        @click="handleRegister"
      />

      <div class="text-center">
        <span style="color: rgba(255, 255, 255, 0.8)">Already have an account? </span>
        <span class="account-link text-white cursor-pointer q-pl-xs" @click="switchToLogin"
          >Sign Up!</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const registerData = ref({
  nickname: '',
  name: '',
  email: '',
  password: '',
  // confirmPassword: '',
});

const nicknameError = ref('');
const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
// const confirmPasswordError = ref('');

function validateName() {
  if (!registerData.value.name) {
    nameError.value = 'Name is required';
  } else if (registerData.value.name.length < 2) {
    nameError.value = 'Name must be at least 2 characters';
  } else {
    nameError.value = '';
  }
}

function validateEmail() {
  if (!registerData.value.email) {
    emailError.value = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.value.email)) {
    emailError.value = 'Please enter a valid email';
  } else {
    emailError.value = '';
  }
}
function validateNickname() {
  if (!registerData.value.nickname) {
    nicknameError.value = 'Nickname is required';
  } else if (registerData.value.nickname.length < 2) {
    nicknameError.value = 'Nickname must be at least 3 characters';
  } else {
    nicknameError.value = '';
  }
}

function validatePassword() {
  if (!registerData.value.password) {
    passwordError.value = 'Password is required';
  } else if (registerData.value.password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters';
  } else {
    passwordError.value = '';
  }
}

// function validateConfirmPassword() {
//   if (!registerData.value.confirmPassword) {
//     confirmPasswordError.value = 'Please confirm your password';
//   } else if (registerData.value.password !== registerData.value.confirmPassword) {
//     confirmPasswordError.value = 'Passwords do not match';
//   } else {
//     confirmPasswordError.value = '';
//   }
// }

function switchToLogin() {
  router.push('/auth/login').catch(() => {
    console.error('Failed to navigate to login');
  });
}

function handleRegister() {
  nameError.value = '';
  emailError.value = '';
  nicknameError.value = '';
  passwordError.value = '';
  // confirmPasswordError.value = '';
  validateName();
  validateEmail();
  validateNickname();
  validatePassword();
  // validateConfirmPassword();

  if (
    nameError.value ||
    emailError.value ||
    nicknameError.value ||
    passwordError.value
    // || confirmPasswordError.value
  ) {
    return;
  }

  router.push('/chat').catch(() => {
    console.error('Failed to navigate to chat');
  });
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';

.register-container {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
}

.register-form {
  width: 100%;
}

:deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.8) !important;
  padding-left: 10px !important;
}

:deep(.q-field__control) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 100px !important;
}

:deep(.q-field__native) {
  color: white !important;
}

:deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

:deep(.q-field--focused .q-field__control:before) {
  border-color: #1976d2 !important;
}

:deep(.q-btn) {
  border-radius: 100px !important;
  text-transform: none !important;
}

.account-link {
  text-decoration: underline;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: left;
}
</style>
