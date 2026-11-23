import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ImmersiveTour from "./ImmersiveTour";

const journey = vi.hoisted(() => ({
  container: { current: null },
  progress: { current: 0 },
  stage: 1,
  opacity: 1,
  interactive: true,
  reducedMotion: false,
}));
vi.mock("./useJourney", () => ({ useJourney: () => journey }));
// Only the GPU boundary is replaced; React state, panels and controls are real.
vi.mock("./ApartmentWorld", () => ({
  default: () => <div aria-label="Escena de prueba" />,
}));

it("mounts one panel, removes hidden controls from accessibility and preserves choices between rooms", async () => {
  const user = userEvent.setup();
  const view = render(<ImmersiveTour loginUrl="https://example.com/login" />);
  await user.click(
    screen.getByRole("button", { name: "Me gusta este perfil de ejemplo" }),
  );
  journey.opacity = 0;
  journey.interactive = false;
  view.rerender(<ImmersiveTour loginUrl="https://example.com/login" />);
  expect(view.container.querySelectorAll(".stage-panel")).toHaveLength(1);
  expect(view.container.querySelector(".stage-panel")).toHaveAttribute("inert");
  expect(
    screen.queryByRole("button", { name: "Me gusta este perfil de ejemplo" }),
  ).toBeNull();
  journey.stage = 2;
  journey.opacity = 1;
  journey.interactive = true;
  view.rerender(<ImmersiveTour loginUrl="https://example.com/login" />);
  await user.click(screen.getByRole("button", { name: "4" }));
  journey.stage = 1;
  view.rerender(<ImmersiveTour loginUrl="https://example.com/login" />);
  expect(
    screen.getByRole("button", { name: "Me gusta este perfil de ejemplo" }),
  ).toHaveAttribute("aria-pressed", "true");
  journey.stage = 2;
  view.rerender(<ImmersiveTour loginUrl="https://example.com/login" />);
  expect(screen.getByText("$2,100")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Restablecer mi depa" }));
  expect(screen.getByText("$2,800")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Ver solo el depa" }));
  expect(view.container.querySelector(".stage-panel")).toHaveAttribute("inert");
  expect(screen.queryByText("$2,800")?.closest("section")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await user.click(screen.getByRole("button", { name: "Mostrar detalles" }));
  expect(screen.getByText("$2,800")).toBeVisible();
});

it("keeps the current room readable in reduced motion even during travel", () => {
  Object.assign(journey, {
    stage: 1,
    opacity: 0,
    interactive: false,
    reducedMotion: true,
  });
  const view = render(<ImmersiveTour loginUrl="https://example.com/login" />);
  expect(
    screen.getByRole("button", { name: "Plantas por todas partes" }),
  ).toBeVisible();
  expect(view.container.querySelector(".stage-panel")).not.toHaveAttribute(
    "inert",
  );
  expect(view.container.querySelector(".stage-panel")).toHaveStyle({
    opacity: "1",
  });
  expect(
    screen.getByRole("button", { name: "Fijar vista del departamento" }),
  ).toBeDisabled();
});

it("links the welcome call to action to the published login", () => {
  Object.assign(journey, {
    stage: 0,
    opacity: 1,
    interactive: true,
    reducedMotion: false,
  });
  render(<ImmersiveTour loginUrl="https://example.com/login" />);
  expect(screen.getByRole("link", { name: "Conoce RoomLink" })).toHaveAttribute(
    "href",
    "https://example.com/login",
  );
});
