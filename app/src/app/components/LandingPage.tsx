"use client";
import React, { useState, useEffect } from "react";
import { LoginModal } from "./LoginModal";
import { Logo } from "./Logo";
import "aos/dist/aos.css";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import iphone from "../../../public/images/insightChat.png";
import macbook from "../../../public/images/final-mac.png";
import bottomIphone from "../../../public/images/bottom-half-iphone.png";
import browser from "../../../public/images/browser-dashboard.png";
import AOS from "aos";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { TextAnimate } from "@/components/ui/text-animate";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Card } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import ReviewCard from "./ReviewCard";
import icon from "../../../public/images/test.svg";
import userIcon1 from "../../../public/images/userIcon1.svg";
import userIcon2 from "../../../public/images/userIcon2.svg";
import userIcon3 from "../../../public/images/userIcon3.svg";
import userIcon4 from "../../../public/images/userIcon4.svg";
import userIcon5 from "../../../public/images/userIcon5.svg";
import userIcon6 from "../../../public/images/userIcon6.svg";
import userIcon7 from "../../../public/images/userIcon7.svg";
import userIcon8 from "../../../public/images/userIcon8.svg";
import userIcon9 from "../../../public/images/userIcon9.svg";

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "Upgrade anytime!",
    features: [
      "Complete analytics dashboard",
      "10 messages per month",
      "One account connection",
      "No AI Assistant chat history",
    ],
    buttonText: "Start Free Today",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$29.99",
    period: "per month",
    features: [
      "Complete analytics dashboard",
      "Unlimited messaging",
      "Unlimited account connection",
      "Full Chat History",
    ],
    buttonText: "Get Full Access",
    isPopular: true,
  },
  {
    name: "Growth",
    price: "$14.99",
    period: "per month",
    features: [
      "Complete analytics dashboard",
      "50 messages per month",
      "Two account connections",
      "No AI Assistant chat history",
    ],
    buttonText: "Start Growing",
    isPopular: false,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Cambree Bernkopf",
    username: "@cambree",
    title: "Product Designer",
    company: "Remi",
    body: "I've been using InsightAI for a few months now and it's made such a difference! The AI catches things I would've missed and the recommendations actually get what I'm trying to do.",
    avatar: userIcon1,
  },
  {
    id: 2,
    name: "Brent Wright",
    username: "@brentwright",
    title: "Founder & CEO",
    company: "Wright Landscaping",
    body: "InsightAI has been a game changer for our landscaping company! We were able to see which posts and days had the most traction. In the last 30 days, we gained over 300 followers!! We love InsightAI!!",
    avatar: icon,
  },
  {
    id: 3,
    name: "Jacob Wright",
    username: "@jakewright",
    title: "Software Engineer",
    company: "RunPod",
    body: "As a developer, I appreciate tools that just work. InsightAI nailed it. The multi-platform integration is seamless and it's like having a marketing expert available whenever I need one!",
    avatar: userIcon6,
  },
  {
    id: 4,
    name: "Sarah Chen",
    username: "@sarahchen",
    title: "Marketing Manager",
    company: "TechFlow",
    body: "We used to spend hours manually pulling analytics from different platforms. InsightAI cut that time in half! The AI insights are spot-on and it's become essential to our workflow.",
    avatar: userIcon4,
  },
  {
    id: 5,
    name: "Mike Torres",
    username: "@miketorres",
    title: "Content Creator",
    company: "Independent",
    body: "I was skeptical at first, but after a couple weeks, I'm hooked! My engagement is up over 200% and I finally understand what my audience wants. Best investment in my content career.",
    avatar: userIcon5,
  },
  {
    id: 6,
    name: "Emma Davis",
    username: "@emmadavis",
    title: "Social Media Director",
    company: "BrandBox",
    body: "Managing 5+ social platforms was a nightmare before InsightAI. Now I have everything in one dashboard and can actually make sense of the data. This is exactly what I've been looking for!",
    avatar: userIcon3,
  },
  {
    id: 7,
    name: "Alex Kumar",
    username: "@alexkumar",
    title: "Growth Hacker",
    company: "StartupLab",
    body: "Data-driven decisions are crucial for startups, but we didn't have time to dig through analytics all day. InsightAI gives us the insights we need and our engagement metrics have never looked better!",
    avatar: userIcon7,
  },
  {
    id: 8,
    name: "Lisa Martinez",
    username: "@lisamartinez",
    title: "Brand Strategist",
    company: "Creative Co",
    body: "The AI recommendations are seriously incredible. I used to spend 5-6 hours a week on competitive analysis. InsightAI does it better and faster, so I can focus on strategy instead of data collection!",
    avatar: userIcon8,
  },
  {
    id: 9,
    name: "David Park",
    username: "@davidpark",
    title: "Digital Marketer",
    company: "GrowthHQ",
    body: "Simple, powerful, and effective. I've tried so many analytics tools over the years and this is the one that finally clicked. It gives me exactly what I need without overcomplicating things.",
    avatar: userIcon9,
  },
  {
    id: 10,
    name: "Rachel Green",
    username: "@rachelgreen",
    title: "Influencer",
    company: "Independent",
    body: "InsightAI helped me figure out what content actually resonates with my followers. I know what works and when to post it now. My brand partnerships have doubled in the last 3 months!",
    avatar: userIcon2,
  },
];
const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const faqData = [
  {
    question: "What social media platforms does InsightAi support?",
    answer:
      "InsightAi currently supports Instagram, X, Facebook, and TikTok. We're continuously adding support for more platforms based on user feedback and demand.",
  },
  {
    question: "How does the AI assistant provide personalized recommendations?",
    answer:
      "Our AI analyzes your social media data including engagement rates, audience demographics, posting patterns, and content performance to provide tailored advice. It learns from your specific metrics to suggest optimal posting times, content strategies, and growth tactics that work for your unique audience.",
  },
  {
    question: "Is my social media data secure and private?",
    answer:
      "Absolutely. We use enterprise-grade encryption and security measures to protect your data. We never share your personal information or social media data with third parties. You maintain full control over your data and can delete it at any time.",
  },
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes, you can change your subscription plan at any time. Upgrades take effect immediately, while downgrades will take effect at the start of your next billing cycle. Any unused credits or features will be prorated accordingly.",
  },
  {
    question: "What kind of analytics and insights can I expect?",
    answer:
      "You'll get comprehensive analytics including engagement rates, audience growth, optimal posting times, content performance metrics, hashtag effectiveness, competitor analysis, and trend identification. Our AI provides actionable insights to help you improve your social media strategy.",
  },
  {
    question: "Can I connect multiple accounts from the same platform?",
    answer:
      "Yes, depending on your plan. The Growth plan allows 2 account connections total, while the Pro plan supports unlimited connections from any platform. This is perfect for agencies or users managing multiple brands.",
  },
];

const LandingPage = () => {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentAdjectiveIndex, setCurrentAdjectiveIndex] = useState(0);
  const adjectives = ["Intelligent", "Personal", "Advanced", "Powerful"];
  const [emailStatus, setEmailStatus] = useState("");

  async function pushEmail() {
    if (!email) return;
    setEmailStatus("");

    const { error } = await supabase.from("emails").insert([{ email }]);
    if (!error) {
      setEmail("");
      setEmailStatus("success");
      setTimeout(() => setEmailStatus(""), 4000);
    } else {
      console.error(error);
      setEmailStatus("error");
      setTimeout(() => setEmailStatus(""), 5000);
    }
  }

  const scrollToSection = (sectionClass: string) => {
    const section = document.querySelector(sectionClass);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdjectiveIndex(
        (prevIndex) => (prevIndex + 1) % adjectives.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [adjectives.length]);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="relative max-w-screen overflow-x-hidden radial-gradient-bg overflow-y-hidden">
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <header className="fixed top-0 left-0 right-0 z-40 flex flex-row justify-between items-center sm:px-12 px-6 py-4 bg-[#0D0E11]/70">
        <div className="flex flex-row items-center w-full">
          <Logo className="sm:w-12 sm:h-12 w-10 h-10" />
          <span className="sm:text-2xl text-lg text-white">InsightAI</span>
        </div>

        <div className="lg:flex-row justify-between w-3/5 lg:flex hidden">
          <span
            className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200"
            onClick={() => scrollToSection(".home-section")}
          >
            Home
          </span>
          <span
            className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200"
            onClick={() => scrollToSection(".features-section")}
          >
            Features
          </span>
          <span
            className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200"
            onClick={() => scrollToSection(".pricing-section")}
          >
            Pricing
          </span>
          <span
            className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200"
            onClick={() => scrollToSection(".faq-section")}
          >
            FAQs
          </span>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 hover:text-gray-300 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="lg:flex flex-row justify-end gap-4 pb-0 w-full hidden">
          <button
            className="px-4 cursor-pointers button-gradient p-2 text-black"
            onClick={() => setIsLoginOpen(true)}
          >
            Login
          </button>
          <button
            className="px-4 cursor-pointer rounded-2xl bg-white hover:bg-gray-200 text-black"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-64 bg-[#0D0E11]/95 backdrop-blur-md border-l border-gray-800">
            <div className="flex flex-col pt-20 px-6 space-y-6">
              <span
                className="text-white cursor-pointer hover:text-gray-200 transition-colors duration-200 text-lg py-2"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </span>
              <span
                className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200 text-lg py-2"
                onClick={() => scrollToSection(".home-section")}
              >
                Home
              </span>
              <span
                className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200 text-lg py-2"
                onClick={() => scrollToSection(".features-section")}
              >
                Features
              </span>
              <span
                className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200 text-lg py-2"
                onClick={() => scrollToSection(".pricing-section")}
              >
                Pricing
              </span>
              <span
                className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200 text-lg py-2"
                onClick={() => scrollToSection(".faq-section")}
              >
                FAQs
              </span>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-screen min-h-screen w-full flex flex-col items-center justify-center home-section">
        <div className="flex flex-col items-center justify-center gap-6 mx-auto text-center w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 lg:h-[75vh] sm:h-[80vh] h-[90vh] mt-10 md:mt-0">
          <h1 className="text-6xl text-white animate-in fade-in zoom-in-95 duration-200">
            Your{" "}
            <span className="inline-block w-64 text-center">
              <span
                key={currentAdjectiveIndex}
                className="inline-block animate-in fade-in slide-in-from-bottom duration-500 text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#00f0ff]"
              >
                {adjectives[currentAdjectiveIndex]}
              </span>
            </span>{" "}
            AI Marketing Consultant
          </h1>
          <div className="text-white text-lg w-3/4 leading-relaxed text-center">
            <TextAnimate once animation="blurInUp">
              Save thousands with your own AI marketing consultant. Get expert
              insights on what works, when to post, and how to grow—without the
              expensive price tag.
            </TextAnimate>
          </div>
          <div className="sm:flex-row flex flex-col justify-evenly items-center sm:w-2/3 w-full gap-2">
            <Input
              className="sm:w-2/3 w-full rounded-2xl h-11 text-white bg-transparent border-gray-500 animate-in fade-in slide-in-from-bottom duration-1200"
              placeholder="Email Address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button
              className="sm:w-auto w-full button-gradient rounded-2xl text-black h-11 whitespace-nowrap animate-in fade-in slide-in-from-bottom duration-1200"
              onClick={() => pushEmail()}
            >
              Join Waitlist
            </button>
          </div>
        </div>

        <div className="relative w-full mx-auto sm:mt-2 mt-10 animate-in fade-in zoom-in-75 duration-500">
          <div className="relative w-full aspect-[16/9] max-h-[680px]">
            <div className="absolute inset-0 z-10">
              <Image
                src={macbook}
                alt="mac mockup"
                style={{ objectFit: "contain" }}
                className="pointer-events-none select-none scale-85"
                draggable={false}
              />
            </div>

            <div className="absolute right-10 top-0 w-[30%] h-full z-20 hidden sm:block right-2">
              <Image
                src={iphone}
                alt="iPhone mockup"
                fill
                style={{ objectFit: "contain", objectPosition: "bottom right" }}
                className="pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <div className="relative w-full bg-[#F6F7FA] rounded-t-xl z-30 xl:px-40">
          <div className="relative w-full h-fit flex flex-col justify-start items-center no-wrap py-35 features-section">
            <div className="flex flex-col gap-30">
              <span
                data-aos="zoom-in"
                className="text-center text-black font-inter text-5xl hidden lg:block"
              >
                Revolutionize your work
              </span>
              <div className="flex flex-col lg:flex-row lg:h-[80vh] h-[120vh] px-4 gap-3 text-black">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="500"
                  className="flex flex-col lg:h-auto h-3/4 w-full bg-white rounded-xl px-10 lg:pb-0 pb-5 overflow-x-hidden overflow-y-hidden lg:gap-0 gap-8"
                >
                  <div className="relative h-full">
                    <Image
                      src={bottomIphone}
                      alt="bottom half of iphone"
                      className="rounded-t-xl lg:scale-130 md:scale-100 scale-140"
                    />
                  </div>
                  <div className="flex flex-col justify-center lg:justify-left lg:text-left text-center h-full lg:gap-8 gap-4">
                    <div className="flex flex-col gap-3">
                      <span className="text-2xl">Your own AI assistant</span>
                      <TextAnimate
                        className="text-[#747781] lg:w-3/4 w-full"
                        once
                        animation="blurInUp"
                      >
                        Ask any question about your social media performance.
                        Get personalized marketing recommendations, content
                        optimization tips, and growth strategies based on your
                        actual data and audience behavior patterns.
                      </TextAnimate>
                    </div>
                    <div className="w-full flex justify-center lg:justify-start">
                      <button
                        className="button-gradient text-black semi-bold"
                        onClick={() => scrollToSection(".home-section")}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  data-aos="zoom-in"
                  data-aos-duration="500"
                  className="flex flex-col lg:h-auto h-3/4 w-full bg-white rounded-xl px-10 lg:pb-0 pb-5 overflow-x-hidden overflow-y-hidden lg:gap-0 gap-8"
                >
                  <div className="h-full w-full lg:hidden relative">
                    <Image
                      src={browser}
                      alt="browser"
                      fill
                      className="object-contain"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                  <div className="flex flex-col justify-center lg:justify-left lg:text-left text-center h-full lg:gap-8 gap-4">
                    <div className="flex flex-col gap-3">
                      <span className="text-2xl">
                        Multi-Platform Integration
                      </span>
                      <TextAnimate
                        className="text-[#747781] lg:w-3/4 w-full"
                        once
                        animation="blurInUp"
                      >
                        Seamlessly connect social media accounts across
                        different platforms. Sync your metrics, engagement data,
                        and audience insights all in one unified dashboard.
                      </TextAnimate>
                    </div>
                    <div className="w-full flex justify-center lg:justify-start">
                      <button
                        className="button-gradient text-black semi-bold"
                        onClick={() => scrollToSection(".home-section")}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                  <div className="h-full hidden lg:block lg:relative w-full mx-10">
                    <Image src={browser} alt="browser" fill />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:flex flex-col justify-center items-center h-[90vh] text-black lg:mb-0 mb-10 hidden">
            <div className="flex flex-col w-full justify-start items-center lg:pl-10 p-2 gap-4 text-center">
              <TextAnimate className="text-5xl" once animation="blurInUp">
                What Customers Say
              </TextAnimate>
              <TextAnimate
                className="lg:w-2/3 w-5/6 text-[#0D0E11] text-lg"
                once
                animation="blurInUp"
              >
                Read what our satisfied customers have to say about our
                products/services. We take pride in providing exceptional
                customer service and value their feedback.
              </TextAnimate>
            </div>
            <div className="flex justify-center items-center w-full overflow-hidden h-full">
              <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
                <Marquee pauseOnHover className="[--duration:40s]">
                  {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                  ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:40s] mt-8">
                  {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                  ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#F6F7FA]"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#F6F7FA]"></div>
              </div>
            </div>
          </div>
          <div className="relative w-full min-h-screen flex flex-col justify-center items-center gap-6 pricing-section bg-[#F6F7FA] pricing-section">
            <div className="text-center mb-16">
              <h2 className="text-5xl text-gray-900 mb-4">
                Choose Your Best Plan
              </h2>
            </div>
            <div className="flex lg:flex-row flex-col gap-10 px-4 w-full">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative rounded-2xl w-full p-8 ${
                    plan.isPopular
                      ? "bg-[#0D0E11] text-white transform lg:scale-110 shadow-2xl"
                      : "bg-white text-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  }`}
                  data-aos="zoom-in"
                >
                  <div className="flex flex-col w-full items-start text-center mb-8">
                    <div
                      className={`flex items-center mb-8 ${
                        plan.isPopular ? "rounded-lg pr-2" : ""
                      }`}
                    >
                      {plan.isPopular && <Logo width={25} height={25} />}
                      <h5
                        className={`font-semibold ${
                          plan.isPopular
                            ? "text-white"
                            : "bg-gray-200 rounded-lg p-1 text-gray-600"
                        }`}
                      >
                        {plan.name}
                      </h5>
                    </div>
                    <div className="mb-2">
                      <span className="text-5xl font-extrabold">
                        {plan.price}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        plan.isPopular ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {plan.period}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className={`flex items-start gap-3 ${
                          plan.isPopular
                            ? "border-b border-[#EFF1F7]/20"
                            : "border-b border-[#EFF1F7]"
                        } p-2`}
                      >
                        <span
                          className={`text-md ${
                            plan.isPopular ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-start w-1/2">
                    {plan.isPopular ? (
                      <RainbowButton
                        className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 sm:w-auto w-full whitespace-nowrap"
                        onClick={() => scrollToSection(".home-section")}
                      >
                        {plan.buttonText}
                      </RainbowButton>
                    ) : (
                      <button
                        className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 button-gradient sm:w-auto w-full whitespace-nowrap"
                        onClick={() => scrollToSection(".home-section")}
                      >
                        {plan.buttonText}
                      </button>
                    )}
                  </div>
                  {plan.isPopular && (
                    <>
                      <BorderBeam
                        duration={6}
                        size={500}
                        borderWidth={5}
                        className="from-transparent via-blue-500 to-transparent"
                      />
                      <BorderBeam
                        duration={6}
                        delay={3}
                        size={500}
                        borderWidth={5}
                        className="from-transparent via-blue-400 to-transparent"
                      />
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="relative w-full min-h-screen flex flex-col bg-[#F6F7FA] justify-center items-center gap-8 faq-section px-4 py-20 text-black mb-24 rounded-b-xl">
          <div className="text-center mb-12 max-w-4xl">
            <h2 className="text-5xl mb-6" data-aos="fade-up">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="multiple" className="lg:w-2/3 w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="overflow-hidden transition-all duration-300 hover:bg-white/10 border-bottom border-gray-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <AccordionTrigger className="px-6 py-6 text-left hover:no-underline group hover:bg-white/5 transition-colors duration-200">
                  <h3 className="text-xl font-semibold text-[#0D0E11] pr-4 text-left cursor-pointer">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[#0D0E11]/60 text-lg">{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <footer className="relative w-full text-white px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-around items-start lg:items-center mb-24 gap-8">
              <div className="">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Stop Guessing.
                  <br />
                  Start Growing.
                </h2>
                <p className="text-gray-400 text-lg mt-6 max-w-md">
                  Transform your social media data into actionable insights with
                  AI-powered analytics that actually help you grow your
                  audience.
                </p>
              </div>
              <div className="">
                <button
                  className="button-gradient text-black px-8 py-4 rounded-2xl font-semibold"
                  onClick={() => scrollToSection(".home-section")}
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 max-w-8xl mx-auto">
              <p className="text-gray-500 text-sm">
                Copyright © 2025. All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </section>
      {emailStatus && (
        <div
          className={`fixed bottom-6 left-6 z-50 p-4 rounded-lg shadow-lg border-2 transition-all duration-300 animate-in fade-in slide-in-from-left ${
            emailStatus === "success"
              ? "bg-black border-green-500 text-white"
              : "bg-black border-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {emailStatus === "success" ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span className="text-sm font-medium">
              {emailStatus === "success"
                ? "Thanks! You're on the waitlist!"
                : "Something went wrong. Please try again."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
