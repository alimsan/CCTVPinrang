import { ReactNode } from "react";
import Navigation from "../Global/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-16">
        <Navigation/>
        {/* <BannerImage /> */}
      </div>
      <main className="flex-grow pt-16">{children}</main>
     {/*  <FooterLd /> */}
    </div>
  );
}