export interface AppError {
  message: string
  code?: string
  originalError?: unknown
}

export function handleError(error: unknown, context?: string): AppError {
  let message = 'An unexpected error occurred'

  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  }

  if (process.env.NODE_ENV === 'development') {
    const logMessage = context ? `[${context}] ${message}` : message
    console.error(logMessage, error)
  }

  const result: AppError = {
    message,
    originalError: error
  }

  return result
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}
