"use server";
import db from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@prisma/client";

export async function getCurrentBudget(accountId) {

    try {
        const { user } = await getCurrentUser();

        // Fetching the budget
        const budget = await db.budget.findFirst({
            where: {
                userId: user.id,
            }
        });

        //Get current month's expenses
        const currentDate = new Date(); // e.g., June 5, 2025
        const startOfMonth = new Date(
            currentDate.getFullYear(),  // 2025
            currentDate.getMonth(),     // 5 (June, because months are 0-indexed)
            1                           // Day 1
        );
        const endOfMonth = new Date(
            currentDate.getFullYear(),  // 2025
            currentDate.getMonth() + 1, // 6 (July)
            0                           // Day 0 0f July = Last Day of June (Previous Month End Date)
        );




        // finding transaction from startOfMonth and endOfMonth of given accountId and getting sum of expenses. 
        const expenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                type: TransactionType.EXPENSE,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                accountId,
            },
            _sum: {
                amount: true,
            },
        });

        return {
            // Serialize 
            budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
            currentExpenses: expenses._sum.amount
                ? expenses._sum.amount.toNumber()
                : 0,
        };
    } catch (error) {
        console.error("Error fetching budget:", error);
        throw error;

    }


}

export async function updateBudget(amount) {
    try {

        const { user } = await getCurrentUser();

        //Find then Update or Create Budget
        const budget = await db.budget.upsert({
            where: {
                userId: user.id,
            },
            update: {
                amount
            },
            create: {
                userId: user.id,
                amount,
            }
        });

        revalidatePath("/dashboard");
        return {
            success: true,
            data: { ...budget, amount: budget.amount.toNumber() }
        }

    } catch (error) {
        console.error("Error updating budget:", error);
        return { success: false, error: error.message };
    }
}