const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");
const mongoose = require("mongoose");

// Register
const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existingUser = await userModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "Username already exist, Please use another username.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserId = new mongoose.Types.ObjectId();

    const user = await userModel.create({
      _id: newUserId,
      name,
      username,
      password: hashedPassword,
      role: "Owner",
      shopId: newUserId,
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        shopId: user.shopId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      msg: "Tailor registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        shopId: user.shopId,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched)
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });

    const token = jwt.sign(
      {
        id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role,
        shopId: existingUser.shopId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      msg: "User logged In successfully.",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Addin team members
const addTeamMember = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const shopId = req.user.shopId;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teamMember = await userModel.create({
      name,
      username,
      password: hashedPassword,
      role: "team",
      shopId: shopId,
    });

    res.status(201).json({ success: true, msg: "Team member added" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get all team members for the logged-in shop
const getTeamMembers = async (req, res) => {
  try {
    const members = await userModel
      .find({
        shopId: req.user.shopId,
        role: "team",
      })
      .select("-password"); // Don't send passwords back

    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete a team member
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete only if the user belongs to the requester's shop
    const deletedMember = await userModel.findOneAndDelete({
      _id: id,
      shopId: req.user.shopId,
    });

    if (!deletedMember) {
      return res.status(404).json({ success: false, msg: "Member not found" });
    }

    res.json({ success: true, msg: "Team member removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  register,
  login,
  addTeamMember,
  getTeamMembers,
  deleteTeamMember,
};
