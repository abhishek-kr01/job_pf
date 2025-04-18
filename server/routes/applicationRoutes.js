const express = require("express");
const router = express.Router();
const uploadResume = require("../config/multer");
const {
  saveCandidateDetails,
  uploadResume: uploadResumeController,
  saveBehavioralResponses,
  getApplication,
  getAllApplications,
} = require("../controllers/applicationController");

// Middleware for handling async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   GET /api/applications
 * @desc    Get all applications (admin function)
 * @access  Public (would typically be restricted to admin)
 */
router.get("/", asyncHandler(getAllApplications));

/**
 * @route   GET /api/applications/:id
 * @desc    Get application by ID
 * @access  Public
 */
router.get("/:id", asyncHandler(getApplication));

/**
 * @route   POST /api/applications/candidate-details
 * @desc    Save candidate details (Page 1)
 * @access  Public
 */
router.post("/candidate-details", asyncHandler(saveCandidateDetails));

/**
 * @route   POST /api/applications/resume-upload
 * @desc    Upload resume (Page 2)
 * @access  Public
 */
router.post(
  "/resume-upload",
  uploadResume.single("resume"),
  asyncHandler(uploadResumeController)
);

/**
 * @route   POST /api/applications/behavioral-responses
 * @desc    Save behavioral responses (Page 3)
 * @access  Public
 */
router.post("/behavioral-responses", asyncHandler(saveBehavioralResponses));

module.exports = router;
