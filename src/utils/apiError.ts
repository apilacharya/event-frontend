export function getApiErrorMessage(error: unknown, fallback: string): string {
  const maybeWithResponse = error as { response?: { data?: { message?: string } } };
  const messageFromApi = maybeWithResponse.response?.data?.message;
  if (messageFromApi) {
    return messageFromApi;
  }

  const maybeWithMessage = error as { message?: string };
  if (maybeWithMessage.message) {
    return maybeWithMessage.message;
  }

  return fallback;
}
