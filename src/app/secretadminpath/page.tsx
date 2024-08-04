"use client";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Search } from "lucide-react";

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
import { Input } from "@/components/ui/input";

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

interface Report {
  reason: string;

  _id: string;
  url: string;
  status: string;
  reportedBy: string;
  email: string;
  createdAt: string;
}

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const reportsPerPage = 10;

  const fetchReports = async (page: number) => {
    try {
      const response = await fetch(
        `/api/v1/dashboard?page=${page}&limit=${reportsPerPage}`
      );
      const data = await response.json();
      setReports(data.data);
      setTotalReports(data.totalReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const handleAction = async (reportId: string, action: string) => {
    try {
      const response = await fetch(`/api/v1/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await response.json();
      console.log(data);

      fetchReports(currentPage);
    } catch (error) {
      console.error(`Error ${action} report:`, error);
    }
  };

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
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
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
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Manage your reports and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pirated Content URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Twitter username</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created at
                        </TableHead>
                        <TableHead>Reason for Report</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report: Report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">
                            <Link
                              href={report.url}
                              target="_blank"
                              rel="noopener noreferrer"
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

                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {report.email}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(report.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>{report.reason}</TableCell>
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
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between w-full">
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>{startReportIndex}</strong> to{" "}
                      <strong>{endReportIndex}</strong> of{" "}
                      <strong>{totalReports}</strong> reports
                    </div>

                    <div>
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
