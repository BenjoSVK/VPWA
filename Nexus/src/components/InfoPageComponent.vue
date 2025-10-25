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
          placeholder="Type a command (e.g., /help, /status, /join <groupname> [private])"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const groups = useGroupsStore();
const router = useRouter();
const commandInput = ref('');

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
    command: '/join <groupname> [private]',
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
  let message = '';
  
  if (command.startsWith('/join ')) {
    let groupName = command.substring(6).trim(); // Remove '/join ' prefix
    let isPrivate = false;
    
    // Check if the last word is "private" and remove it
    if (groupName.endsWith(' private')) {
      groupName = groupName.slice(0, -8); // Remove " private" (8 characters)
      isPrivate = true;
    }
    
    if (groupName) {
      const existingGroup = groups.groups?.find(g => g.name === groupName);
      if (!existingGroup) {

        groups.addGroup(groupName, isPrivate);
        const channelType = isPrivate ? 'private' : 'public';
        message = `Created and joined ${groupName} ${channelType} channel!`;
      } else {
        groups.setSelected(existingGroup.id);
        message = `Joined ${groupName} channel!`;
      }
      router.push('/chat').catch(() => {
        console.error('Failed to navigate to chat');
      });
    } else {
      message = 'Please specify a group name. Usage: /join <groupname> [private]';
    }
  } else {
    switch (command) {
      case '/help':
        message = 'Available commands: /help, /join <groupname> [private], /leave, /users, /status, /clear';
        break;
    case '/leave':
      groups.setSelected('');
      message = 'You have left the current channel.';
      break;
    case '/users':
      message = 'You need to be in a channel to see users. Use /join <groupname> to join a channel first.';
      break;
    case '/status':
      message = 'Status: Online | Last seen: Now';
      break;
    case '/clear':
      message = 'You need to be in a channel to clear history. Use /join <groupname> to join a channel first.';
      break;
    default:
      message = `Unknown command: ${commandInput.value}. Type /help for available commands.`;
    }
  }
  
  $q.notify({
    message: message,
    position: 'top',
    timeout: 4000,
    color: 'primary',
    textColor: 'white',
    classes: 'q-pa-md',
    actions: [
      {
        label: '×',
        color: 'white',
        round: true,
        handler: () => {}
      }
    ]
  });
  
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
