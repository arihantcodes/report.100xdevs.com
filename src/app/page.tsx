import  Footer  from "@/sections/Footer";
import Header from "@/sections/Header";
import  Hero  from "@/sections/Hero";
import ReportForm from "@/sections/Report";
import { TweetDemo } from "@/sections/Testimonials";

export default function Home() {
  return <>

    <Header/>
    <Hero/>
    <ReportForm />
    <TweetDemo/>
    <Footer/>
  </>;
}
