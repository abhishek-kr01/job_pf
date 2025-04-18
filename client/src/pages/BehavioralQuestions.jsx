import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { saveBehavioralResponses } from "../services/api";

const BehavioralQuestions = () => {
  const {
    formData,
    formErrors,
    loading,
    applicationId,
    setFormErrors,
    setLoading,
    setSubmitted,
    updateBehavioralResponse,
    nextStep,
    prevStep,
  } = useFormContext();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form on submission
  const validateForm = () => {
    const errors = {};

    if (!formData.behavioralResponses[0].textResponse.trim()) {
      errors.textResponse = "Please provide an answer";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle back button
  const handleBack = () => {
    prevStep();
    navigate("/step-2");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!applicationId) {
      setFormErrors({ submit: "Please complete the previous steps first" });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      console.log(
        "Submitting behavioral responses:",
        formData.behavioralResponses
      );

      const response = await saveBehavioralResponses({
        applicationId,
        responses: formData.behavioralResponses,
      });

      console.log("Server response:", response);

      if (response.success) {
        setSubmitted(true);
        nextStep();
        navigate("/success");
      } else {
        setFormErrors({
          submit:
            response.message || "Failed to save responses. Please try again.",
        });
        console.error("Behavioral responses submission failed:", response);
      }
    } catch (error) {
      console.error("Error submitting behavioral responses:", error);
      setFormErrors({
        submit: error.message || "Failed to save responses. Please try again.",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Get current question
  const currentQuestion = formData.behavioralResponses[0];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Behavioral Questions
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Question */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {currentQuestion.question}
          </h3>

          {/* Text response */}
          <div className="mb-4">
            <label htmlFor="textResponse" className="form-label">
              Your Answer
            </label>
            <textarea
              id="textResponse"
              className="form-input min-h-[120px]"
              placeholder="Type your answer here..."
              value={currentQuestion.textResponse}
              onChange={(e) =>
                updateBehavioralResponse(0, "textResponse", e.target.value)
              }
              disabled={loading || isSubmitting}
            ></textarea>
            {formErrors.textResponse && (
              <p className="error-text">{formErrors.textResponse}</p>
            )}
          </div>
        </div>

        {/* Form error message */}
        {formErrors.submit && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {formErrors.submit}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
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
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BehavioralQuestions;
