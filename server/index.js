import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
//CORS Middleware
app.use(
  cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
  })
)
//connect to database
connectDB();

app.get("/api/test", (req, res) => {
  res.send("Muse backend running 🚀");
});
//Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
