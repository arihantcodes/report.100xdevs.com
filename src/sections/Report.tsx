"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast , { Toaster } from 'react-hot-toast';
import { Textarea } from "@/components/ui/textarea";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    url: "",
    reportedBy: "",
    email: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/report", formData);
      console.log(response.data);
      toast.success('Report submitted successfully!');
      // Reset form data after successful submission
      setFormData({
        url: "",
        reportedBy: "",
        email: "",
        reason: "",
      });
    } catch (error:any) {
      console.error("Error submitting report:", error);
      toast.error('Error submitting report: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-16">
      <h1 className="font-bold text-5xl mb-8 text-white text-center">
        Join the Fight Against<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600"> Piracy</span> <br /> & Get Rewarded
      </h1>
      <Card className="w-full max-w-lg bg-white p-8 text-black rounded-3xl shadow-xl">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Report Form
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-gray-700">Pirated Content URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              required
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              onChange={handleInputChange}
              value={formData.url}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reportedBy" className="text-gray-700">Twitter Username</Label>
            <Input
              id="reportedBy"
              name="reportedBy"
              type="text"
              required
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              onChange={handleInputChange}
              value={formData.reportedBy}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason" className="text-gray-700">Reason for Report</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Please provide details..."
              required
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              onChange={handleInputChange}
              value={formData.reason}
            />
          </div>
        </CardContent>
        <CardFooter className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg py-2 hover:from-purple-600 hover:to-indigo-600" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};

export default ReportForm;