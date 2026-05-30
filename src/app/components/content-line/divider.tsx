
interface DividerProps {
    label?: string;
}

export default function Divider({
    label
}: DividerProps) {
    return(
        <div className="flex justify-center items-center w-full gap-[15px]">
            <div className="w-full rounded-full border border-[#2D2C38]"></div>
            <p>{label}</p>
            <div className="w-full rounded-full border border-[#2D2C38]"></div>
        </div>
    );
}