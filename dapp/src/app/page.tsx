import React from "react";
import Header from "@/components/header";
import Featured from "@/components/featured";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <section className="bg-secondary-500 poster pt-4 relative text-opacity-60 text-white sm:px-4">
      <Featured />
    </section>
  );
}
