import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/app/services/auth", () => ({
  loginWithEmail: jest.fn(() => Promise.resolve()),
  signupWithEmail: jest.fn(() => Promise.resolve()),
  loginWithGoogle: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/app/lib/firebase", () => ({
  auth: {},
}));

function TestConsumer() {
  const { user, initializing, loading } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? "LOGGED_IN" : "NO_USER"}</div>
      <div data-testid="initializing">{initializing ? "YES" : "NO"}</div>
      <div data-testid="loading">{loading ? "YES" : "NO"}</div>
    </div>
  );
}

test("initializing becomes false after auth resolves", async () => {
  const callbacks: Array<(user: unknown) => void> = [];

  (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
    callbacks.push(cb);
    return jest.fn();
  });

  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

  expect(screen.getByTestId("initializing").textContent).toBe("YES");

  await act(async () => {
    callbacks[0](null);
  });

  expect(screen.getByTestId("initializing").textContent).toBe("NO");
  expect(screen.getByTestId("user").textContent).toBe("NO_USER");
});

test("useAuth throws when used outside provider", () => {
  function BadComponent() {
    useAuth();
    return null;
  }

  expect(() => render(<BadComponent />)).toThrow(
    "useAuth must be used inside AuthProvider"
  );
});
