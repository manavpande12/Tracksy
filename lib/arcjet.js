import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["userId"], // Track based on clerk userId
    rules: [
        tokenBucket({
            mode: "LIVE", //Enforces the rule in real-time (not just simulating it for testing).
            refillRate: 10, //Every interval  1 hour, the bucket gets 10 new tokens.
            interval: 3600, //3600 seconds = 1 hour
            capacity: 10, // 1 Hour =  10 request
        }),
    ],
});

export default aj;