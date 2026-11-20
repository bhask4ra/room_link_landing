import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { RentCalculator } from "./RentCalculator";
import { useState } from "react";

function Calculator() {
  const [people, setPeople] = useState<2 | 3 | 4>(3);
  return <RentCalculator people={people} onPeopleChange={setPeople} />;
}

it("updates the displayed rent using the actual split calculation", async () => {
  const user = userEvent.setup();
  render(<Calculator />);
  expect(screen.getByText("$2,800")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "4" }));
  expect(screen.getByText("$2,100")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "4" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(screen.getByText(/No es un anuncio/)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "2" }));
  expect(screen.getByText("$4,200")).toBeInTheDocument();
});
