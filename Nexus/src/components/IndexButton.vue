<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <q-icon v-if="icon" :name="icon" class="q-mr-xs" />
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  icon?: string;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();

const buttonClasses = computed(() => {
  const baseClasses = 'btn';
  const variantClass = `btn-${props.variant}`;
  
  return [baseClasses, variantClass];
});

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<style lang="scss" scoped>
.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 6px 12px;
  font-size: 0.875rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // Variants
  &-primary {
    background: $secondary-gradient;
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: $shadow-sm;
    }
  }
  
  &-secondary {
    background: $primary-gradient;
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: $shadow-sm;
    }
  }
  
  &-outline {
    background: transparent;
    color: $primary-color;
    border: 1px solid rgba(0, 0, 0, 0.1);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  
  &-ghost {
    background: transparent;
    color: $text-primary;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
