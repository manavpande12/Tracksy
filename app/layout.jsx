import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme.provider";
import Header from "@/components/header";
import { ClerkThemeProvider } from "@/components/clerkThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Tracksy - Smart Expense Tracker & AI Budget Planner",
  description:
    "Tracksy is an advanced expense tracker and budget management app. Easily scan receipts with AI, track monthly budgets, categorize transactions, and gain insights with powerful filters. Perfect for personal finance and money management.",
  keywords: [
    "Expense Tracker",
    "Budget Planner",
    "AI Receipt Scanner",
    "Personal Finance App",
    "Monthly Budget Tracker",
    "Track Spending",
    "Smart Finance Tool",
    "Transaction Filter",
    "Tracksy App",
    "Next.js Budget App",
  ],
  openGraph: {
    title: "Tracksy - Smart Expense Tracker & AI Budget Planner",
    description:
      "Manage your money wisely with Tracksy. Scan receipts using AI, plan budgets, and filter expenses easily. Built with Next.js for blazing-fast performance.",
    siteName: "Tracksy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracksy - Smart Expense Tracker & AI Budget Planner",
    description:
      "Track, scan, and manage expenses effortlessly with Tracksy - your intelligent budgeting assistant.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-bg1">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="bg-bg2 py-12">
              <div className="container mx-auto px-4 text-center text-text">
                <p>Made with ❤️ by MvP Coder</p>
              </div>
            </footer>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
