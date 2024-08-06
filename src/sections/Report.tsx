"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

// Abusive words array (English and Hindi)
const abusiveWords = [
  // English words
  "abuse",
  "asshole",
  "bastard",
  "bitch",
  "bollocks",
  "bullshit",
  "crap",
  "cunt",
  "damn",
  "dick",
  "douche",
  "fag",
  "faggot",
  "fuck",
  "fucker",
  "fucking",
  "goddamn",
  "hell",
  "homo",
  "jerk",
  "kike",
  "motherfucker",
  "nigga",
  "nigger",
  "piss",
  "prick",
  "pussy",
  "shit",
  "slut",
  "spic",
  "twat",
  "wanker",
  "whore",

  // Hindi words
  "lund",
  "teri",
  "gand",
  "chutiya",
  "bhosdi",
  "madarchod",
  "behenchod",
  "gaand",
  "launda",
  "gaandmasti",
  "randi",
  "raand",
  "harami",
  "chinal",
  "kutta",
  "kamina",
  "kutti",
  "bhenchod",
  "bhen ke lode",
];

const containsAbusiveWords = (input: string) => {
  const lowercasedInput = input.toLowerCase();
  return abusiveWords.some((word) => lowercasedInput.includes(word));
};

// Define Zod schema with minimum character limits
const schema = z.object({
  url: z.string().url().nonempty("Pirated Content URL is required"),
  reportedBy: z
    .string()
    .min(3, "Twitter Username must be at least 3 characters")
    .nonempty("Twitter Username is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  reason: z
    .string()
    .min(10, "Reason for Report must be at least 10 characters")
    .nonempty("Reason for Report is required"),
});

type FormData = z.infer<typeof schema>;

const ReportForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>();
  const onSubmit = async (data: FormData) => {
    // Check for abusive words in the form data
    console.log(captcha);

    for (const key in data) {
      if (containsAbusiveWords(data[key as keyof FormData])) {
        toast.error("Please avoid using offensive language.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (captcha && captcha.length > 0 && captcha !== null) {
        const response = await axios.post("/api/v1/report", {...data, captcha});

        toast.success("Report submitted successfully!");
      }
      // Reset form data after successful submission
    } catch (error: any) {
      console.error("Error submitting report:", error);
      if (error.message === "Report already exists") {
        toast.error("Report already exists");
      }
      toast.error("someone already reported this");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-16 mb-16">
      <h1 className="font-bold text-5xl mb-8 text-white text-center">
        Join the Fight Against
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
          {" "}
          Piracy
        </span>{" "}
        <br /> & Get Rewarded
      </h1>
      <Card className="w-full max-w-lg bg-white p-8 text-black rounded-3xl shadow-xl">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Report Form
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-gray-700">
              Pirated Content URL
            </Label>
            <Input
              id="url"
              {...register("url")}
              placeholder="https://example.com"
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {errors.url && <p className="text-red-500">{errors.url.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reportedBy" className="text-gray-700">
              Twitter Username
            </Label>
            <Input
              id="reportedBy"
              {...register("reportedBy")}
              placeholder="x username"
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {errors.reportedBy && (
              <p className="text-red-500">{errors.reportedBy.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="your@email.com"
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason" className="text-gray-700">
              Reason for Report
            </Label>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="Please provide a detailed reason for your report."
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {errors.reason && (
              <p className="text-red-500">{errors.reason.message}</p>
            )}
          </div>
        </CardContent>
        <ReCAPTCHA
          className="ml-8"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={setCaptcha}
        />
        <CardFooter className="mt-6">
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg py-2 hover:from-purple-600 hover:to-indigo-600"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};

export default ReportForm;
