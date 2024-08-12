import Report from "@/models/report.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbconfig/dbconfig";

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { url, reportedBy, email, reason, captcha } = reqBody;

        // Check if captcha is valid
        if (!captcha || captcha.length < 100) {
            return NextResponse.json({ message: "Bot access is not allowed" }, { status: 400 });
        }

        // Ensure all fields are provided
        if (!url || !reportedBy || !email || !reason) {
            return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
        }

        // Validate URL format
        const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
        if (!urlRegex.test(url)) {
            return NextResponse.json({ message: "Please provide a valid URL" }, { status: 400 });
        }

        // Validate reason with at least 15 characters and 4 spaces
        const reasonRegex = /^(?=(?:.*\s){4,})[a-zA-Z0-9\s,.!?'-]{15,}$/;
        if (!reasonRegex.test(reason)) {
            return NextResponse.json({ message: "Please provide a valid reason with at least 15 characters and 4 spaces" }, { status: 400 });
        }

        // Validate reportedBy to ensure it's a valid name
        const reportedByRegex = /^[a-zA-Z]{2,}(?:\s[a-zA-Z]+){0,3}$/;
        if (!reportedByRegex.test(reportedBy)) {
            return NextResponse.json({ message: "Please provide a valid name" }, { status: 400 });
        }

        // Check if a report already exists for the given URL
        const existingReport = await Report.findOne({ url });
        if (existingReport) {
            return NextResponse.json({ message: "A report for this URL already exists" }, { status: 400 });
        }

        // Save the new report
        const newReport = new Report({
            url,
            reportedBy,
            email,
            status: "pending",
            reason,
        });

        const savedReport = await newReport.save();

        return NextResponse.json({
            message: "Report submitted successfully",
            data: { url: savedReport.url }
        }, { status: 201 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong while processing the report" }, { status: 500 });
    }
}
