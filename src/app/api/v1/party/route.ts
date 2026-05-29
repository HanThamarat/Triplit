import { Party } from "@/entities/party";
import { setErrResponse, setResponse } from "@/hooks/response";
import { getDatabaseConnection } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const db = await getDatabaseConnection();
        const party = await db.getRepository(Party).find();
        
        return setResponse({
            status: 200,
            message: "Get all party successfully.",
            body: party,
        });
    } catch (err) {
        return setErrResponse({
            status: 500,
            message: "Have something worg.",
            err: err
        });
    }
}

export async function POST(req: NextRequest) {
    
}