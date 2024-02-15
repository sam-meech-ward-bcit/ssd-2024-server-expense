import app from "./app"

const server = Bun.serve({
  fetch: app.fetch,
  hostname: "0.0.0.0",
  port: process.env.PORT || 3000,
})

console.log(`Listeningggg on port:${server.port}`);