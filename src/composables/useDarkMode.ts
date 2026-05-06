import { ref, watch } from 'vue'

const STORAGE_KEY = 'shopvue-dark-mode'

const isDark = ref<boolean>(
  localStorage.getItem(STORAGE_KEY) === 'true' ||
    (!localStorage.getItem(STORAGE_KEY) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
)

function applyDark(value: boolean): void {
  if (value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem(STORAGE_KEY, String(value))
}

// Apply on load
applyDark(isDark.value)

watch(isDark, applyDark)

export function useDarkMode() {
  function toggle(): void {
    isDark.value = !isDark.value
  }

  function setDark(value: boolean): void {
    isDark.value = value
  }

  return { isDark, toggle, setDark }
}
