<template>
  <div class="login-container">
    <div style="margin-bottom: 60px" class="row items-center justify-center">
      <div
        style="width: 46px; height: 46px; border-radius: 16px"
        class="row items-center justify-center bg-gradient-secondary q-mr-xs"
      >
        <img src="~assets/Icon.svg" alt="Icon" width="24px" height="24px" />
      </div>
      <p style="font-weight: 700" class="text-white text-h3 q-ma-none q-ml-sm">Nexus</p>
    </div>

    <div class="login-form">
      <q-input
        v-model="email"
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
        v-model="password"
        label="Password"
        type="password"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        @blur="validatePassword"
        @keyup.enter="handleLogin"
      />
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

      <q-btn
        push
        color="primary"
        label="Log In"
        class="full-width q-mb-md q-py-sm"
        size="md"
        @click="handleLogin"
      />

      <div class="text-center">
        <span style="color: rgba(255, 255, 255, 0.8)">No account? </span>
        <span class="account-link text-white cursor-pointer q-pl-xs" @click="switchToRegister"
          >Create one!</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');

function validateEmail() {
  if (!email.value) {
    emailError.value = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email';
  } else {
    emailError.value = '';
  }
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Password is required';
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters';
  } else {
    passwordError.value = '';
  }
}

function switchToRegister() {
  router.push('/auth/register').catch(() => {
    console.error('Failed to navigate to register');
  });
}

function handleLogin() {
  emailError.value = '';
  passwordError.value = '';

  validateEmail();
  validatePassword();

  if (emailError.value || passwordError.value) {
    return;
  }

  router.push('/chat').catch(() => {
    console.error('Failed to navigate to chat');
  });
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
}

.login-form {
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
