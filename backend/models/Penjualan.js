import db from "../config/db.js";

const Penjualan = {
  getSalesData: async (month, year) => {
    try {
      const [rows] = await db.query(
        `SELECT marketing_id, SUM(grand_total) AS total 
         FROM Penjualan 
         WHERE YEAR(date) = ? AND MONTH(date) = ?
         GROUP BY marketing_id`,
        [year, month]
      );
      return rows;
    } catch (error) {
      throw new Error(`Gagal mendapatkan data penjualan: ${error.message}`);
    }
  },
};

export default Penjualan;
