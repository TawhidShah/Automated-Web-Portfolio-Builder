import { TemplateMappings } from "@/lib/TemplateMappings";
import ExamplePortfolio from "@/lib/ExamplePortfolio";
import { notFound } from "next/navigation";

const TemplatePage = async ({ params }) => {
  const { id } = await params;

  const SelectedTemplate = TemplateMappings[id];

  if (!SelectedTemplate) {
    return notFound();
  }

  return <SelectedTemplate portfolio={ExamplePortfolio} />;
};

export default TemplatePage;
