import db from "../config/db.js";

const Marketing = {
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM Marketing");
      return rows;
    } catch (error) {
      throw new Error(`Gagal mendapatkan data marketing: ${error.message}`);
    }
  },
};

export default Marketing;
