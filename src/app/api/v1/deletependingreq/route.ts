import { connectDb } from "@/dbconfig/dbconfig";    

import Report from "@/models/report.model";

import { NextRequest, NextResponse } from "next/server";


connectDb();


export async function DELETE(request: NextRequest) {
    try {
        // delete pending request
        // const reqBody = await request.json();
        const res = await Report.deleteMany({ status: "pending" });
        if (res.deletedCount === 0) {
            return NextResponse.json({ message: "No pending requests to delete" }, { status: 404 });
        }
        return NextResponse.json({ message: "Deleted all pending requests" }, { status  : 200 });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong while connecting" }, { status: 500 });
        
    }
}