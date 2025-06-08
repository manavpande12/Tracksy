"use server";
//Check User  Logic
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    return { user, userId };
}

