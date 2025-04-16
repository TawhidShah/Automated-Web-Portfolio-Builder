import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Template2 = ({ portfolio }) => {
  const { personal, professional_summary, education, experience, skills, projects, certifications } = portfolio;

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{personal.name}</h1>
          <p className="text-xl">{personal.title}</p>
        </div>
      </header>

      <main className="container mx-auto space-y-12 px-4 py-8">
        <section id="personal" className="space-y-4">
          <h2 className="text-2xl font-semibold">Personal</h2>
          <div className="flex items-center space-x-6">
            <div>
              {personal.job_title && <p>Job Title: {personal.job_title}</p>}
              {personal.email && <p>Email: {personal.email}</p>}
              {personal.location && <p>Location: {personal.location}</p>}
              {personal.linkedin && <p>LinkedIn: {personal.linkedin}</p>}
              {personal.github && <p>GitHub: {personal.github}</p>}
            </div>
          </div>
        </section>

        {professional_summary && (
          <section id="professional_summary" className="space-y-4">
            <h2 className="text-2xl font-semibold">Professional Summary</h2>
            <div dangerouslySetInnerHTML={{ __html: professional_summary }}></div>
          </section>
        )}

        {education && (
          <section id="education" className="space-y-4">
            <h2 className="text-2xl font-semibold">Education</h2>
            {education?.map((edu, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p>{edu.institution}</p>
                  <p>{edu.grade}</p>
                  <p>
                    {edu.start_date} - {edu.end_date}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {experience && (
          <section id="experience" className="space-y-4">
            <h2 className="text-2xl font-semibold">Experience</h2>
            {experience?.map((job, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p>{job.company}</p>
                  <p>
                    {job.start_date} - {job.end_date}
                  </p>
                  <ul className="mt-2 list-inside list-disc">
                    {job.responsibilities?.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {skills && (
          <section id="skills" className="space-y-4">
            <h2 className="text-2xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.technical?.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.soft?.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
          </section>
        )}

        {projects && (
          <section id="projects" className="space-y-4">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {projects?.map((project, index) => (
                <Card key={index}>
                  <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, i) => (
                        <Badge key={i}>{tech}</Badge>
                      ))}
                    </div>

                    {project.url ? (
                      <Button className="mt-2" variant="outline" asChild>
                        <Link
                          href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project
                        </Link>
                      </Button>
                    ) : (
                      <Button className="mt-2" variant="outline" disabled>
                        View Project
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {certifications && (
          <section id="certifications" className="space-y-4">
            <h2 className="text-2xl font-semibold">Certifications</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {certifications?.map((cert, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p>{cert.issued_by}</p>
                    <p>{cert.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Template2;
