import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { InfoDialog, type DialogKind } from "./InfoDialog";

it("opens and closes a local information dialog", async () => {
  function Example() {
    const [kind, setKind] = useState<DialogKind>(null);
    return (
      <>
        <button onClick={() => setKind("about")}>Abrir</button>
        <InfoDialog kind={kind} onClose={() => setKind(null)} />
      </>
    );
  }
  const user = userEvent.setup();
  render(<Example />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Abrir" }));
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(screen.getByText(/cifras son ilustrativos/)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
