import express from "express";
import Penjualan from "../models/Penjualan.js";
import Marketing from "../models/Marketing.js";

const router = express.Router();

const calculateCommission = (omzet) => {
  if (omzet >= 500000000) return { percent: 10, nominal: omzet * 0.1 };
  if (omzet >= 200000000) return { percent: 5, nominal: omzet * 0.05 };
  if (omzet >= 100000000) return { percent: 2.5, nominal: omzet * 0.025 };
  return { percent: 0, nominal: 0 };
};

router.get("/", async (req, res) => {
  try {
    const allMarketers = await Marketing.getAll();
    const commissions = await Promise.all(
      allMarketers.map(async (marketer) => {
        const salesData = await Penjualan.getSalesData(5, 2023); // Contoh bulan Mei
        const totalOmzet = salesData.reduce((acc, curr) => acc + curr.total, 0);
        const commission = calculateCommission(totalOmzet);

        return {
          id: marketer.id,
          name: marketer.name,
          bulan: "2023-05",
          omzet: totalOmzet,
          ...commission,
        };
      })
    );

    res.json({
      success: true,
      data: commissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
