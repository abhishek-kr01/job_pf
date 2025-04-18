const Application = require("../models/Application");
const fs = require("fs");
const path = require("path");

/**
 * Save or update candidate details (Page 1)
 * @route POST /api/applications/candidate-details
 * @access Public
 */
exports.saveCandidateDetails = async (req, res, next) => {
  try {
    const { name, email, phone, applicationId } = req.body;

    console.log("Received data:", { name, email, phone, applicationId });

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let application;

    if (applicationId) {
      // Update existing application
      application = await Application.findByIdAndUpdate(
        applicationId,
        { name, email, phone },
        { new: true, runValidators: true }
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }
    } else {
      // Create new application
      application = await Application.create({
        name,
        email,
        phone,
        status: "draft",
        behavioralResponses: [
          {
            question: "Why are you interested in joining this organisation?",
            textResponse: " ", // Space character to satisfy required validation
          },
        ],
      });
    }

    console.log("Application created/updated:", application._id);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error in saveCandidateDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Upload resume (Page 2)
 * @route POST /api/applications/resume-upload
 * @access Public
 */
exports.uploadResume = async (req, res, next) => {
  try {
    const { applicationId } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      // Remove uploaded file if application doesn't exist
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete previous resume file if exists
    if (application.resume && application.resume.path) {
      const previousPath = path.join(__dirname, "..", application.resume.path);
      if (fs.existsSync(previousPath)) {
        fs.unlinkSync(previousPath);
      }
    }

    // Update application with new resume
    application.resume = {
      filename: req.file.originalname,
      path: req.file.path.replace(/\\/g, "/").replace("server/", ""),
      mimetype: req.file.mimetype,
      uploadedAt: Date.now(),
    };

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error in uploadResume:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Save behavioral responses (Page 3)
 * @route POST /api/applications/behavioral-responses
 * @access Public
 */
exports.saveBehavioralResponses = async (req, res, next) => {
  try {
    const { applicationId, responses } = req.body;

    // Validate input
    if (!applicationId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    // Check if at least one response has text
    const hasResponses = responses.some(
      (response) =>
        response.question &&
        response.textResponse &&
        response.textResponse.trim().length > 0
    );

    if (!hasResponses) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one response",
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update application
    application.behavioralResponses = responses;
    application.status = "submitted";
    application.submittedAt = Date.now();

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error in saveBehavioralResponses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get application by ID
 * @route GET /api/applications/:id
 * @access Public
 */
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error in getApplication:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all applications (Admin function)
 * @route GET /api/applications
 * @access Public (would typically be restricted to admin)
 */
exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .select("name email status submittedAt")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Error in getAllApplications:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
