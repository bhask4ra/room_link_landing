import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { buildApartment } from "./apartment";
import { cameraAt } from "./journey";
import type { Personalization } from "./personalization";

export default function ApartmentWorld({
  progress,
  reducedMotion,
  personalization,
}: {
  progress: RefObject<number>;
  reducedMotion: boolean;
  personalization: Personalization;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const motion = useRef(reducedMotion);
  const settings = useRef(personalization);
  useEffect(() => {
    settings.current = personalization;
  }, [personalization]);
  useEffect(() => {
    motion.current = reducedMotion;
  }, [reducedMotion]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setUnavailable(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
    const ambient = new THREE.HemisphereLight("#fff7f1", "#e0ccdf", 1.9);
    scene.add(ambient);
    const light = new THREE.DirectionalLight("#fff5df", 3.2);
    light.position.set(-3, 12, 8);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    Object.assign(light.shadow.camera, {
      left: -9,
      right: 9,
      top: 9,
      bottom: -9,
      near: 0.5,
      far: 40,
    });
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.035;
    light.shadow.radius = 4;
    scene.add(light);
    const fill = new THREE.DirectionalLight("#e5e8ff", 1.2);
    fill.position.set(5, 4, -6);
    scene.add(fill);
    const apartment = buildApartment();
    apartment.applyPersonalization(settings.current, true);
    scene.add(apartment.root);
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.12 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.46;
    ground.receiveShadow = true;
    scene.add(ground);
    let width = 1;
    let height = 1;
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
      height = element.clientHeight;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      dirty = true;
    });
    let dirty = true;
    let lastProgress = -1;
    let current = progress.current;
    let previousSettings = settings.current;
    let lastTime = performance.now();
    let sunsetMix = 0;
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    visibility.observe(element);
    resize.observe(element);
    const target = new THREE.Vector3();
    renderer.setAnimationLoop(() => {
      if (!visible || document.hidden) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (previousSettings !== settings.current) {
        apartment.applyPersonalization(settings.current, motion.current);
        previousSettings = settings.current;
        dirty = true;
      }
      if (apartment.animate(delta, motion.current)) dirty = true;
      const sunsetTarget = settings.current.sunset ? 1 : 0;
      if (Math.abs(sunsetTarget - sunsetMix) > 0.001) {
        sunsetMix = motion.current
          ? sunsetTarget
          : THREE.MathUtils.damp(sunsetMix, sunsetTarget, 4, delta);
        light.color.setRGB(1, 0.96 - sunsetMix * 0.3, 0.88 - sunsetMix * 0.43);
        light.intensity = 3.2 - sunsetMix * 0.5;
        ambient.intensity = 1.9 - sunsetMix * 0.7;
        dirty = true;
      }
      const desired = motion.current ? 0 : progress.current;
      current = motion.current
        ? desired
        : THREE.MathUtils.damp(current, desired, 9, delta);
      if (Math.abs(desired - current) < 0.00005) current = desired;
      if (!dirty && Math.abs(current - lastProgress) < 0.000001) return;
      const pose = cameraAt(current);
      camera.position.set(...pose.position);
      // Full-bleed scene; place the focal point beside/under its translucent copy.
      const portrait = width / height < 0.9;
      camera.fov = portrait ? 52 : 37;
      camera.setViewOffset(
        width,
        height,
        portrait ? 0 : -width * 0.16,
        portrait ? -height * 0.24 : 0,
        width,
        height,
      );
      camera.updateProjectionMatrix();
      target.set(...pose.target);
      camera.lookAt(target);
      renderer.render(scene, camera);
      lastProgress = current;
      dirty = false;
    });
    const contextLost = (event: Event) => {
      event.preventDefault();
      setUnavailable(true);
      renderer.setAnimationLoop(null);
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      renderer.setAnimationLoop(null);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      apartment.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);
  return (
    <div
      className="world-canvas"
      ref={host}
      role="img"
      aria-label={`Departamento 3D rosa malva personalizado: ${personalization.people} tazas en la cocina, ropa de cama ${personalization.bedding === "rose" ? "rosa" : personalization.bedding === "mauve" ? "malva" : "crema"}, lámpara ${personalization.lamp ? "encendida" : "apagada"}, luz de ${personalization.sunset ? "atardecer" : "mañana"}.`}
    >
      {unavailable && (
        <div className="world-fallback">
          <img src="/favicon.svg" alt="" />
          <h3>Un lugar para imaginar juntos.</h3>
          <p>
            La vista 3D no está disponible en este navegador. Puedes seguir
            explorando toda la historia y los ejemplos.
          </p>
        </div>
      )}
    </div>
  );
}
