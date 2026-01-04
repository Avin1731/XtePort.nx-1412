"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guestbook } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- ADMIN: DELETE MESSAGE ---
export async function deleteGuestbookEntry(id: string) {
  const session = await auth();
  
  // FIX: Hapus check 'role' agar tidak error TS.
  // Cukup validasi berdasarkan EMAIL ADMIN yang ada di .env
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized Access: Admin only.");
  }

  await db.delete(guestbook).where(eq(guestbook.id, id));
  revalidatePath("/dashboard/guestbook");
  revalidatePath("/guestbook");
}

// --- PUBLIC: CREATE MESSAGE ---
export async function createGuestbookEntry(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const message = formData.get("message") as string;

  // Validasi simpel
  if (!message || message.trim().length === 0) return;

  await db.insert(guestbook).values({
    userId: session.user.id,
    message: message.slice(0, 500), // Limit 500 karakter
  });

  revalidatePath("/guestbook");
  revalidatePath("/dashboard/guestbook");
}