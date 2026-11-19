import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { buildApartment } from "./apartment";
import { cameraAt } from "./journey";

export default function ApartmentWorld({
  progress,
  reducedMotion,
}: {
  progress: RefObject<number>;
  reducedMotion: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const motion = useRef(reducedMotion);
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
    scene.add(new THREE.HemisphereLight("#fff7eb", "#d7e1d5", 1.9));
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
      const desired = motion.current ? 0 : progress.current;
      current += (desired - current) * 0.09;
      if (Math.abs(desired - current) < 0.00005) current = desired;
      if (!dirty && Math.abs(current - lastProgress) < 0.000001) return;
      const pose = cameraAt(current);
      camera.position.set(...pose.position);
      // A tall viewport gets a wider field of view, never a cropped desktop film.
      camera.fov = width / height < 0.9 ? 47 : 37;
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
      aria-label="Departamento 3D de plastilina con sala verde menta, cocina, habitación lavanda y balcón. La cámara recorre los espacios al desplazarte."
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
