import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PinProvider, usePin } from "@/app/context/PinContext";

function TestConsumer() {
  const { unlocked, unlock, lock } = usePin();

  return (
    <div>
      <div data-testid="state">{unlocked ? "UNLOCKED" : "LOCKED"}</div>
      <button onClick={unlock}>unlock</button>
      <button onClick={lock}>lock</button>
    </div>
  );
}

test("default state is locked", () => {
  render(
    <PinProvider>
      <TestConsumer />
    </PinProvider>
  );

  expect(screen.getByTestId("state").textContent).toBe("LOCKED");
});

test("unlock sets state to unlocked", () => {
  render(
    <PinProvider>
      <TestConsumer />
    </PinProvider>
  );

  fireEvent.click(screen.getByText("unlock"));

  expect(screen.getByTestId("state").textContent).toBe("UNLOCKED");
});

test("lock sets state back to locked", () => {
  render(
    <PinProvider>
      <TestConsumer />
    </PinProvider>
  );

  fireEvent.click(screen.getByText("unlock"));
  fireEvent.click(screen.getByText("lock"));

  expect(screen.getByTestId("state").textContent).toBe("LOCKED");
});

test("usePin throws error outside provider", () => {
  function BadComponent() {
    usePin();
    return null;
  }

  expect(() => render(<BadComponent />)).toThrow(
    "usePin must be used inside PinProvider"
  );
});
