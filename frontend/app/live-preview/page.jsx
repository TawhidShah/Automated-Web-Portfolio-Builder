"use client";

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { TemplateMappings, DefaultTemplate } from "@/lib/TemplateMappings";
import { notFound } from "next/navigation";

const LivePreview = () => {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    // If the page is not embedded, show a 404 page
    if (window.top === window.self) {
      return notFound();
    }

    const handleMessage = (event) => {
      if (event.data?.portfolioData) {
        setPortfolio(event.data.portfolioData);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!portfolio) return <Loader />;

  const SelectedTemplate = TemplateMappings[portfolio.template] || DefaultTemplate;

  return <SelectedTemplate portfolio={portfolio} />;
};

export default LivePreview;
