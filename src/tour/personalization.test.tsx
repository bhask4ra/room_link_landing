import { useLayoutEffect, useReducer } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import * as THREE from "three";
import { buildApartment } from "./apartment";
import {
  initialPersonalization,
  personalizationReducer,
} from "./personalization";
import {
  RoomiePreferences,
  BedroomControls,
  BalconyControls,
  ResetPersonalization,
} from "../components/RoomControls";
import { RentCalculator } from "../components/RentCalculator";

// Exercise actual React controls, reducer and Three scene objects together.
// No WebGL context is needed to inspect the real scene graph.
it("keeps the rent and visible coffee cups in sync, without recreating the scene", async () => {
  const user = userEvent.setup();
  const apartment = buildApartment();
  const cup = apartment.root.getObjectByName("coffee-cup-4")!;
  const visibleCups = () =>
    [1, 2, 3, 4].filter(
      (n) => apartment.root.getObjectByName(`coffee-cup-${n}`)!.visible,
    ).length;
  function Kitchen() {
    const [state, dispatch] = useReducer(
      personalizationReducer,
      initialPersonalization,
    );
    useLayoutEffect(() => apartment.applyPersonalization(state, true), [state]);
    return (
      <RentCalculator
        people={state.people}
        onPeopleChange={(value) => dispatch({ type: "people", value })}
      />
    );
  }
  const view = render(<Kitchen />);
  try {
    expect(visibleCups()).toBe(3);
    for (const [people, rent] of [
      [4, "$2,100"],
      [2, "$4,200"],
      [3, "$2,800"],
    ] as const) {
      await user.click(screen.getByRole("button", { name: String(people) }));
      expect(visibleCups()).toBe(people);
      expect(screen.getByText(rent)).toBeVisible();
      expect(apartment.root.getObjectByName("coffee-cup-4")).toBe(cup);
    }
  } finally {
    view.unmount();
    apartment.dispose();
  }
});

it("applies reversible lifestyle, favorite, bedroom and balcony choices and resets all of them", async () => {
  const user = userEvent.setup();
  const apartment = buildApartment();
  function Personalize() {
    const [state, dispatch] = useReducer(
      personalizationReducer,
      initialPersonalization,
    );
    useLayoutEffect(() => apartment.applyPersonalization(state, true), [state]);
    return (
      <>
        <RoomiePreferences state={state} dispatch={dispatch} />
        <BedroomControls state={state} dispatch={dispatch} />
        <BalconyControls state={state} dispatch={dispatch} />
        <ResetPersonalization dispatch={dispatch} />
      </>
    );
  }
  const view = render(<Personalize />);
  const click = (name: string | RegExp) =>
    user.click(screen.getByRole("button", { name }));
  try {
    await click("Plantas por todas partes");
    await click("Con mascotas");
    const plants = apartment.root.children.filter((item) =>
      item.name.startsWith("plant-"),
    );
    expect(plants.length).toBeGreaterThan(0);
    expect(plants.every((item) => !item.visible)).toBe(true);
    expect(apartment.root.getObjectByName("house-cat")!.visible).toBe(false);
    await click("Trabajo desde casa");
    expect(
      screen.getByRole("button", { name: "Trabajo desde casa" }),
    ).toHaveAttribute("aria-pressed", "true");
    await click("Me gusta este perfil de ejemplo");
    expect(
      screen.getByRole("button", { name: "Me gusta este perfil de ejemplo" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(view.container.querySelectorAll(".heart-burst i")).toHaveLength(6);
    await click("Me gusta este perfil de ejemplo");
    expect(view.container.querySelector(".heart-burst")).toBeNull();
    await click("Malva");
    const bedding = apartment.root.getObjectByName(
      "custom-bedding",
    ) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
    expect(bedding.material.color.getHexString()).toBe("ad8dbb");
    await click(/Mi rincón de lectura/);
    const lamp = apartment.root.getObjectByName(
      "reading-light",
    ) as THREE.PointLight;
    expect(lamp.intensity).toBeGreaterThan(0);
    await click("Atardecer");
    expect(screen.getByRole("button", { name: "Atardecer" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    for (const name of [
      "Hablamos de los gastos",
      "Respetamos nuestros descansos",
      "Compartimos las tareas",
    ])
      await click(name);
    expect(
      screen.getByText("Ya tienen un buen comienzo para compartir hogar."),
    ).toBeVisible();
    await click("Restablecer mi depa");
    expect(plants.every((item) => item.visible)).toBe(true);
    expect(apartment.root.getObjectByName("house-cat")!.visible).toBe(true);
    expect(bedding.material.color.getHexString()).toBe("d6aabb");
    expect(lamp.intensity).toBe(0);
    expect(screen.getByRole("button", { name: "Mañana" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByText("0 de 3 acuerdos de ejemplo elegidos."),
    ).toBeVisible();
    expect(initialPersonalization.preferences).toEqual([
      "plants",
      "quiet",
      "pets",
    ]);
  } finally {
    view.unmount();
    apartment.dispose();
  }
});

it("animates a newly added cup and settles immediately with reduced motion", () => {
  const apartment = buildApartment();
  try {
    apartment.applyPersonalization(
      { ...initialPersonalization, people: 2 },
      true,
    );
    apartment.applyPersonalization({ ...initialPersonalization, people: 4 });
    const cup = apartment.root.getObjectByName("coffee-cup-4")!;
    expect(cup.scale.x).toBeLessThan(1);
    apartment.animate(0.016, false);
    expect(cup.scale.x).toBeGreaterThan(0.01);
    apartment.animate(0.016, true);
    expect(cup.scale.x).toBe(1);
  } finally {
    apartment.dispose();
  }
});
