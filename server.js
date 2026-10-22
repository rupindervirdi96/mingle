const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const path = require("path");
const connectDB = require("./config/db");
const realtime = require("./lib/realtime");
const { errorHandler } = require("./lib/errors");

const app = express();
const server = http.createServer(app);
realtime.init(server);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/profiles", require("./routes/profile.route"));
app.use("/api/friends", require("./routes/friends.route"));
app.use("/api/posts", require("./routes/post.route"));
app.use("/api/chats", require("./routes/chat.route"));
app.use("/api/notifications", require("./routes/notification.route"));
app.use("/api", (req, res) => res.status(404).json({ message: "Not found." }));

// Serve the built React app whenever it exists (Render runs `npm run build` first).
const clientBuild = path.join(__dirname, "client", "build");
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild, { index: false, maxAge: "1h" }));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

module.exports = { app, server };
