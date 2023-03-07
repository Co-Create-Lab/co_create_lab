require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const path = require("path");

const { authRouter } = require("./routes/auth.js");
const { userRouter } = require("./routes/users.js");
const { projectRouter } = require("./routes/projects.js");
const { errorHandler } = require("./middlewares/errorHandler");
const { verifyToken } = require("./middlewares/verifyToken.js");

require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.resolve(__dirname, "co_create_lab_f", "build")));

app.use(
  cors({
    origin: [
      "https://co-create-lab.netlify.app",
      "http://localhost:3000",
      "https://co-create-lab-backend.onrender.com",
      "https://co-create-lab.onrender.com",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);

app.use(errorHandler);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "co_create_lab_f", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
