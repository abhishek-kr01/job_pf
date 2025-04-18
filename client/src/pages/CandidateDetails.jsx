import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { saveCandidateDetails } from "../services/api";

const CandidateDetails = () => {
  const {
    formData,
    formErrors,
    loading,
    applicationId,
    setApplicationId,
    setFormErrors,
    setLoading,
    updateFormData,
    nextStep,
  } = useFormContext();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form on submission
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[\d+\-()\s]{8,20}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      console.log("Submitting form data:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        applicationId: applicationId,
      });

      const response = await saveCandidateDetails({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        applicationId: applicationId,
      });

      console.log("Server response:", response);

      if (response.success) {
        setApplicationId(response.data._id);
        nextStep();
        navigate("/step-2");
      } else {
        setFormErrors({
          submit: response.message || "Failed to save data. Please try again.",
        });
        console.error("Form submission failed:", response);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormErrors({
        submit: error.message || "Failed to save data. Please try again.",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name field */}
        <div className="mb-4">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Abhishek Kumar"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            disabled={loading}
          />
          {formErrors.name && <p className="error-text">{formErrors.name}</p>}
        </div>

        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="abhi@example.com"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            disabled={loading}
          />
          {formErrors.email && <p className="error-text">{formErrors.email}</p>}
        </div>

        {/* Phone field */}
        <div className="mb-6">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="form-input"
            placeholder="+91 0000000000"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            disabled={loading}
          />
          {formErrors.phone && <p className="error-text">{formErrors.phone}</p>}
        </div>

        {/* Form error message */}
        {formErrors.submit && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {formErrors.submit}
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateDetails;
