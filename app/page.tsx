import { Fraunces } from "next/font/google";
import { LandingPage } from "@/components/landing/landing-page";

const landingDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});

export default function HomePage(): React.ReactElement {
  return (
    <div className={landingDisplay.variable}>
      <LandingPage />
    </div>
  );
}
