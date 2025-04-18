import { createContext, useState, useContext, useEffect } from "react";

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState({
    // Page 1: Candidate Details
    name: "",
    email: "",
    phone: "",

    // Page 2: Resume Upload
    resume: null,
    resumeFileName: "",

    // Page 3: Behavioral Questions
    behavioralResponses: [
      {
        question: "Why are you interested in joining this organisation?",
        textResponse: "",
      },
    ],
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load application from localStorage on mount
  useEffect(() => {
    const savedApplication = localStorage.getItem("jobApplication");
    if (savedApplication) {
      try {
        console.log("Loading saved application from localStorage");
        const parsedData = JSON.parse(savedApplication);
        setApplicationId(parsedData.applicationId);
        setFormData(parsedData.formData);
        setStep(parsedData.step || 1);

        // If application was already submitted, go to success page
        if (parsedData.submitted) {
          setSubmitted(true);
          setStep(4); // Success page
        }
      } catch (error) {
        console.error("Error parsing saved application:", error);
      }
    }
  }, []);

  // Save application to localStorage when it changes
  useEffect(() => {
    if (applicationId) {
      console.log("Saving application to localStorage");
      localStorage.setItem(
        "jobApplication",
        JSON.stringify({
          applicationId,
          formData,
          step,
          submitted,
        })
      );
    }
  }, [applicationId, formData, step, submitted]);

  // Update form data
  const updateFormData = (field, value) => {
    console.log(`Updating form field ${field} with value:`, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear any errors for this field
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update behavioral response
  const updateBehavioralResponse = (index, field, value) => {
    console.log(
      `Updating behavioral response ${index}.${field} with value:`,
      value
    );
    setFormData((prev) => {
      const newResponses = [...prev.behavioralResponses];
      newResponses[index] = {
        ...newResponses[index],
        [field]: value,
      };
      return {
        ...prev,
        behavioralResponses: newResponses,
      };
    });
  };

  // Navigate to next step
  const nextStep = () => {
    const newStep = Math.min(step + 1, 4);
    console.log(`Moving from step ${step} to ${newStep}`);
    setStep(newStep);
  };

  // Navigate to previous step
  const prevStep = () => {
    const newStep = Math.max(step - 1, 1);
    console.log(`Moving from step ${step} to ${newStep}`);
    setStep(newStep);
  };

  // Set specific step
  const goToStep = (stepNumber) => {
    console.log(`Directly going to step ${stepNumber}`);
    setStep(stepNumber);
  };

  // Reset form
  const resetForm = () => {
    console.log("Resetting form");
    setFormData({
      name: "",
      email: "",
      phone: "",
      resume: null,
      resumeFileName: "",
      behavioralResponses: [
        {
          question: "Why are you interested in joining this organisation?",
          textResponse: "",
        },
      ],
    });
    setApplicationId(null);
    setFormErrors({});
    setSubmitted(false);
    setStep(1);
    localStorage.removeItem("jobApplication");
  };

  return (
    <FormContext.Provider
      value={{
        step,
        formData,
        formErrors,
        loading,
        applicationId,
        submitted,
        setApplicationId,
        setFormErrors,
        setLoading,
        setSubmitted,
        updateFormData,
        updateBehavioralResponse,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
