import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Home - Tracksy | Your Personal Expense Tracker",
  description:
    "Welcome to your Tracksy Dashboard — view your monthly budget, recent transactions, category breakdowns, and track expenses easily. AI-powered receipt scanning and smart filters help you stay on top of your finances.",
  keywords: [
    "Dashboard",
    "Expense Tracker",
    "Budget App",
    "Personal Finance",
    "Track Expenses",
    "Monthly Budgeting",
    "AI Receipt Scanner",
    "Smart Expense Filter",
    "Finance Dashboard",
    "Tracksy",
  ],
  openGraph: {
    title: "Tracksy Dashboard - Manage Your Finances Smartly",
    description:
      "Tracksy helps you manage your money with an intuitive dashboard. View insights, filter transactions, and plan smarter budgets using AI tools.",
    siteName: "Tracksy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracksy Dashboard - Your Finance Control Center",
    description:
      "Access your Tracksy dashboard to manage budgets, scan receipts, and monitor spending with ease.",
  },
};

const Home = () => {
  return (
    <div className="mt-40">
      <HeroSection />
      <section className="py-20 bg-gradient-to-br from-blue1 to-blue3">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stats, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2 text-white">
                  {stats.value}
                </div>
                <div className="text-text font-semibold">{stats.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your finances.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-txt">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-blue2 to-blue3">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="size-16 bg-bg2 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="tex-txt">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {" "}
            What Our User Say.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                  <div className="mb-4 flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-text">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-text text-justify">
                    {testimonial.quote}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue1 to-blue3">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-14 text-bg1 capitalize">
            Big change starts with a small steps are you ready?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-bg2 font-semibold capitalize ">
            Join the growing community of users who are rewriting their
            financial story. Tracksy empowers you with smart tools to take
            control of every ₹.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="animate-bounce bg-bg1 text-blue1 hover:bg-bg2 hover:text-blue3"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
