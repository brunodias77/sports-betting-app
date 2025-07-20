import React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, size = "md", className = "", id, ...props },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      "w-full border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const stateClasses = error
      ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500"
      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500";

    const disabledClasses = props.disabled
      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
      : "bg-white text-gray-900";

    const inputClasses = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${disabledClasses} ${className}`;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${
            error ? "text-danger-700" : "text-gray-700"
          } ${props.disabled ? "text-gray-500" : ""}`}
        >
          {label}
          {props.required && (
            <span className="text-danger-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
