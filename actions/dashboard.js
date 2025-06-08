"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./getCurrentUser";
import serializeTransaction from "./serialize";



export async function createAccount(data) {
    try {

        //Check User  Logic
        const { user } = await getCurrentUser();

        //Convert balance to float
        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) throw new Error("Invalid Balance Amount");

        //Checking if this is the user's first account
        const existingAccount = await db.account.findMany({
            where: { userId: user.id, }
        });

        //if account is first than default or else what user say
        const shouldBeDefault = existingAccount.length === 0 ? true : data.isDefault;
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true }, //find
                data: { isDefault: false }, //update
            });
        }

        //create account
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            }
        });

        //serialized
        const serializedAccount = serializeTransaction(account);
        //updated fetch again
        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };
    }
    catch (e) {
        throw new Error(e.message);
    }
}


export async function getUserAccounts() {
    //Check User  Logic
    const { user } = await getCurrentUser();

    //Fetching account
    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true,
                }
            }
        },
    });

    //serialized
    const serializedAccount = accounts.map(serializeTransaction);
    return serializedAccount;

}


export async function getDashboardData() {
    try {
        const { user } = await getCurrentUser();
        const transactions = await db.transaction.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                date: "desc",
            }
        });

        return transactions.map(serializeTransaction);
    } catch (e) {
        throw new Error(e.message);
    }
}
