import  Footer  from "@/sections/Footer";
import Header from "@/sections/Header";
import  Hero  from "@/sections/Hero";
import ReportForm from "@/sections/Report";
import { TweetDemo } from "@/sections/Testimonials";

export default function Home() {
  return <div className="bg-black text-white">

    <Header/>
    <Hero/>
    <ReportForm />
    <TweetDemo/>
    <Footer/>
  </div>;
}
