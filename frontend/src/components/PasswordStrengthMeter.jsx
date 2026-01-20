import { CheckIcon, XIcon } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    {
      label: "Contains special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
  return (
    <div className="mt-2 space-y-1">
      {criteria.map((criterion, index) => (
        <div key={index} className="flex items-center text-xs">
          {criterion.met ? (
            <CheckIcon className="size-4 text-green-500 mr-1" />
          ) : (
            <XIcon className="size-4 text-red-500 mr-1" />
          )}
          <span className={criterion.met ? "text-green-500" : "text-red-500"}>
            {criterion.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^a-zA-Z0-9]/)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };
  
  const strengthLabels = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Moderate";
    if (strength === 3) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">
          {strengthLabels(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
