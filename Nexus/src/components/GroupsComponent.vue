<template>
  <q-drawer
    class="bg-gradient-primary"
    :width="370"
    :mini-width="80"
    :mini="drw.isMini"
    v-model="drw.isOpen"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="column full-height" style="height: 100dvh">
      <!-- Header -->
      <div
        class="items-center row q-pt-md header-section"
        :class="{
          'q-px-lg': !drw.isMini,
          'justify-center': drw.isMini,
          'justify-between': !drw.isMini,
        }"
        @click="goToInfoPage"
        style="cursor: pointer"
      >
        <div
          class="bg-gradient-secondary row q-pa-sm border-rad easy-out"
          :class="{ 'label-col--mini': drw.isMini }"
        >
          <img :src="brandIcon" alt="Icon" />
        </div>

        <q-item-label
          class="text-h6 text-light q-pl-md text-weight-bold q-mr-auto"
          :class="{ 'label-col--mini': drw.isMini }"
          header
          >Nexus</q-item-label
        >
        <button
          class="border-rad flex q-pa-xs"
          @click.stop="drw.toggleMini"
          aria-label="Menu"
          style="background-color: rgba(255, 255, 255, 0.1); cursor: pointer"
        >
          <img :src="menuIcon" alt="menu-icon" class="q-pa-sm" />
        </button>
      </div>

      <div class="col" style="flex: 1; display: flex; flex-direction: column; min-height: 0">
        <q-list padding>
          <q-item dense class="items-center q-px-lg easy-out justify-center flex">
            <q-item-section avatar class="items-center q-pr-sm">
              <img src="/src/assets/groups.svg" width="25" height="25" />
            </q-item-section>
            <q-item-section :class="{ 'label-col--mini': drw.isMini }">
              <q-item-label class="text-weight-medium text-h6 text-white">Skupiny</q-item-label>
            </q-item-section>
            <q-item-section side :class="{ 'label-col--mini': drw.isMini }">
              <q-btn
                rounded
                flat
                size="sm"
                color="grey"
                class="flex items-center justify-center q-pa-xs easy-out"
                @click.stop="dialog = true"
                ><q-icon name="img:src/assets/plus.svg" size="20px" />

                <q-dialog v-model="dialog" :backdrop-filter="'blur(3px) saturate(150%)'">
                  <q-card style="border-radius: 20px" @click.stop>
                    <!-- Create Group Header -->
                    <q-card-section class="column text-h6 bg-gradient-secondary q-pb-sm text-light">
                      <div class="row items-center">
                        <q-icon name="img:../src/assets/star.svg" size="40px" class="q-mr-sm" />
                        Vytvoriť novú skupinu
                        <q-btn flat rounded v-close-popup class="q-ml-auto q-px-xs" size="sm">
                          <q-icon
                            name="img:src/assets/close.svg"
                            size="20px"
                            style="filter: brightness(0) invert(1) opacity(0.5)"
                          />
                        </q-btn>
                      </div>
                      <div class="row items-center text-subtitle2 text-grey-4 q-pt-md q-pb-sm">
                        Nastavte novú konverzáciu a pozvite členov vášho tímu.
                      </div>
                    </q-card-section>

                    <!-- Group Name Input -->
                    <q-card-section class="row items-center q-pb-xs">
                      <p class="text-weight-medium text-subtitle+ q-pa-none q-ma-none">
                        <q-icon
                          name="img:/src/assets/Icon.svg"
                          size="15px"
                          class="q-mb-xs"
                          style="
                            filter: brightness(0) saturate(100%) invert(48%) sepia(79%)
                              saturate(2476%) hue-rotate(200deg) brightness(118%) contrast(119%);
                          "
                        />
                        Názov skupiny *
                      </p></q-card-section
                    >
                    <q-card-section class="q-pt-none q-pb-md">
                      <q-input
                        borderless
                        v-model="groupName"
                        placeholder="Názov skupiny"
                        class="border-rad q-pl-sm"
                        style="
                          border: 1px solid #e5e7eb;
                          box-shadow:
                            0 1px 2px -1px rgba(0, 0, 0, 0.1),
                            0 1px 3px 0px rgba(0, 0, 0, 0.14);
                        "
                      />
                    </q-card-section>

                    <!-- Group Type Selection -->
                    <q-card-section class="q-py-none">
                      <p class="text-weight-medium text-subtitle1 q-pa-none q-ma-none">
                        Typ skupiny *
                      </p>
                      <div class="row items-center justify-between q-gutter-md">
                        <q-card
                          bordered
                          :flat="clickedCard !== 'public'"
                          class="border-rad cursor-pointer"
                          :class="clickedCard === 'public' ? ' border-blue-500' : 'bg-white'"
                          @click.stop="clickedCard = 'public'"
                        >
                          <q-card-section class="column">
                            <div class="row justify-between">
                              <q-icon
                                name="img:/src/assets/public.svg"
                                size="25px"
                                class="border-rad q-pa-sm q-mb-sm"
                                style="background-color: #dbeafe"
                              />
                              <q-icon
                                v-show="clickedCard === 'public'"
                                name="img:/src/assets/check.svg"
                                class="bg-tertiary q-pa-xs"
                                style="border-radius: 50%"
                                size="20px"
                              />
                            </div>
                            <div class="text-subtitle1 text-weight-medium">Public</div>
                            <div class="text-subtitle2 text-grey-6">
                              Otvorená pre všetkých používateľov
                            </div>
                          </q-card-section>
                        </q-card>
                        <q-card
                          bordered
                          :flat="clickedCard !== 'private'"
                          class="border-rad cursor-pointer"
                          :class="clickedCard === 'private' ? 'border-orange-500 bg-orange-1' : ''"
                          @click.stop="clickedCard = 'private'"
                        >
                          <q-card-section class="column">
                            <div class="row justify-between">
                              <q-icon
                                name="img:/src/assets/Lock.svg"
                                size="25px"
                                class="border-rad q-pa-sm q-mb-sm bg-orange-2"
                                :class="clickedCard === 'private' ? 'bg-orange-7' : ''"
                              />
                              <q-icon
                                v-if="clickedCard === 'private'"
                                name="img:/src/assets/check.svg"
                                class="bg-orange-7 q-pa-xs"
                                style="border-radius: 50%"
                                size="20px"
                              />
                            </div>
                            <div class="text-subtitle1 text-weight-medium">Private</div>
                            <div class="text-subtitle2 text-grey-6">Len pozvaní členovia</div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </q-card-section>

                    <!-- User Selection -->
                    <q-card-section class="q-py-sm">
                      <p class="text-weight-medium text-subtitle1 q-pa-none q-mt-sm q-mb-none">
                        <q-icon
                          name="img:/src/assets/users.svg"
                          size="15px"
                          class="q-mr-xs q-mb-xs"
                        />
                        Pridať členov
                      </p>
                      <div class="q-mt-sm border-rad">
                        <q-scroll-area
                          style="height: 200px; border: 1px solid #e5e7eb"
                          class="border-rad q-pa-xs"
                          :bar-style="{ backgroundColor: 'transparent', width: '6px' }"
                          :thumb-style="{
                            borderRadius: '20px',
                            width: '6px',
                          }"
                        >
                          <q-list dense>
                            <q-item
                              v-for="user in availableUsers"
                              :key="user.id"
                              clickable
                              v-ripple
                              @click="toggleUserSelection(user.id)"
                              :class="selectedUsers.includes(user.id) ? 'bg-blue-1' : ''"
                              class="border-rad q-mb-xs"
                            >
                              <q-item-section side>
                                <q-checkbox
                                  v-model="selectedUsers"
                                  :val="user.id"
                                  color="primary"
                                  @click.stop
                                />
                              </q-item-section>
                              <q-item-section avatar>
                                <q-avatar size="32px">
                                  <img
                                    :src="user.icon || '/src/assets/UserDefault.svg'"
                                    :alt="user.name"
                                  />
                                </q-avatar>
                              </q-item-section>
                              <q-item-section>
                                <q-item-label>{{ user.name }}</q-item-label>
                                <q-item-label caption>{{ user.status }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </div>
                    </q-card-section>

                    <!-- Action Buttons -->
                    <div class="row items-center justify-between q-pa-sm">
                      <q-card-actions align="left">
                        <q-btn
                          outline
                          label="Zrušiť"
                          color="grey-7"
                          class="border-rad"
                          v-close-popup
                          @click="clickedCard = ''"
                        ></q-btn>
                      </q-card-actions>
                      <q-card-actions align="right">
                        <q-btn
                          icon="img:../src/assets/star.svg"
                          label="Vytvoriť skupinu"
                          color="tertiary"
                          class="border-rad"
                          :disable="!groupName.trim() || !clickedCard || selectedUsers.length < 2"
                          @click="createGroup"
                        >
                        </q-btn>
                      </q-card-actions>
                    </div>
                  </q-card>
                </q-dialog>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
        <!-- Groups -->
        <div class="column q-mt-sm q-mb-md" style="min-height: 0; flex: 1; overflow: hidden">
          <q-scroll-area style="height: 100%">
            <GroupList />
          </q-scroll-area>
        </div>
      </div>
      <div>
        <!-- Info Card and Settings-->
        <InfoAndSettings />
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import InfoAndSettings from 'components/InfoCardComponent.vue';
import GroupList from 'src/components/GroupListComponent.vue';
import { useDrawerStore } from 'src/stores/drawer/drawer';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { useUsersStore } from 'src/stores/drawer/users';
import { useScrollHandling } from '../composables/useScrollHandling';
import { useRouter } from 'vue-router';
import brandIcon from '../assets/Icon.svg';
import menuIcon from '../assets/menu.svg';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const drw = useDrawerStore();
const groups = useGroupsStore();
const users = useUsersStore();
const router = useRouter();

const dialog = ref(false);
const groupName = ref('');
const clickedCard = ref('');
const selectedUsers = ref<string[]>([]);

// Computed pre dostupných používateľov
const availableUsers = computed(() => users.sorted);
const createGroup = () => {
  if (groupName.value.trim() && clickedCard.value) {
    const isPrivate = clickedCard.value === 'private';
    groups.addGroup(groupName.value.trim(), isPrivate);

    // Reset form
    groupName.value = '';
    clickedCard.value = '';
    selectedUsers.value = [];
    dialog.value = false;
  }
};

const toggleUserSelection = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId);
  if (index > -1) {
    selectedUsers.value.splice(index, 1);
  } else {
    selectedUsers.value.push(userId);
  }
};

function goToInfoPage() {
  groups.setSelected('');
  router.push('/chat').catch(() => {
    console.error('Failed to navigate to chat');
  });
}

// Handle click outside drawer to minimize it
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  const drawer = document.querySelector('.q-drawer');

  // Check if click is outside the drawer and drawer is open and not mini
  if (drawer && !drawer.contains(target) && drw.isOpen && !drw.isMini) {
    drw.toggleMini();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-drawer');
</script>

<style scoped>
.border-blue-500 {
  border-color: #3b82f6 !important;
  border-width: 2px !important;
}

.border-orange-500 {
  border-color: #f97316 !important;
  border-width: 2px !important;
}

.border-grey-300 {
  border-color: #d1d5db !important;
  border-width: 1px !important;
}

.header-section {
  transition: all 0.2s ease-out;
}

.easy-out {
  transition: all 0.3s ease;
}
.label-col--mini {
  max-width: 0;
  opacity: 0;
  margin-left: 0;
  display: none;
}
</style>
