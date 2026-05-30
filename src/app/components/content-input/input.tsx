
interface InputProps {
    label?: string;
    placholder?: string;
    isPassword?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
}

export default function Input({
    label,
    placholder,
    isPassword,
    value,
    onChange,
    error,
    ...props
}: InputProps) {
    return(
        <div className="flex flex-col gap-[2px]">
            {label && <span>{label}</span> }
            <input
                type={ isPassword ? "password" : "text" }
                placeholder={placholder}
                value={value}
                onChange={(e) =>onChange && onChange(e.target.value)}
                className="w-full border border-[#71717d] rounded-[8px] py-[10px] px-[10px] focus:outline-2 focus:outline-[#464652] duration-100"
                {...props}
            />
            { error && <p className="text-red-400">{error}</p> }
        </div>
    );
}