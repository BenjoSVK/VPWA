<template>
  <div class="q-pa-lg q-pt-xl" style="max-width: 800px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column;">
    <div class="text-center q-mb-xl">
      <div class="row items-center justify-center q-mb-md">
        <div class="logo-icon">
          <img src="~assets/Icon.svg" alt="Nexus" width="32" height="32" />
        </div>
        <h1 class="q-ml-md text-h4 text-weight-bold q-ma-none">Nexus</h1>
      </div>
    </div>
      
      <div class="q-mb-lg">
        <h3 class="text-h6 text-weight-bold q-mb-md">General Commands</h3>
        <div class="column q-gutter-sm">
          <div v-for="(cmd, index) in generalCommands" :key="index" class="row items-center q-pa-md bg-grey-1 rounded-borders" style="border: 1px solid #E5E7EB;">
            <q-chip 
              :label="cmd.command" 
              color="primary" 
              text-color="white" 
              class="q-mr-sm"
            />
            <span class="text-body2">{{ cmd.description }}</span>
          </div>
        </div>

      <div class="q-my-lg">
        <h3 class="text-h6 text-weight-bold q-mb-md">Channel Commands</h3>
        <div class="column q-gutter-sm">
          <div v-for="(cmd, index) in channelCommands" :key="index" class="row items-center q-pa-md bg-grey-1 rounded-borders" style="border: 1px solid #E5E7EB;">
            <q-chip 
              :label="cmd.command" 
              color="green" 
              text-color="white" 
              class="q-mr-sm"
            />
            <span class="text-body2">{{ cmd.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="q-mt-lg">
      <h3 class="text-h6 text-weight-bold text-center q-mb-md">Try a command:</h3>
      <div class="row items-center q-pb-md q-px-md">
        <q-input
          v-model="commandInput"
          rounded
          outlined
          placeholder="Type a command (e.g., /help, /status, /join #general)"
          class="q-py-md q-pl-sm q-pr-md col"
          input-style="padding-left: 12px"
          @keyup.enter="executeCommand"
        >
          <template #append>
            <q-btn flat class="q-pa-none">
              <img src="src/assets/EmojiIcon.svg" alt="emoji" />
            </q-btn>
          </template>
        </q-input>
        <q-btn 
          class="bg-primary q-pa-md q-mx-xs" 
          rounded
          @click="executeCommand"
          :disable="!commandInput.trim()"
        >
          <img src="/src/assets/Icon_sent.svg" style="transform: translate(-1px, 1px)" />
        </q-btn>
      </div>
      <div v-if="commandOutput" class="bg-grey-9 text-white q-pa-md rounded-borders">
        <div class="text-body2 font-mono">{{ commandOutput }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const commandInput = ref('');
const commandOutput = ref('');

const generalCommands = ref([
  {
    command: '/help',
    description: 'Show this help message'
  },
  {
    command: '/status',
    description: 'Show your current status (online/offline/DND)'
  },
  {
    command: '/join channelName [private]',
    description: 'Join or create a channel (add \'private\' for private channel)'
  }
]);

const channelCommands = ref([
  {
    command: '/invite nickName',
    description: 'Invite user to current channel'
  },
  {
    command: '/revoke nickName',
    description: 'Remove user from channel (admin only)'
  },
  {
    command: '/kick nickName',
    description: 'Kick user from channel (3+ members or admin)'
  },
  {
    command: '/list',
    description: 'List all members in current channel'
  },
  {
    command: '/cancel',
    description: 'Leave current channel'
  },
  {
    command: '/quit',
    description: 'Close/delete current channel (admin only)'
  },
  {
    command: '@nickName message',
    description: 'Send message to specific user'
  }
]);

function executeCommand() {
  if (!commandInput.value.trim()) return;

  const command = commandInput.value.toLowerCase().trim();
  
  switch (command) {
    case '/help':
      commandOutput.value = 'Available commands: /help, /join #channel, /leave, /users, /status, /clear';
      break;
    case '/join #general':
      commandOutput.value = 'Joining #general channel...';
      break;
    case '/leave':
      commandOutput.value = 'You have left the current channel.';
      break;
    case '/users':
      commandOutput.value = 'Online users: John, Jane, Mike, Sarah (4 users online)';
      break;
    case '/status':
      commandOutput.value = 'Status: Online | Last seen: Now';
      break;
    case '/clear':
      commandOutput.value = 'Chat history cleared.';
      break;
    default:
      commandOutput.value = `Unknown command: ${commandInput.value}. Type /help for available commands.`;
  }
  
  commandInput.value = '';
}
</script>

<style lang="scss" scoped>
.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8B5CF6 0%, #155DFC 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
