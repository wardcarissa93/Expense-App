import app from "./app";

console.log("Hello via Bun!");

const server = Bun.serve({
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: process.env.PORT || 3000,
})

console.log(`running on port ${server.port}`);