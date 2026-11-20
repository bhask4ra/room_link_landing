import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { beddingColors, type Personalization } from "./personalization";

// All objects are original procedural geometry. No external models or paid assets.
export function buildApartment() {
  const root = new THREE.Group();
  const plants: THREE.Group[] = [];
  const cups: THREE.Group[] = [];
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const geometries = new Set<THREE.BufferGeometry>();
  const material = (color: string) => {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshStandardMaterial({ color, roughness: 0.88 }),
      );
    return materials.get(color)!;
  };
  function mesh(
    geometry: THREE.BufferGeometry,
    color: string,
    position: number[],
    parent: THREE.Group = root,
  ) {
    geometries.add(geometry);
    const item = new THREE.Mesh(geometry, material(color));
    item.position.set(position[0], position[1], position[2]);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }
  function box(
    size: number[],
    pos: number[],
    color: string,
    radius = 0.06,
    parent = root,
  ) {
    return mesh(
      new RoundedBoxGeometry(
        size[0],
        size[1],
        size[2],
        2,
        Math.min(radius, ...size.map((v) => v / 2)),
      ),
      color,
      pos,
      parent,
    );
  }
  function ball(size: number[], pos: number[], color: string, parent = root) {
    const item = mesh(new THREE.SphereGeometry(1, 20, 14), color, pos, parent);
    item.scale.set(size[0], size[1], size[2]);
    return item;
  }
  function cylinder(
    top: number,
    bottom: number,
    height: number,
    pos: number[],
    color: string,
    parent = root,
  ) {
    return mesh(
      new THREE.CylinderGeometry(top, bottom, height, 24),
      color,
      pos,
      parent,
    );
  }
  function plant(x: number, z: number, scale = 1, y = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    root.add(group);
    group.name = `plant-${plants.length}`;
    plants.push(group);
    cylinder(0.25, 0.19, 0.4, [0, 0.2, 0], "#e6bcb0", group);
    cylinder(0.22, 0.22, 0.035, [0, 0.4, 0], "#826f58", group);
    cylinder(0.025, 0.025, 0.9, [0, 0.83, 0], "#667c53", group);
    for (let i = 0; i < 6; i++) {
      const angle = i * 2.4;
      const leaf = ball(
        [0.17, 0.36, 0.08],
        [Math.sin(angle) * 0.18, 0.7 + i * 0.1, Math.cos(angle) * 0.18],
        i % 2 ? "#8ca77b" : "#aec69a",
        group,
      );
      leaf.rotation.set(Math.cos(angle) * 0.5, angle, Math.sin(angle) * 0.55);
    }
  }
  function person(
    x: number,
    z: number,
    shirt: string,
    skin: string,
    hair: string,
    angle = 0,
  ) {
    const person = new THREE.Group();
    person.position.set(x, 0.1, z);
    person.rotation.y = angle;
    root.add(person);
    box([0.16, 0.52, 0.2], [-0.13, 0.33, 0], "#707687", 0.07, person);
    box([0.16, 0.52, 0.2], [0.13, 0.33, 0], "#707687", 0.07, person);
    box([0.22, 0.14, 0.34], [-0.13, 0.12, 0.07], "#f5f0e5", 0.06, person);
    box([0.22, 0.14, 0.34], [0.13, 0.12, 0.07], "#f5f0e5", 0.06, person);
    ball([0.33, 0.42, 0.23], [0, 0.9, 0], shirt, person);
    const arm = ball([0.105, 0.34, 0.12], [-0.34, 0.86, 0], shirt, person);
    arm.rotation.z = -0.2;
    const arm2 = ball([0.105, 0.32, 0.12], [0.34, 0.95, 0.07], shirt, person);
    arm2.rotation.z = -0.5;
    ball([0.1, 0.12, 0.1], [-0.4, 0.6, 0], skin, person);
    ball([0.1, 0.12, 0.1], [0.48, 1.2, 0.08], skin, person);
    cylinder(0.1, 0.1, 0.15, [0, 1.25, 0], skin, person);
    ball([0.255, 0.29, 0.25], [0, 1.51, 0], skin, person);
    ball([0.27, 0.17, 0.26], [0, 1.69, -0.025], hair, person);
    ball([0.08, 0.19, 0.12], [-0.2, 1.55, -0.06], hair, person);
    ball([0.025, 0.032, 0.018], [-0.085, 1.52, 0.235], "#3b3332", person);
    ball([0.025, 0.032, 0.018], [0.085, 1.52, 0.235], "#3b3332", person);
    ball([0.055, 0.045, 0.055], [0, 1.45, 0.25], skin, person);
    return person;
  }

  // One connected apartment. Rear walls and low partitions keep the tour open.
  box([9.5, 0.38, 8.5], [0, -0.25, 0], "#e1d8ce", 0.17);
  box([9.3, 0.08, 8.3], [0, -0.02, 0], "#f1e8db", 0.06);
  for (let i = 0; i < 19; i++)
    box([0.012, 0.01, 8.1], [-4.4 + i * 0.49, 0.025, 0], "#dfd3c4", 0);
  box([9.4, 2.8, 0.18], [0, 1.38, -4.15], "#edeae5");
  box([0.18, 2.8, 8.35], [-4.65, 1.38, 0], "#f4eee8");
  box([0.1, 1.3, 3.8], [0.6, 0.65, -2.15], "#e7e5df");
  box([3.9, 0.15, 0.16], [-2.6, 0.1, -0.2], "#e5dfd3");
  // Large framed windows, with a pale blue sky and soft decorative clouds.
  for (const x of [-2.7, 2.5]) {
    box([2.6, 1.8, 0.12], [x, 1.6, -4.02], "#ffffff");
    box([2.35, 1.55, 0.05], [x, 1.6, -3.94], "#dcebec");
    box([0.07, 1.6, 0.1], [x, 1.6, -3.88], "#ffffff");
    box([2.4, 0.06, 0.1], [x, 1.55, -3.88], "#ffffff");
    box([2.85, 0.12, 0.32], [x, 0.71, -3.85], "#fcfaf7");
  }

  // Soft rose upholstery references the mobile app's mauve palette.
  box([3.4, 0.045, 2.65], [-2.3, 0.06, 2.05], "#d6cce7", 0.2);
  box([2.7, 0.36, 1.05], [-2.65, 0.4, 0.55], "#bc91ae", 0.16);
  box([2.7, 0.72, 0.3], [-2.65, 0.81, 0.08], "#d6b0c6", 0.14);
  box([0.3, 0.65, 1.1], [-4, 0.65, 0.55], "#d6c2d9", 0.14);
  box([0.3, 0.65, 1.1], [-1.3, 0.65, 0.55], "#d6c2d9", 0.14);
  for (const x of [-3.45, -2.65, -1.85])
    box([0.75, 0.2, 0.8], [x, 0.65, 0.62], "#e3c8d7", 0.1);
  const pillow = box([0.5, 0.47, 0.18], [-3.5, 0.95, 0.5], "#f5d6c8", 0.1);
  pillow.rotation.z = -0.2;
  box([0.5, 0.44, 0.2], [-1.8, 0.93, 0.44], "#eee8d6", 0.09).rotation.z = 0.18;
  cylinder(0.66, 0.68, 0.14, [-2.5, 0.54, 2.15], "#faf3e7");
  cylinder(0.25, 0.36, 0.46, [-2.5, 0.26, 2.15], "#d8bda5");
  box([0.45, 0.055, 0.3], [-2.7, 0.64, 2.1], "#a59abb", 0.02).rotation.y = -0.3;
  cylinder(0.09, 0.075, 0.15, [-2.25, 0.69, 2.2], "#d5a595");
  cylinder(0.25, 0.28, 0.05, [-4.05, 0.08, 2.25], "#ae9d84");
  cylinder(0.025, 0.025, 1.8, [-4.05, 0.98, 2.25], "#ad9576");
  cylinder(0.24, 0.45, 0.42, [-4.05, 1.95, 2.25], "#f6e5bc");
  plant(-4, 3.45, 0.9);
  person(-0.95, 2.65, "#b6a0d4", "#d9a17c", "#51403b", -0.6);
  person(-2.35, 3.3, "#e7b49e", "#efc6a3", "#655042", 0.5);

  // Kitchen: mauve cabinets and a shared coffee station.
  box([3.4, 0.82, 0.75], [-2.55, 0.43, -3.5], "#bda8c3", 0.04);
  box([3.55, 0.12, 0.85], [-2.55, 0.9, -3.48], "#fffaf0", 0.03);
  for (const x of [-3.6, -2.6, -1.6]) {
    box([0.88, 0.66, 0.045], [x, 0.47, -3.1], "#dfcedf", 0.02);
    box([0.18, 0.035, 0.045], [x, 0.68, -3.06], "#8c9d8f", 0.01);
  }
  box([0.72, 0.03, 0.47], [-3.55, 0.98, -3.48], "#a5bab9", 0.08);
  const tap = mesh(
    new THREE.TorusGeometry(0.12, 0.025, 8, 20, Math.PI),
    "#8a9d98",
    [-3.55, 1.12, -3.65],
  );
  tap.rotation.y = Math.PI / 2;
  box([0.74, 0.045, 0.5], [-1.65, 0.99, -3.48], "#575d59", 0.03);
  for (const x of [-1.85, -1.45])
    for (const z of [-3.6, -3.35])
      cylinder(0.075, 0.075, 0.015, [x, 1.02, z], "#a3aaa0");
  box([0.75, 1.9, 0.85], [-4.03, 0.97, -1.7], "#e6e7d9", 0.08);
  box([0.035, 0.4, 0.04], [-3.82, 1.25, -1.25], "#9aa496", 0.01);
  box([0.65, 0.025, 0.04], [-4.03, 1.25, -1.26], "#c5cbbd", 0.01);
  cylinder(0.72, 0.72, 0.12, [-2.05, 0.85, -1.6], "#ecd1ab");
  cylinder(0.1, 0.22, 0.8, [-2.05, 0.4, -1.6], "#ccb290");
  for (const x of [-2.95, -1.1]) {
    cylinder(0.28, 0.28, 0.13, [x, 0.5, -1.6], "#d7c3dd");
    cylinder(0.055, 0.08, 0.5, [x, 0.25, -1.6], "#b49c81");
  }
  const coffeeStation = new THREE.Group();
  coffeeStation.name = "coffee-station";
  coffeeStation.position.set(-2.05, 0.92, -1.6);
  root.add(coffeeStation);
  box([0.52, 0.07, 0.43], [0, 0.035, -0.2], "#a58d9f", 0.03, coffeeStation);
  box([0.49, 0.55, 0.27], [0, 0.33, -0.32], "#c1a0b9", 0.09, coffeeStation);
  box([0.38, 0.13, 0.38], [0, 0.57, -0.24], "#e9d9e4", 0.04, coffeeStation);
  box([0.25, 0.28, 0.03], [0, 0.29, -0.17], "#705569", 0.03, coffeeStation);
  cylinder(0.045, 0.045, 0.1, [0, 0.45, -0.08], "#d7ba83", coffeeStation);
  ball([0.032, 0.032, 0.018], [0.14, 0.49, -0.17], "#f3e0b4", coffeeStation);
  const cupPositions = [
    [-0.44, 0, 0.06],
    [-0.17, 0, 0.36],
    [0.17, 0, 0.36],
    [0.44, 0, 0.06],
  ];
  for (let i = 0; i < 4; i++) {
    const cup = new THREE.Group();
    cup.name = `coffee-cup-${i + 1}`;
    cup.position.set(...(cupPositions[i] as [number, number, number]));
    coffeeStation.add(cup);
    cylinder(
      0.115,
      0.09,
      0.19,
      [0, 0.12, 0],
      i % 2 ? "#e9d9cb" : "#e7c7d8",
      cup,
    );
    cylinder(0.095, 0.095, 0.012, [0, 0.217, 0], "#886853", cup);
    cylinder(0.15, 0.15, 0.025, [0, 0.013, 0], "#f5e8ed", cup);
    mesh(
      new THREE.TorusGeometry(0.065, 0.019, 8, 16),
      "#e7c7d8",
      [0.12, 0.13, 0],
      cup,
    );
    cups.push(cup);
  }
  plant(-0.95, -3.5, 0.35, 0.99);

  // Bedroom: upholstered bed, folds, pillows, nightstand and wall art.
  box([2.7, 0.045, 3.3], [2.65, 0.07, -1.7], "#e2d7ca", 0.14);
  box([2.2, 0.4, 2.9], [2.65, 0.33, -1.75], "#bfad98", 0.1);
  box([2.26, 1.25, 0.22], [2.65, 0.76, -3.15], "#d0b8d8", 0.15);
  box([2.12, 0.28, 2.8], [2.65, 0.65, -1.75], "#f9f4e9", 0.15);
  const bedding = box([2.16, 0.16, 1.7], [2.65, 0.83, -1.15], "#d6aabb", 0.12);
  bedding.name = "custom-bedding";
  const beddingMaterial = bedding.material.clone();
  bedding.material = beddingMaterial;
  materials.set("custom-bedding", beddingMaterial);
  box([2.16, 0.12, 0.42], [2.65, 0.9, -0.6], "#c3a7b9", 0.06);
  for (const x of [2.1, 3.15])
    box([0.88, 0.2, 0.56], [x, 0.85, -2.65], "#fcf9f0", 0.16);
  box([0.6, 0.5, 0.65], [1.03, 0.3, -2.8], "#debe9c", 0.06);
  cylinder(0.12, 0.17, 0.15, [1.03, 0.65, -2.8], "#d2a98e");
  const lampShade = ball([0.24, 0.2, 0.24], [1.03, 0.85, -2.8], "#f4e0af");
  const lampMaterial = lampShade.material.clone();
  lampShade.material = lampMaterial;
  materials.set("reading-lamp", lampMaterial);
  const readingLight = new THREE.PointLight("#ffcc83", 0, 5, 2);
  readingLight.name = "reading-light";
  readingLight.position.set(1.03, 1.05, -2.8);
  root.add(readingLight);
  box([0.9, 1.1, 0.07], [0.95, 1.9, -4.01], "#c7aa8a");
  box([0.75, 0.95, 0.04], [0.95, 1.9, -3.96], "#f6eee1");
  ball([0.22, 0.25, 0.02], [0.95, 1.98, -3.92], "#d1b4b0");
  plant(4, -3.25, 0.8);

  // Balcony/reading nook: timber decking, railing and two rounded chairs.
  box([3.25, 0.09, 2.65], [3, 0.05, 2.7], "#d6c5ad", 0.04);
  for (let i = 0; i < 10; i++)
    box([0.016, 0.015, 2.6], [1.5 + i * 0.32, 0.105, 2.7], "#c5af91", 0);
  for (const x of [2, 4]) {
    box([0.8, 0.18, 0.8], [x, 0.5, 2.5], "#e8c4b3", 0.13);
    box([0.8, 0.7, 0.18], [x, 0.8, 2.15], "#eacbbb", 0.12);
    for (const dx of [-0.27, 0.27])
      for (const dz of [-0.27, 0.27])
        cylinder(0.035, 0.04, 0.45, [x + dx, 0.25, 2.5 + dz], "#b7a18a");
  }
  cylinder(0.37, 0.38, 0.1, [3, 0.65, 2.8], "#f8f3e7");
  cylinder(0.055, 0.1, 0.6, [3, 0.3, 2.8], "#b19b83");
  cylinder(0.08, 0.07, 0.15, [3, 0.77, 2.8], "#9eb5a1");
  for (let i = 0; i < 9; i++)
    box([0.045, 0.82, 0.045], [1.5 + i * 0.38, 0.51, 4.05], "#b0beb1", 0.01);
  box([3.2, 0.06, 0.07], [3.03, 0.94, 4.05], "#a6b7a8", 0.02);
  plant(4.1, 3.6, 0.85);
  plant(1.4, 3.6, 0.6);
  // A sleepy clay cat at the threshold.
  const cat = new THREE.Group();
  cat.name = "house-cat";
  root.add(cat);
  ball([0.28, 0.17, 0.2], [0.4, 0.24, 2.7], "#cfb59c", cat);
  ball([0.16, 0.16, 0.15], [0.63, 0.32, 2.7], "#cfb59c", cat);
  mesh(
    new THREE.ConeGeometry(0.075, 0.13, 3),
    "#c4a68c",
    [0.56, 0.49, 2.7],
    cat,
  );
  mesh(
    new THREE.ConeGeometry(0.075, 0.13, 3),
    "#c4a68c",
    [0.7, 0.49, 2.7],
    cat,
  );

  let cupAnimation = false;
  function applyPersonalization(state: Personalization, reducedMotion = false) {
    plants.forEach((item) => {
      item.visible = state.preferences.includes("plants");
    });
    cat.visible = state.preferences.includes("pets");
    cups.forEach((cup, index) => {
      const visible = index < state.people;
      if (visible && !cup.visible) {
        cup.scale.setScalar(reducedMotion ? 1 : 0.01);
        cupAnimation = !reducedMotion;
      }
      cup.visible = visible;
      if (reducedMotion) cup.scale.setScalar(1);
    });
    beddingMaterial.color.set(beddingColors[state.bedding]);
    readingLight.intensity = state.lamp ? 4 : 0;
    lampMaterial.emissive.set(state.lamp ? "#ffbc62" : "#000000");
    lampMaterial.emissiveIntensity = state.lamp ? 0.8 : 0;
  }

  return {
    root,
    applyPersonalization,
    animate(deltaSeconds: number, reducedMotion: boolean) {
      if (!cupAnimation) return false;
      cupAnimation = false;
      cups.forEach((cup) => {
        if (!cup.visible) return;
        const value = reducedMotion
          ? 1
          : THREE.MathUtils.damp(cup.scale.x, 1, 12, deltaSeconds);
        cup.scale.setScalar(value > 0.995 ? 1 : value);
        cupAnimation ||= cup.scale.x < 1;
      });
      return true;
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
