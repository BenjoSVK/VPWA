import { ref, watch, nextTick, onMounted, type Ref } from 'vue';
import type { QScrollArea } from 'quasar';

export function useScrollHandling(targetSelector: string) {
  /**
   * Handles mouse enter event
   * Disables body scroll and enables target component scroll
   */
  function onMouseEnter() {
    document.body.style.overflow = 'hidden';
    const target = document.querySelector(targetSelector);
    if (target) {
      (target as HTMLElement).style.overflow = 'auto';
    }
  }

  function onMouseLeave() {
    document.body.style.overflow = '';
    const target = document.querySelector(targetSelector);
    if (target) {
      (target as HTMLElement).style.overflow = '';
    }
  }

  return {
    onMouseEnter,
    onMouseLeave,
  };
}

/**
 * Auto-scroll functionality for QScrollArea
 * Handles scroll to bottom automatically
 */
export function useAutoScroll(selectedId: Ref<string | number | null>) {
  const saRef = ref<QScrollArea | null>(null);

  const scrollToBottom = () => {
    const target = saRef.value?.getScrollTarget?.() as HTMLElement | undefined;
    if (target) saRef.value!.setScrollPosition('vertical', target.scrollHeight, 200);
  };

  // po zmene skupiny skrolni dole
  watch(selectedId, async () => {
    await nextTick();
    scrollToBottom();
  });

  // pre prípad, že je selectedId nastavené už pri mountnutí
  onMounted(async () => {
    await nextTick();
    scrollToBottom();
  });

  return { saRef, scrollToBottom };
}
