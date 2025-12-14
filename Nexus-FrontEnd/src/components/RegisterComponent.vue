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
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input
            v-model="registerData.firstName"
            label="First Name"
            outlined
            dark
            class="q-mb-md"
            :input-style="{ color: 'white', paddingLeft: '8px' }"
            :disable="loading"
            @blur="validateFirstName"
          />
          <div v-if="firstNameError" class="error-message">{{ firstNameError }}</div>
        </div>
        <div class="col-6">
          <q-input
            v-model="registerData.lastName"
            label="Last Name"
            outlined
            dark
            class="q-mb-md"
            :input-style="{ color: 'white', paddingLeft: '8px' }"
            :disable="loading"
            @blur="validateLastName"
          />
          <div v-if="lastNameError" class="error-message">{{ lastNameError }}</div>
        </div>
      </div>

      <q-input
        v-model="registerData.email"
        label="Email"
        type="email"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        :disable="loading"
        @blur="validateEmail"
      />
      <div v-if="emailError" class="error-message">{{ emailError }}</div>

      <q-input
        v-model="registerData.nickName"
        label="Nickname"
        type="text"
        outlined
        dark
        class="q-mb-md"
        :input-style="{ color: 'white', paddingLeft: '8px' }"
        :disable="loading"
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
        :disable="loading"
        @blur="validatePassword"
        @keyup.enter="handleRegister"
      />
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

      <div v-if="generalError" class="error-message q-mb-md">{{ generalError }}</div>

      <q-btn
        color="primary"
        label="Register"
        class="full-width q-mb-md q-py-sm"
        size="md"
        :loading="loading"
        :disable="loading"
        @click="handleRegister"
      />

      <div class="text-center">
        <span style="color: rgba(255, 255, 255, 0.8)">Already have an account? </span>
        <span class="account-link text-white cursor-pointer q-pl-xs" @click="switchToLogin"
          >Sign In!</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth/auth';

const router = useRouter();
const auth = useAuthStore();

const registerData = ref({
  firstName: '',
  lastName: '',
  nickName: '',
  email: '',
  password: '',
});

const firstNameError = ref('');
const lastNameError = ref('');
const nicknameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const generalError = ref('');
const loading = ref(false);

function validateFirstName() {
  if (!registerData.value.firstName) {
    firstNameError.value = 'First name is required';
  } else if (registerData.value.firstName.length < 2) {
    firstNameError.value = 'First name must be at least 2 characters';
  } else {
    firstNameError.value = '';
  }
}

function validateLastName() {
  if (!registerData.value.lastName) {
    lastNameError.value = 'Last name is required';
  } else if (registerData.value.lastName.length < 2) {
    lastNameError.value = 'Last name must be at least 2 characters';
  } else {
    lastNameError.value = '';
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
  if (!registerData.value.nickName) {
    nicknameError.value = 'Nickname is required';
  } else if (registerData.value.nickName.length < 3) {
    nicknameError.value = 'Nickname must be at least 3 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(registerData.value.nickName)) {
    nicknameError.value = 'Nickname can only contain letters, numbers and underscores';
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

function switchToLogin() {
  router.push('/auth/login').catch(() => {
    console.error('Failed to navigate to login');
  });
}

async function handleRegister() {
  firstNameError.value = '';
  lastNameError.value = '';
  emailError.value = '';
  nicknameError.value = '';
  passwordError.value = '';
  generalError.value = '';

  validateFirstName();
  validateLastName();
  validateEmail();
  validateNickname();
  validatePassword();

  if (
    firstNameError.value ||
    lastNameError.value ||
    emailError.value ||
    nicknameError.value ||
    passwordError.value
  ) {
    return;
  }

  loading.value = true;

  try {
    await auth.register(
      registerData.value.email,
      registerData.value.password,
      registerData.value.firstName,
      registerData.value.lastName,
      registerData.value.nickName
    );
    router.push('/chat').catch(() => {
      console.error('Failed to navigate to chat');
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('nickname') || error.message.includes('nick_name')) {
        nicknameError.value = 'This nickname is already taken';
      } else if (error.message.includes('email')) {
        emailError.value = 'This email is already registered';
      } else {
        generalError.value = error.message;
      }
    } else {
      generalError.value = 'Registration failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';

.register-container {
  max-width: 450px;
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
