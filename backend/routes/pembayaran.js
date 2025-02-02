const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * Endpoint: POST /api/pembayaran
 *
 * Request body:
 * {
 *   "penjualan_id": <id_transaksi>,
 *   "amount_paid": <nominal_pembayaran>,
 *   "payment_date": "YYYY-MM-DD"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { penjualan_id, amount_paid, payment_date } = req.body;
    if (!penjualan_id || !amount_paid || !payment_date) {
      return res
        .status(400)
        .json({
          error:
            "Field penjualan_id, amount_paid, dan payment_date harus disediakan",
        });
    }

    // Ambil total transaksi dari tabel Penjualan
    const [penjualanRows] = await db.execute(
      "SELECT grand_total FROM Penjualan WHERE id = ?",
      [penjualan_id]
    );
    if (penjualanRows.length === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }
    const grand_total = Number(penjualanRows[0].grand_total);

    // Hitung total pembayaran yang sudah dilakukan untuk transaksi ini
    const [paymentRows] = await db.execute(
      "SELECT IFNULL(SUM(amount_paid), 0) AS total_paid FROM Pembayaran WHERE penjualan_id = ?",
      [penjualan_id]
    );
    const total_paid = Number(paymentRows[0].total_paid);
    const new_total_paid = total_paid + Number(amount_paid);

    // Tentukan status pembayaran
    const payment_status =
      new_total_paid >= grand_total ? "Lunas" : "Belum Lunas";

    // Masukkan data pembayaran ke tabel Pembayaran
    const [result] = await db.execute(
      "INSERT INTO Pembayaran (penjualan_id, amount_paid, payment_date, payment_status) VALUES (?, ?, ?, ?)",
      [penjualan_id, amount_paid, payment_date, payment_status]
    );

    res.json({
      message: "Pembayaran berhasil dicatat",
      paymentId: result.insertId,
      payment_status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
