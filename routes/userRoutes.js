const express = require("express");
const {
  register,
  login,
  addTeamMember,
  getTeamMembers,
  deleteTeamMember,
} = require("../controllers/User");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/new-member", protect, addTeamMember);
router.get("/team", protect, getTeamMembers);
router.delete("/team/:id", protect, deleteTeamMember);

module.exports = router;
