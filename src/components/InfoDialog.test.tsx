import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { InfoDialog, type DialogKind } from "./InfoDialog";

it("opens the product information and closes without pretending registration exists", async () => {
  function Example() {
    const [kind, setKind] = useState<DialogKind>(null);
    return (
      <>
        <button onClick={() => setKind("app")}>Abrir</button>
        <InfoDialog kind={kind} onClose={() => setKind(null)} />
      </>
    );
  }
  const user = userEvent.setup();
  render(<Example />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Abrir" }));
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(
    screen.getByText(/todavía no incluye un enlace público/),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
