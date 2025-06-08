"use server";
import db from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";
import serializeTransaction from "./serialize";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export async function createTransaction(data) {
    try {
        const { user, userId } = await getCurrentUser();


        // Get request data for ArcJet
        const req = await request();

        // Check rate limit
        const decision = await aj.protect(req, {
            userId,
            requested: 1, // Specify how many tokens to consume
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error("Request blocked");
        }




        // Find Db Account
        const account = await db.account.findUnique({
            where: { userId: user.id, id: data.accountId }
        });
        if (!account) throw new Error("Account not found.");


        // Calculate new balance
        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        // Create Transaction and update account balance
        const transaction = await db.$transaction(async (tx) => {
            // Create Transaction
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval
                        ? calculateNextRecurringDate(data.date, data.recurringInterval)
                        : null,
                }
            });

            // Account Balance update
            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);
        return { success: true, data: serializeTransaction(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getTransaction(id) {
    const { user } = await getCurrentUser();

    const transaction = await db.transaction.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });

    if (!transaction) return null;

    return serializeTransaction(transaction);
}

export async function updateTransaction(id, data) {
    try {
        const { user } = await getCurrentUser();

        // Get original transaction to calculate balance change
        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true,
            },
        });

        if (!originalTransaction) throw new Error("Transaction not found");

        // Calculate balance changes
        const oldBalanceChange =
            originalTransaction.type === "EXPENSE"
                ? -originalTransaction.amount.toNumber()
                : originalTransaction.amount.toNumber();

        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        // Update transaction and account balance in a transaction
        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id,
                },
                data: {
                    ...data,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            });

            // Update account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    },
                },
            });

            return updated;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${data.accountId}`);

        return { success: true, data: serializeTransaction(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function scanReceipt(file) {
    try {
        // Select the model
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        // Convert ArrayBuffer to Base64
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        // Provide prompt to genearte data as per request
        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;


        // Give Prompt to model with file
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            },
            prompt,
        ]);

        // Clean the response
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            };
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid response format from Gemini");
        }

    } catch (error) {
        console.error("Error scanning receipt:", error);
        throw new Error("Failed to scan receipt");

    }

}









// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date;
}