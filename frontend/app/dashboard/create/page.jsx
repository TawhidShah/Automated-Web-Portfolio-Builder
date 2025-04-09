import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import CreatePortfolioClient from "./CreatePortfolioClient";
import getPortfolio from "@/lib/getPortfolio";

const CreatePortfolioPage = async () => {
  const { username } = await currentUser();

  const existingPortfolio = await getPortfolio(username);

  if (existingPortfolio) {
    redirect("/dashboard");
  }

  return <CreatePortfolioClient />;
};

export default CreatePortfolioPage;
