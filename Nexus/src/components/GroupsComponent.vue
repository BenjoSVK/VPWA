<template>
  <q-drawer
    show-if-above
    class="bg-gradient-primary"
    :mini-width="80"
    :width="370"
    :mini="drw.isMini"
    :content-class="drw.isMini ? 'drawer--mini' : 'drawer--full'"
    v-model="drw.isOpen"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="justify-between column full-height" style="height: 100dvh">
      <div class="items-center flex q-pt-md" :class="drw.isMini ? '' : 'q-px-lg row'">
        <div
          class="items-center justify-center bg-gradient-secondary row q-pa-sm border-rad"
          v-show="!drw.isMini"
        >
          <img :src="brandIcon" alt="Icon" />
        </div>
        <div
          class="col row items-center align-center"
          :class="drw.isMini ? 'justify-center' : 'justify-between'"
        >
          <q-item-label
            v-show="!drw.isMini"
            header
            class="text-h6 text-light q-pl-md text-weight-bold"
          >
            Nexus
          </q-item-label>
          <button
            class="hamburger-icon border-rad flex q-pa-xs"
            @click="drw.toggleMini"
            aria-label="Menu"
          >
            <img :src="menuIcon" alt="menu-icon" class="q-pa-sm" />
          </button>
        </div>
      </div>

      <div
        class="col q-pt-md"
        style="flex: 1; display: flex; flex-direction: column; min-height: 0"
      >
        <q-list padding>
          <q-item dense class="bg-transparent text-h6 text-white q-px-lg q-pb-md">
            <q-item-section avatar class="items-center justify-center q-pr-sm">
              <img src="/src/assets/groups.svg" width="25" height="25" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Skupiny</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                rounded
                flat
                color="grey"
                class="flex items-center justify-center q-pa-xs"
                @click="dialog = true"
                size="sm"
                ><q-icon name="img:src/assets/plus.svg" size="20px" />
                <q-dialog v-model="dialog" :backdrop-filter="'blur(3px) saturate(150%)'">
                  <q-card style="border-radius: 20px">
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

                    <q-card-section class="row items-center q-pb-xs">
                      <q-icon
                        name="img:/src/assets/Icon.svg"
                        size="15px"
                        class="q-mr-xs"
                        style="
                          filter: brightness(0) saturate(100%) invert(48%) sepia(79%)
                            saturate(2476%) hue-rotate(200deg) brightness(118%) contrast(119%);
                          transform: translateY(-2px);
                        "
                      />
                      <p class="text-weight-medium text-subtitle+ q-pa-none q-ma-none">
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
                          @click="clickedCard = 'public'"
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
                                v-if="clickedCard === 'public'"
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
                          @click="clickedCard = 'private'"
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
                    <div class="row items-center justify-between q-pa-sm">
                      <q-card-actions align="left">
                        <q-btn
                          outline
                          label="Close"
                          color="tertiary"
                          class="border-rad"
                          v-close-popup
                          @click="clickedCard = ''"
                        ></q-btn>
                      </q-card-actions>
                      <q-card-actions align="right">
                        <q-btn
                          label="Vytvoriť skupinu"
                          color="tertiary"
                          class="border-rad"
                          :disable="!groupName.trim() || !clickedCard"
                          @click="createGroup"
                        ></q-btn>
                      </q-card-actions>
                    </div>
                  </q-card>
                </q-dialog>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
        <!-- Groups -->
        <div class="column q-mb-sm" style="overflow-y: scroll; overflow-x: none; min-height: 0">
          <GroupList />
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
import { useScrollHandling } from '../composables/useScrollHandling';
import brandIcon from '../assets/Icon.svg';
import menuIcon from '../assets/menu.svg';
import { ref } from 'vue';

const drw = useDrawerStore();
const groups = useGroupsStore();

const dialog = ref(false);
const groupName = ref('');
const clickedCard = ref('');
const createGroup = () => {
  if (groupName.value.trim() && clickedCard.value) {
    const isPrivate = clickedCard.value === 'private';
    groups.addGroup(groupName.value.trim(), isPrivate);

    // Reset form
    groupName.value = '';
    clickedCard.value = '';
    dialog.value = false;
  }
};
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
</style>
