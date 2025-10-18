import { useToast } from 'primevue/usetoast'

export function useToastNotify() {
  const toast = useToast()

  const showToast = (type, summary, detail = 'Что то пошло не так.') => {
    toast.add({
      severity: type,
      summary,
      detail,
      life: 5000,
    })
  }
  return { showToast }
}
