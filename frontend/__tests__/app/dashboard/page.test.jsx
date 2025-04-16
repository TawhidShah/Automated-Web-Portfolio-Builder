import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "@/app/dashboard/page";
import { currentUser } from "@clerk/nextjs/server";
import getPortfolio from "@/lib/getPortfolio";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("@/lib/getPortfolio");

jest.mock("@/app/dashboard/DashboardClient", () => () => <div>Dashboard Client Mock</div>);

describe("DashboardPage", () => {
  beforeEach(() => {
    currentUser.mockResolvedValue({
      username: "john123",
      firstName: "John",
      lastName: "Doe",
    });
  });

  test("renders CreatePortfolioSection if no portfolio exists", async () => {
    getPortfolio.mockResolvedValueOnce(null);

    let pageComponent;
    await act(async () => {
      pageComponent = await DashboardPage();
    });

    render(pageComponent);

    expect(screen.getByText("Welcome to your dashboard John Doe!")).toBeInTheDocument();
    expect(screen.getByText("You haven't created a portfolio yet.")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Client Mock")).not.toBeInTheDocument();

    const createPortfolioLink = screen.getByRole("link", { name: "Create Portfolio" });
    expect(createPortfolioLink).toBeInTheDocument();

    expect(createPortfolioLink).toHaveAttribute("href", "/dashboard/create");
  });

  test("renders DashboardClient if portfolio exists", async () => {
    getPortfolio.mockResolvedValueOnce({ title: "My Portfolio" });

    let pageComponent;
    await act(async () => {
      pageComponent = await DashboardPage();
    });

    render(pageComponent);

    expect(screen.getByText("Welcome to your dashboard John Doe!")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Client Mock")).toBeInTheDocument();
    expect(screen.queryByText("You haven't created a portfolio yet.")).not.toBeInTheDocument();
  });
});
