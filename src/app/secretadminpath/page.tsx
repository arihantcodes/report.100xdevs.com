"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { File, ListFilter, MoreHorizontal, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { stringify } from "csv-stringify/sync";
interface Report {
  reason: string;
  _id: string;
  url: string;
  status: string;
  reportedBy: string;
  email: string;
  createdAt: string;
}

interface Filters {
  approved: boolean;
  rejected: boolean;
  pending: boolean;
}

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    approved: false,
    rejected: false,
    pending: false,
  });
  const [isSending, setIsSending] = useState(false);
  const reportsPerPage = 10;

  const fetchReports = async (page: number) => {
    try {
      const params = {
        page: page.toString(),
        limit: reportsPerPage.toString(),
        ...(filters.approved && { status: "approved" }),
        ...(filters.rejected && { status: "rejected" }),
        ...(filters.pending && { status: "pending" }),
      };
      const response = await axios.get("/api/v1/dashboard", { params });
      setReports(response.data.data);
      setTotalReports(response.data.totalReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, filters]);

  const handleAction = async (reportId: string, action: string) => {
    try {
      const response = await axios.post("/api/v1/action", { reportId, action });

      fetchReports(currentPage);
    } catch (error) {
      console.error(`Error ${action} report:`, error);
    }
  };

  const getSentReportIds = () => {
    const sentReports = localStorage.getItem("sentReports");
    return sentReports ? JSON.parse(sentReports) : [];
  };

  const addSentReportId = (id: any) => {
    const sentReports = getSentReportIds();
    if (!sentReports.includes(id)) {
      sentReports.push(id);
      localStorage.setItem("sentReports", JSON.stringify(sentReports));
    }
  };

  const fetchApprovedData = async () => {
    try {
      const response = await axios.get("/api/v1/dashboard", {
        params: { status: "approved" },
      });
      const data = response.data;

      const uniqueReports = Array.from(
        new Set(data.data.map((report: { _id: any }) => report._id))
      ).map((id) =>
        data.data.find((report: { _id: unknown }) => report._id === id)
      );

      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      const sentReportIds = getSentReportIds();

      const filteredReports = uniqueReports.filter((report) => {
        const reportDate = new Date(report.updatedAt);
        return (
          reportDate >= twelveHoursAgo && !sentReportIds.includes(report._id)
        );
      });

      return filteredReports;
    } catch (error) {
      console.error("Error fetching approved data:", error);
      return [];
    }
  };

  const sendApprovedData = async () => {
    if (isSending) {
      return;
    }
    setIsSending(true);
    try {
      const approvedReports = await fetchApprovedData();
  
      if (approvedReports.length === 0) {
        console.log("No new approved reports to send.");
        return;
      }
  
      // Prepare data for CSV
      const csvData = approvedReports.map((report) => ({
        URL: report.url,
        Email: report.email,
        ReportedBy: report.reportedBy,
        Status: report.status,
        Reason: report.reason,
        CreatedAt: new Date(report.createdAt).toLocaleString(),
      }));
  
      // Generate CSV string
      const csvString = stringify(csvData, {
        header: true,
        columns: [
          "URL",
          "Email",
          "ReportedBy",
          "Status",
          "Reason",
          "CreatedAt",
        ],
      });
  
      // Send CSV 
      const response = await axios.post("/api/v1/whatsapp", {
        fileName: "approved_reports.csv",
        fileContent: csvString,
      });
  
      if (response.status === 200) {
        console.log("CSV sent to WhatsApp successfully.");
      } else {
        console.error("Failed to send CSV to WhatsApp.");
      }
  
      // Mark reports as sent
      approvedReports.forEach((report) => {
        addSentReportId(report._id);
      });
    } catch (error) {
      console.error("Error in sendApprovedData:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
    } finally {
      setIsSending(false);
    }
  };
  
  

  useEffect(() => {
    const fetchAndSendData = async () => {
      await fetchApprovedData();
      await sendApprovedData();
    };

    fetchAndSendData();

    //  run the function every hour
    const intervalId = setInterval(fetchAndSendData, 60 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const startReportIndex = (currentPage - 1) * reportsPerPage + 1;
  const endReportIndex = Math.min(currentPage * reportsPerPage, totalReports);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0 font-bold">
            100xDevs
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/admin.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.approved}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, approved: checked as boolean })
                      }
                    >
                      Approved
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.rejected}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, rejected: checked as boolean })
                      }
                    >
                      Rejected
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.pending}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, pending: checked as boolean })
                      }
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={sendApprovedData}
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Send Data To WhatsApp
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Manage your reports and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pirated Content URL</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Twitter username
                          </TableHead>
                          <TableHead className="hidden md:block">
                            Email
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Created at
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Reason
                          </TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report: Report) => (
                          <TableRow key={report._id}>
                            <TableCell className="font-medium max-w-[150px] truncate">
                              <Link
                                href={report.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {report.url}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                style={{
                                  color:
                                    report.status === "approved"
                                      ? "green"
                                      : report.status === "rejected"
                                      ? "red"
                                      : "black",
                                  borderColor:
                                    report.status === "approved"
                                      ? "green"
                                      : report.status === "rejected"
                                      ? "red"
                                      : "gray",
                                }}
                              >
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[100px] truncate hidden md:block">
                              {report.reportedBy}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell max-w-[150px] truncate">
                              {report.email}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {new Date(report.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell max-w-[200px] max-h-[100px] overflow-y-auto break-words">
                              {report.reason}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction(report._id, "approve")
                                    }
                                  >
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction(report._id, "reject")
                                    }
                                  >
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction(report._id, "delete")
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>{startReportIndex}</strong> to{" "}
                      <strong>{endReportIndex}</strong> of{" "}
                      <strong>{totalReports}</strong> reports
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        size="sm"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        size="sm"
                        variant="outline"
                        className="ml-2"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
