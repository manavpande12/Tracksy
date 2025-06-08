"use server";

//Next.js doesn't support decimal value so converted it before return
function serializeTransaction(obj) {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
}

export default serializeTransaction;