export type DataProps<T> = {
  data: T | undefined
  isLoading: boolean
  error: unknown
  onTryAgain?: () => void
}
