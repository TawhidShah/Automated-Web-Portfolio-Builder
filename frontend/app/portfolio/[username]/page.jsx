import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import getPortfolio from "@/lib/getPortfolio";
import { TemplateMappings, DefaultTemplate } from "@/lib/TemplateMappings";

const PortfolioPage = async ({ params }) => {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  const user = await currentUser();

  if (!portfolio) {
    return notFound();
  }

  if (portfolio.is_private && user?.username !== username) {
    return notFound();
  }

  const SelectedTemplate = TemplateMappings[portfolio.template] || DefaultTemplate;

  return <SelectedTemplate portfolio={portfolio} />;
};

export default PortfolioPage;
