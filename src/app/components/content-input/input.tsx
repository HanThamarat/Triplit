"use client";

import {
    forwardRef,
    useId,
    useState,
    type InputHTMLAttributes,
} from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    isPassword?: boolean;
    error?: string;
    type?: string;
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        label,
        isPassword,
        error,
        id,
        type,
        className,
        showPasswordLabel = "Show password",
        hidePasswordLabel = "Hide password",
        ...props
    },
    ref,
) {
    const reactId = useId();
    const inputId = id ?? reactId;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword
        ? showPassword
            ? "text"
            : "password"
        : type ?? "text";

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-[13px] font-semibold text-ink"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    id={inputId}
                    ref={ref}
                    type={resolvedType}
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError ? errorId : undefined}
                    className={`w-full rounded-xl border bg-canvas px-4 py-3 text-[15px] text-ink transition-colors placeholder:text-ink-faint focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        isPassword ? "pr-11" : ""
                    } ${
                        hasError
                            ? "border-sunset-deep focus:border-sunset-deep focus:ring-sunset/30"
                            : "border-line-strong focus:border-coast-deep focus:ring-coast/30"
                    }${className ? ` ${className}` : ""}`}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
                        className="lp-focus absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-faint transition-colors hover:text-ink"
                    >
                        {showPassword ? (
                            <FiEyeOff className="h-[18px] w-[18px]" />
                        ) : (
                            <FiEye className="h-[18px] w-[18px]" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-[13px] font-medium text-sunset-deep"
                >
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
