import express from "express";
import Pembayaran from "../models/Pembayaran.js";
import db from "../config/db.js";

const router = express.Router();

// Validasi input pembayaran
const validatePayment = (req, res, next) => {
  const { penjualan_id, jumlah_pembayaran } = req.body;

  if (!penjualan_id || !jumlah_pembayaran) {
    return res.status(400).json({
      success: false,
      error: "Semua field harus diisi",
    });
  }

  if (isNaN(jumlah_pembayaran) || jumlah_pembayaran <= 0) {
    return res.status(400).json({
      success: false,
      error: "Jumlah pembayaran tidak valid",
    });
  }

  next();
};

router.post("/payments", validatePayment, async (req, res) => {
  try {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Cek status penjualan
      const [sale] = await connection.query(
        "SELECT grand_total FROM Penjualan WHERE id = ?",
        [req.body.penjualan_id]
      );

      // Hitung total pembayaran
      const [payments] = await connection.query(
        "SELECT SUM(jumlah_pembayaran) AS total FROM Pembayaran WHERE penjualan_id = ?",
        [req.body.penjualan_id]
      );

      const totalPaid = payments[0].total || 0;
      const newTotal = totalPaid + req.body.jumlah_pembayaran;
      const remaining = sale[0].grand_total - newTotal;

      if (newTotal > sale[0].grand_total) {
        return res.status(400).json({
          success: false,
          error: "Jumlah pembayaran melebihi tagihan",
        });
      }

      // Simpan pembayaran
      const paymentId = await Pembayaran.create({
        penjualan_id: req.body.penjualan_id,
        jumlah_pembayaran: req.body.jumlah_pembayaran,
        status: remaining === 0 ? "lunas" : "belum",
      });

      await connection.commit();

      res.status(201).json({
        success: true,
        data: {
          id: paymentId,
          sisa_tagihan: remaining,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
