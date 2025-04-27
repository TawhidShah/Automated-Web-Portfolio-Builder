"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getInitials } from "@/lib/utils";

const Header = ({ portfolio }) => {
  const { personal, professional_summary, education, experience, skills, projects, certifications } = portfolio;

  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: "professional_summary", label: "About Me", exists: !!professional_summary },
    { id: "education", label: "Education", exists: education?.length > 0 },
    { id: "experience", label: "Experience", exists: experience?.length > 0 },
    { id: "skills", label: "Skills", exists: skills?.technical?.length > 0 || skills?.soft?.length > 0 },
    { id: "projects", label: "Projects", exists: projects.length > 0 },
    { id: "certifications", label: "Certifications", exists: certifications?.length > 0 },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full py-6 shadow-lg backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        {personal?.name && (
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center border-2 border-[#64ffda] text-lg font-bold text-white shadow-md"
          >
            {getInitials(personal.name)}
          </a>
        )}

        <nav className="hidden gap-6 md:flex">
          {sections.map(
            (section) =>
              section.exists && (
                <a key={section.id} href={`#${section.id}`} className="text-sm font-medium hover:text-[#64ffda]">
                  {section.label}
                </a>
              ),
          )}
        </nav>

        <button onClick={() => setMenuOpen(true)} className="md:hidden">
          <Menu size={30} />
        </button>
      </div>

      <div
        className={`fixed left-0 top-0 flex h-screen w-screen flex-col items-center justify-center bg-background transition-transform duration-300 ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <button onClick={() => setMenuOpen(false)} className="absolute right-6 top-6">
          <X size={36} />
        </button>

        <nav className="flex flex-col gap-6 text-center">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-medium transition duration-300 hover:text-[#64ffda]"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
