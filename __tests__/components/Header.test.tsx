import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/app/components/Header";

const logoutMock = jest.fn();

jest.mock("@/app/context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@test.com" },
    logout: logoutMock,
  }),
}));

jest.mock("@/app/modals/ProfileModal", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="profile-modal">
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

test("reads theme from localStorage on mount", () => {
  localStorage.setItem("theme", "light");

  render(<Header />);

  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test("toggles theme on button click", () => {
  localStorage.setItem("theme", "dark");

  render(<Header />);

  const toggleBtn = screen.getByRole("button", { name: /🌙|☀️/ });

  fireEvent.click(toggleBtn);

  expect(localStorage.getItem("theme")).toBe("light");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test("shows profile and logout when user is present", () => {
  render(<Header />);

  expect(screen.getByText("👤")).toBeInTheDocument();
  expect(screen.getByText("LOGOUT")).toBeInTheDocument();
});

test("calls logout when logout button clicked", () => {
  render(<Header />);

  fireEvent.click(screen.getByText("LOGOUT"));

  expect(logoutMock).toHaveBeenCalled();
});

test("opens and closes profile modal", () => {
  render(<Header />);

  fireEvent.click(screen.getByText("👤"));

  expect(screen.getByTestId("profile-modal")).toBeInTheDocument();

  fireEvent.click(screen.getByText("close"));

  expect(screen.queryByTestId("profile-modal")).not.toBeInTheDocument();
});
