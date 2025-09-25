import React, { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "@/components/layout/Navbar";
interface IProps {
  children: ReactNode;
}

const CommonLayout = ({ children }: IProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow-1">{children}</main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
