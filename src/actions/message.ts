"use server";

import { db } from "@/lib/db";
import { messages } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm"; // Import baru
import { revalidatePath } from "next/cache"; // Import baru

// --- SEND MESSAGE (PUBLIC) ---
export async function sendMessage(content: string) {
  const session = await auth();

  if (!content || content.trim().length === 0) {
    return { success: false, error: "Message cannot be empty" };
  }

  try {
    await db.insert(messages).values({
      content: content.slice(0, 500), // Limit 500 char
      userId: session?.user?.id || null, // Simpan ID jika login, null jika guest
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Something went wrong" };
  }
}

// --- DELETE MESSAGE (ADMIN ONLY) ---
export async function deleteMessage(id: string) {
  const session = await auth();

  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized Access");
  }

  try {
    await db.delete(messages).where(eq(messages.id, id));
    revalidatePath("/dashboard/messages");
    // HAPUS baris return { success: true }; 
    // Biarkan void agar kompatibel dengan form action
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw new Error("Failed to delete message");
  }
}