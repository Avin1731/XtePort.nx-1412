"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { experience, profile } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function ensureValidDate(value: FormDataEntryValue | null, fieldName: string) {
  if (!value || typeof value !== "string") {
    throw new Error(`${fieldName} is required.`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${fieldName}.`);
  }

  return parsed;
}

function optionalDate(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function ensureAdmin() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

function revalidateProfileRoutes() {
  revalidatePath("/dashboard/profile");
  revalidatePath("/about");
  revalidatePath("/");
}

async function getOrCreateProfileId() {
  const existing = await db.query.profile.findFirst({
    columns: { id: true },
  });

  if (existing) return existing.id;

  const inserted = await db.insert(profile).values({
    bio: "",
  }).returning({ id: profile.id });

  return inserted[0].id;
}

export async function getProfileForAdmin() {
  await ensureAdmin();

  const currentProfile = await db.query.profile.findFirst();

  if (!currentProfile) {
    return { profile: null, experiences: [] };
  }

  const experiences = await db.query.experience.findMany({
    where: eq(experience.profileId, currentProfile.id),
    orderBy: [desc(experience.isCurrent), desc(experience.startDate), desc(experience.createdAt)],
  });

  return {
    profile: currentProfile,
    experiences,
  };
}

export async function getPublicProfileData() {
  const currentProfile = await db.query.profile.findFirst();

  if (!currentProfile) {
    return { profile: null, experiences: [] };
  }

  const experiences = await db.query.experience.findMany({
    where: eq(experience.profileId, currentProfile.id),
    orderBy: [desc(experience.isCurrent), desc(experience.startDate), desc(experience.createdAt)],
  });

  return {
    profile: currentProfile,
    experiences,
  };
}

export async function upsertProfile(formData: FormData) {
  await ensureAdmin();

  const profileId = await getOrCreateProfileId();

  const fullName = (formData.get("fullName") as string | null) || null;
  const headline = (formData.get("headline") as string | null) || null;
  const bio = ((formData.get("bio") as string | null) || "").trim();
  const avatarUrl = (formData.get("avatarUrl") as string | null) || null;
  const location = (formData.get("location") as string | null) || null;
  const cvUrl = (formData.get("cvUrl") as string | null) || null;

  await db
    .update(profile)
    .set({
      fullName,
      headline,
      bio,
      avatarUrl,
      location,
      cvUrl,
      updatedAt: new Date(),
    })
    .where(eq(profile.id, profileId));

  revalidateProfileRoutes();
}

export async function createExperience(formData: FormData) {
  await ensureAdmin();

  const profileId = await getOrCreateProfileId();

  const company = ((formData.get("company") as string | null) || "").trim();
  const role = ((formData.get("role") as string | null) || "").trim();
  const description = ((formData.get("description") as string | null) || "").trim() || null;
  const startDate = ensureValidDate(formData.get("startDate"), "Start date");
  const isCurrent = formData.get("isCurrent") === "on";
  const endDate = isCurrent ? null : optionalDate(formData.get("endDate"));
  const sortOrderRaw = Number(formData.get("sortOrder") || 0);
  const sortOrder = Number.isFinite(sortOrderRaw) ? sortOrderRaw : 0;

  if (!company || !role) {
    throw new Error("Company and role are required.");
  }

  await db.insert(experience).values({
    profileId,
    company,
    role,
    description,
    startDate,
    endDate,
    isCurrent,
    sortOrder,
  });

  revalidateProfileRoutes();
}

export async function updateExperience(id: string, formData: FormData) {
  await ensureAdmin();

  const company = ((formData.get("company") as string | null) || "").trim();
  const role = ((formData.get("role") as string | null) || "").trim();
  const description = ((formData.get("description") as string | null) || "").trim() || null;
  const startDate = ensureValidDate(formData.get("startDate"), "Start date");
  const isCurrent = formData.get("isCurrent") === "on";
  const endDate = isCurrent ? null : optionalDate(formData.get("endDate"));
  const sortOrderRaw = Number(formData.get("sortOrder") || 0);
  const sortOrder = Number.isFinite(sortOrderRaw) ? sortOrderRaw : 0;

  if (!company || !role) {
    throw new Error("Company and role are required.");
  }

  await db
    .update(experience)
    .set({
      company,
      role,
      description,
      startDate,
      endDate,
      isCurrent,
      sortOrder,
    })
    .where(eq(experience.id, id));

  revalidateProfileRoutes();
}

export async function deleteExperience(id: string) {
  await ensureAdmin();

  await db
    .delete(experience)
    .where(and(eq(experience.id, id)));

  revalidateProfileRoutes();
}
