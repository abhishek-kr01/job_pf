import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { uploadResume } from "../services/api";

const ResumeUpload = () => {
  const {
    formData,
    formErrors,
    loading,
    applicationId,
    setFormErrors,
    setLoading,
    updateFormData,
    nextStep,
    prevStep,
  } = useFormContext();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate file before uploading
  const validateFile = (file) => {
    if (!file) {
      setFormErrors({ resume: "Please select a file to upload" });
      return false;
    }

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(file.type)) {
      setFormErrors({ resume: "Please upload a PDF, DOCX, or TXT file" });
      return false;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors({ resume: "File size should be less than 10MB" });
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      updateFormData("resume", file);
      updateFormData("resumeFileName", file.name);
      setFormErrors({});
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        updateFormData("resume", file);
        updateFormData("resumeFileName", file.name);
        setFormErrors({});
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    prevStep();
    navigate("/step-1");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setFormErrors({ resume: "Please upload your resume" });
      return;
    }

    if (!applicationId) {
      setFormErrors({ submit: "Please complete the previous step first" });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      console.log("Uploading resume:", formData.resumeFileName);

      const formDataObj = new FormData();
      formDataObj.append("resume", formData.resume);
      formDataObj.append("applicationId", applicationId);

      const response = await uploadResume(formDataObj);

      console.log("Server response:", response);

      if (response.success) {
        nextStep();
        navigate("/step-3");
      } else {
        setFormErrors({
          submit:
            response.message || "Failed to upload resume. Please try again.",
        });
        console.error("Resume upload failed:", response);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setFormErrors({
        submit: error.message || "Failed to upload resume. Please try again.",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Upload Your Resume
      </h2>

      <form onSubmit={handleSubmit}>
        {/* File upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="resume"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            disabled={loading}
          />

          {formData.resumeFileName ? (
            <div>
              <p className="mb-2">Selected file:</p>
              <p className="font-semibold text-blue-700">
                {formData.resumeFileName}
              </p>
              <button
                type="button"
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
                onClick={() => {
                  updateFormData("resume", null);
                  updateFormData("resumeFileName", "");
                }}
                disabled={loading}
              >
                Remove file
              </button>
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your resume here, or{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  disabled={loading}
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOCX, or TXT (Max 10MB)
              </p>
            </div>
          )}
        </div>

        {formErrors.resume && (
          <p className="error-text mb-4">{formErrors.resume}</p>
        )}

        {/* Form error message */}
        {formErrors.submit && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {formErrors.submit}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleBack}
            disabled={loading || isSubmitting}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeUpload;
