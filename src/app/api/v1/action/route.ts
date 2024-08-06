import { NextRequest, NextResponse } from "next/server";
import Report from "@/models/report.model";
import { connectDb } from "@/dbconfig/dbconfig";

connectDb();

export async function POST(request: NextRequest) {
    try {
        const { reportId, action } = await request.json();

        if (!reportId || !action) {
            return NextResponse.json({ message: "Missing reportId or action" }, { status: 400 });
        }

        let result;
        switch (action) {
            case "approve":
                result = await Report.findByIdAndUpdate(reportId, { status: "approved" }, { new: true });
                break;
            case "reject":
                result = await Report.findByIdAndUpdate(reportId, { status: "rejected" }, { new: true });
                break;
            case "delete":
                result = await Report.findByIdAndDelete(reportId);
                break;
            default:
                return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        if (!result) {
            return NextResponse.json({ message: "Report not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Action performed successfully", data: result }, { status: 200 });

    } catch (error: any) {
       
        console.error(error);
        return NextResponse.json({ message: "Something went wrong while performing the action" }, { status: 500 });
    }
}
