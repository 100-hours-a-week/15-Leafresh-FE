'use client'

export const handleError = (error: ErrorResponse) => {
  if (error.status === 401) return

  const openToast = useToastStore.getState().open
  openToast(ToastType.Error, error.message)
}
