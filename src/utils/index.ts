export const response = (code: number, status: string, result: any, message = '') => {
  return {
    code,
    status,
    result,
    message
  }
}

export const customError = (message: string, code: number) => {
  const error = new Error(message) as any;
  error.code = code;
  return error;
}