const express = require("express");
const router = express.Router();

const {
  analyzeProfile,
  getAllProfiles,
  getSingleProfile,
} = require("../controllers/githubController");

router.get("/analyze/:username", analyzeProfile);
router.get("/", getAllProfiles);
router.get("/:username", getSingleProfile);

module.exports = router;