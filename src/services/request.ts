const baseURL = "http://localhost:8000";

async function request<T = unknown, B = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  payload?: B
) {
  const response = await fetch(`${baseURL}/${input}`, {
    ...init,
    ...(payload
      ? {
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json", // 'application/x-www-form-urlencoded' if needed
          },
        }
      : {}),
  });

  if (!response.ok) {
    throw new Error(response.statusText, { cause: response });
  }

  const result = await response.json();
  return result as T;
}

export default request;
