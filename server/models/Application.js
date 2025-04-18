const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    // Page 1: Candidate Details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Page 2: Resume Upload
    resume: {
      filename: String,
      path: String,
      mimetype: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },

    // Page 3: Behavioral Questions
    behavioralResponses: [
      {
        question: {
          type: String,
          required: true,
        },
        textResponse: {
          type: String,
          required: true,
        },
      },
    ],

    // Metadata
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "rejected", "accepted"],
      default: "draft",
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastUpdated timestamp on save
ApplicationSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();

  // Set submittedAt when status changes to submitted
  if (this.status === "submitted" && !this.submittedAt) {
    this.submittedAt = Date.now();
  }

  next();
});

module.exports = mongoose.model("Application", ApplicationSchema);
