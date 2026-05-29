import { NextResponse } from "next/server";

interface SetResponseProps {
    body: unknown;
    message: string;
    status: number;
}

interface SetErrResponseProps {
    err: unknown;
    message: string;
    status: number;
}

export const setResponse = (props: SetResponseProps) => {
    return NextResponse.json({
        message: props.message,
        status:props.status,
        body:props.body
    }, { status: props.status })
}

export const setErrResponse = (props: SetErrResponseProps) => {
    return NextResponse.json({
        message: props.message,
        status: props.status,
        error: props.err
    }, { status: props.status })
}