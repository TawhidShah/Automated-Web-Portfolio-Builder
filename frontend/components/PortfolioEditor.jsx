"use client";

import PortfolioForm from "@/components/PortfolioForm";
import { useEffect, useRef, useState } from "react";

const PortfolioEditor = ({ portfolio, mode, onCancel }) => {
  const iframeRef = useRef(null);
  const livePreviewUrl = window.location.origin + "/live-preview";
  const [portfolioData, setPortfolioData] = useState(portfolio);

  useEffect(() => {
    const sendDataToIframe = () => {
      if (iframeRef.current && portfolioData) {
        iframeRef.current.contentWindow.postMessage({ portfolioData }, livePreviewUrl);
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", () => {
        sendDataToIframe();
      });
    }

    sendDataToIframe();
  }, [portfolioData, iframeRef.current]);

  return (
    <div className="flex flex-1 gap-4">
      <PortfolioForm
        portfolioData={portfolioData}
        setPortfolioData={setPortfolioData}
        mode={mode}
        onCancel={onCancel}
      />
      <iframe
        ref={iframeRef}
        src={livePreviewUrl}
        className="hidden max-h-[88vh] min-w-[50%] flex-1 rounded-md border xl:block"
      ></iframe>
    </div>
  );
};

export default PortfolioEditor;
