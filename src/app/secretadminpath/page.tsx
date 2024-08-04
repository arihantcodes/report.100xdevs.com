"use client";
import Image from "next/image";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

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
      const response = await fetch(`/api/v1/dashboard?page=${page}&limit=${reportsPerPage}`);
      const data = await response.json();
      setReports(data.data);
      setTotalReports(data.total); // Assume the API returns a 'total' field for the total number of reports
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalReports / reportsPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Created at</TableHead>
                      <TableHead>Reason for Report</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report: Report) => (
                      <TableRow key={report._id}>
                        <TableCell className="font-medium">
                          <Link href={report.url} target="_blank" rel="noopener noreferrer">
                            {report.url}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.status}</Badge>
                        </TableCell>
                        <TableCell>{report.reportedBy}</TableCell>
                        <TableCell className="hidden md:table-cell">{report.email}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(report.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
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
                    Showing <strong>{(currentPage - 1) * reportsPerPage + 1}</strong> to{" "}
                    <strong>{Math.min(currentPage * reportsPerPage, totalReports)}</strong> of{" "}
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
  );
};

export default Dashboard;
