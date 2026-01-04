import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileModal from "@/app/modals/ProfileModal";

const user = {
  displayName: "Sir",
  email: "sir@test.com",
};

test("renders user name and email", () => {
  render(<ProfileModal user={user} onClose={jest.fn()} />);

  expect(screen.getByText(/Sir/)).toBeInTheDocument();
  expect(screen.getByText(/sir@test.com/)).toBeInTheDocument();
});

test("shows Anonymous when displayName is missing", () => {
  render(
    <ProfileModal user={{ email: "no-name@test.com" }} onClose={jest.fn()} />
  );

  expect(screen.getByText(/Anonymous/)).toBeInTheDocument();
});

test("clicking backdrop calls onClose", () => {
  const onClose = jest.fn();

  render(<ProfileModal user={user} onClose={onClose} />);

  fireEvent.click(
    screen.getByText("✨ This is you ✨").parentElement!.parentElement!
  );

  expect(onClose).toHaveBeenCalled();
});

test("clicking inside modal does not close", () => {
  const onClose = jest.fn();

  render(<ProfileModal user={user} onClose={onClose} />);

  fireEvent.click(screen.getByText("✨ This is you ✨"));

  expect(onClose).not.toHaveBeenCalled();
});

test("clicking Got it button closes modal", () => {
  const onClose = jest.fn();

  render(<ProfileModal user={user} onClose={onClose} />);

  fireEvent.click(screen.getByText(/Got it/i));

  expect(onClose).toHaveBeenCalled();
});
