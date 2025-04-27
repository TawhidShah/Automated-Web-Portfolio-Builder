"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { TemplateMappings } from "@/lib/TemplateMappings";

const TemplateList = ({ getValues, setValue, errors }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isLargeDevice, setIsLargeDevice] = useState(false);

  // Check viewport width and update state accordingly
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      // If the viewport is not large, close the modal by resetting previewTemplate
      if (!isLarge) {
        setPreviewTemplate(null);
      }
      setIsLargeDevice(isLarge);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="mb-4 grid cursor-pointer grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Object.keys(TemplateMappings).map((id) => {
          const isSelected = getValues("template") === parseInt(id, 10);
          return (
            <div
              key={id}
              className={`flex flex-col items-center rounded-md border bg-gray-900 p-6 ${
                isSelected ? "border-blue-500" : ""
              }`}
              onClick={() => setValue("template", parseInt(id, 10))}
            >
              <p className="mb-2 text-sm font-medium">Template {id}</p>
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // On large devices, open the modal; otherwise, open a new tab.
                  if (isLargeDevice) {
                    setPreviewTemplate(id);
                  } else {
                    window.open(`/template/${id}`, "_blank");
                  }
                }}
              >
                View Example
              </Button>
            </div>
          );
        })}
        {errors?.template && <p className="text-red-500">Please select a template</p>}
      </div>

      {/* Only show modal on large devices */}
      {isLargeDevice && previewTemplate && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setPreviewTemplate(null);
          }}
        >
          <DialogContent className="flex min-h-[90vh] min-w-[90vw] flex-col">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-2xl">Template {previewTemplate} Preview</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(`/template/${previewTemplate}`, "_blank");
                    setPreviewTemplate(null);
                  }}
                >
                  <ExternalLink />
                </Button>
                <Button onClick={() => setPreviewTemplate(null)} variant="outline">
                  <X />
                </Button>
              </div>
            </DialogHeader>
            <iframe src={`/template/${previewTemplate}`} className="w-full flex-1 rounded-md border" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TemplateList;
