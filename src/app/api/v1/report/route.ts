import Report from "@/models/report.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbconfig/dbconfig";

connectDb();

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json();
        const { url, reportedBy,email, reason } = reqBody;

        if (!url || !reportedBy || !email || !reason) {
            return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
        }

        // valid email check

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Please provide a valid email" }, { status: 400 });
        }
        

        const existingReport = await Report.findOne({ url });

        if (existingReport) {
            return NextResponse.json({ message: "Report already exists" }, { status: 400 });
        }

        const newReport = new Report({
            url,
            reportedBy,
            email,
            status: "pending",
            reason
        });

        const savedReport = await newReport.save();

        return NextResponse.json({
            message: "Report submitted successfully",
            data: savedReport
        }, { status: 201});

    } catch (error: any) {
        console.log('Something went wrong while connecting to DB');
        console.error(error);
        return NextResponse.json({ message: "Something went wrong while connecting" }, { status: 500 });

    }

}