import Report from "@/models/report.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbconfig/dbconfig";

connectDb();



// In-memory store for tracking requests
const rateLimitStore = new Map();
const RATE_LIMIT_TIME_FRAME = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 8; // Max 3 requests per IP per time frame

function rateLimit(request:NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.ip ;
    console.log('IP:', ip);
    
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, { count: 1, lastRequest: now });
    } else {
        const rateLimitData = rateLimitStore.get(ip);
        if (now - rateLimitData.lastRequest > RATE_LIMIT_TIME_FRAME) {
            // Reset the rate limit for the IP if the time frame has passed
            rateLimitStore.set(ip, { count: 1, lastRequest: now });
        } else {
            // Increment the request count for the IP
            rateLimitData.count++;
            rateLimitData.lastRequest = now;

            if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
                return false; // Rate limit exceeded
            }
        }
    }

    return true; // Within the rate limit
}




export async function POST(request: NextRequest) {
    try {

        if (!rateLimit(request)) {
            return NextResponse.json({
                message: 'Too many requests. Please try again later.',
                success: false
            }, { status: 429 });
        }


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
