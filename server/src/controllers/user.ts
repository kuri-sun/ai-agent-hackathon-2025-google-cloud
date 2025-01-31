import { Request, Response } from "express";
import { User } from "../models/user";

export const validateUser = async (req: Request, res: Response) => {
  const email = req.user?.email;

  try {
    if (!email) {
      res.status(401).json({ error: "Unauthorized Email from sub." });
      return;
    }
    const user = await User.findByEmail({ email });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to validate user" });
  }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ id: userId });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (req.user?.userId !== userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await User.delete({ id: userId });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
