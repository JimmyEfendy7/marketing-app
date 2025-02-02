import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import commissionRoutes from "./routes/commissions.js";
import paymentRoutes from "./routes/payments.js";

// Konfigurasi Environment
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/commissions", commissionRoutes);
app.use("/api/payments", paymentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    success: false,
    error: "Terjadi kesalahan internal server",
  });
});

// Inisialisasi Server
app.listen(PORT, () => {
  console.log(`🟢 Server berjalan di port ${PORT}`);
  console.log(`🔗 Endpoint: http://localhost:${PORT}/api`);
});
