import { getCookieAction } from "@/app/actions";

const baseURL = "http://localhost:8000";

function getCookie(key: string) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

async function request<T = unknown, B = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  payload?: B
) {
  let token = null;

  if (typeof window === "undefined") {
    const cookie = await getCookieAction("jwt-token");
    token = cookie?.value;
  } else {
    token = getCookie("jwt-token");
  }

  const response = await fetch(`${baseURL}/${input}`, {
    ...init,
    ...(payload ? { body: JSON.stringify(payload) } : {}),
    headers: {
      "Content-Type": "application/json", // 'application/x-www-form-urlencoded' if needed,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText, { cause: response });
  }

  const result = await response.json();
  return result as T;
}

export default request;
