import db from "../config/db.js";

const Pembayaran = {
  create: async (paymentData) => {
    try {
      const [result] = await db.query(
        "INSERT INTO Pembayaran SET ?",
        paymentData
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Gagal membuat pembayaran: ${error.message}`);
    }
  },
};

export default Pembayaran;
