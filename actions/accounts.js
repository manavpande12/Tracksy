"use server";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";
import serializeTransaction from "./serialize";



export async function updateDefaultAccount(accountId) {
    try {

        const { user } = await getCurrentUser();

        await db.account.updateMany({
            where: { userId: user.id, isDefault: true }, //find
            data: { isDefault: false }, //update
        });

        const account = await db.account.update({
            where: {
                userId: user.id,
                id: accountId,
            },
            data: {
                isDefault: true,
            }
        });

        revalidatePath('/dashboard');
        return { success: true, data: serializeTransaction(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


export async function getAccountWithTransactions(accountId) {
    //Check User  Logic
    const { user } = await getCurrentUser();

    const account = await db.account.findUnique({
        where: { id: accountId, userId: user.id },
        include: {
            transactions: {
                orderBy: { date: "desc" },
            },
            _count: {
                select: { transactions: true },
            }
        },
    });

    if (!account) return null;

    return {
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction),
    }

}


export async function bulkDeleteTransactions(transactionIds) {
    try {
        //Check User  Logic
        const { user } = await getCurrentUser();

        // Get transactions to calculate balance changes
        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            },
        });

        // Group transactions by account to update balances
        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change =
                transaction.type === "EXPENSE"
                    ? transaction.amount
                    : -transaction.amount;
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {});

        // Delete transactions and update account balances in a transaction
        await db.$transaction(async (tx) => {
            // Delete transactions
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                },
            });

            // Update account balances
            for (const [accountId, balanceChange] of Object.entries(
                accountBalanceChanges
            )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                });
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/account/[id]", "page");

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}