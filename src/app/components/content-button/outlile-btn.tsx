import React from "react";

interface ButtonComponentProps {
    label?: string;
    color?: string;
    textColor?: string;
    type?: "submit" | "reset" | "button" ;
    isLoading?: boolean;
    icons?: React.ReactNode;
    onClick?: () => void;
}

export default function OutlineButtonComponent({
    label,
    color,
    textColor,
    type,
    isLoading,
    icons,
    onClick
}: ButtonComponentProps) {
    return(
        <button
            type={ type && "button" }
            className={`cursor-pointer w-full gap-2 py-[10px] rounded-[8px] px-[16px] justify-center flex items-center ${ color ? color : 'border-white' } border disabled:bg-gray-300`}
            disabled={isLoading}
            onClick={onClick}
        >
            {isLoading && (
               
                <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2" />
            ) }
            {icons}
            <p className={` ${ textColor ? textColor : "text-white" } `}>{label}</p>
        </button>
    );
}