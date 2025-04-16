import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpPageWrapper from "@/app/(auth)/sign-up/[[...sign-up]]/page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/auth/SignUpPage", () => () => <div>Sign Up Page Mock</div>);

describe("SignUpPageWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to /dashboard if already signed in", async () => {
    auth.mockResolvedValueOnce({ userId: "abc123" });

    await act(async () => {
      await SignUpPageWrapper();
    });

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  test("renders SignUpPage if not authenticated", async () => {
    auth.mockResolvedValueOnce({ userId: null });

    let page;
    await act(async () => {
      page = await SignUpPageWrapper();
    });

    render(page);
    expect(screen.getByText("Sign Up Page Mock")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
