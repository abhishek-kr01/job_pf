import { useFormContext } from "../context/FormContext";

const Layout = ({ children }) => {
  const { step } = useFormContext();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-bold text-blue-700">
            Job Application Portal
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow py-8">
        <div className="container-custom">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      step >= stepNumber ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <div className="text-sm mt-2 text-gray-600">
                    {stepNumber === 1 && "Personal Info"}
                    {stepNumber === 2 && "Resume"}
                    {stepNumber === 3 && "Questions"}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(100, ((step - 1) / 3) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Card for content */}
          <div className="card">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container-custom text-center">
          <p>
            &copy; {new Date().getFullYear()} Job Application Portal. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
