import { Request, Response } from "express";
import os from "node:os";

export const getHealth = async (req: Request, res: Response) => {
  const { params, body } = req;
  const cpuUsage = process.cpuUsage();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  try {
    res.status(200).json({
      success: true,
      data: {
        health: "ok",
        body,
        params,
        cpuUsage,
        totalMemory,
        freeMemory,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to validate user" });
  }
};
