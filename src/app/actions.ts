"use server";

import { revalidatePath } from "next/cache";

export async function action(path: string) {
  revalidatePath(path);
}
