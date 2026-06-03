interface createQueryStringProps {
    name: string;
    value: string;
}

export default function createQueryString({
    name,
    value
}: createQueryStringProps) {
    const mergeValue = `${name}=${value}`;

    return mergeValue;
}