export type ApiErrorResponse = {
  timestamp?: string
  status?: number
  message?: string
  errors?: Record<string, string>
}
