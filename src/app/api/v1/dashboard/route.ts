import Report from "@/models/report.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbconfig/dbconfig";

connectDb();

export async function GET(request: NextRequest) {
    try {
       
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        
        let query = {};
        if (status) {
            query = { status };
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Fetch reports
        const reports = await Report.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

      
        const totalReports = await Report.countDocuments(query);

        return NextResponse.json({
            message: "Reports fetched successfully",
            data: reports,
            currentPage: page,
            totalPages: Math.ceil(totalReports / limit),
            totalReports
        }, { status: 200 });

    } catch (error: any) {
        console.log('Something went wrong while fetching reports');
        console.error(error);
        return NextResponse.json({ message: "Something went wrong while fetching reports" }, { status: 500 });
    }
}
