export function useScrollHandling(targetSelector: string) {
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
