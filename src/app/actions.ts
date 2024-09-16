"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function revalidatePathAction(path: string) {
  revalidatePath(path);
}

export async function setCookieAction(key: string, value: string) {
  cookies().set(key, value);
}
