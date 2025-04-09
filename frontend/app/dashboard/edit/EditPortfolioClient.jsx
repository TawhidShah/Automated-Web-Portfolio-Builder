"use client";

import PortfolioEditor from "@/components/PortfolioEditor";
import { useRouter } from "next/navigation";

const EditPortfolioClient = ({ portfolio }) => {
  const router = useRouter();

  return <PortfolioEditor portfolio={portfolio} mode="edit" onCancel={() => router.push("/dashboard")} />;
};

export default EditPortfolioClient;
