import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.8);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const field = new THREE.Group();
    const nodeCount = 52;
    const positions = new Float32Array(nodeCount * 3);
    const nodeGeometry = new THREE.BufferGeometry();
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x6ee7c8,
      size: 0.085,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(nodeGeometry, nodeMaterial);
    const linePositions: number[] = [];
    const nodeVectors: THREE.Vector3[] = [];

    for (let index = 0; index < nodeCount; index += 1) {
      const phi = Math.acos(-1 + (2 * index) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 1.35 + ((index * 17) % 9) / 24;
      const vector = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
      );
      nodeVectors.push(vector);
      positions[index * 3] = vector.x;
      positions[index * 3 + 1] = vector.y;
      positions[index * 3 + 2] = vector.z;
    }

    for (let index = 0; index < nodeVectors.length - 1; index += 1) {
      const current = nodeVectors[index];
      const next = nodeVectors[index + 1];
      if ((index + 1) % 4 === 0 || Math.abs(current.y - next.y) < 0.32) {
        linePositions.push(current.x, current.y, current.z, next.x, next.y, next.z);
      }
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    points.rotation.set(0.18, -0.3, 0.08);
    field.add(points);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.19,
      blending: THREE.AdditiveBlending,
    });
    field.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.68, 2),
      new THREE.MeshBasicMaterial({
        color: 0x0d8273,
        wireframe: true,
        transparent: true,
        opacity: 0.82,
      }),
    );
    field.add(core);

    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x47e6c1,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      }),
    );
    field.add(coreGlow);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.07, 0.012, 8, 96),
      new THREE.MeshBasicMaterial({
        color: 0xf4c76b,
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring.rotation.x = Math.PI / 2.55;
    ring.rotation.z = -0.22;
    field.add(ring);

    scene.add(field);
    scene.add(new THREE.AmbientLight(0x9af8e5, 1.5));

    const resize = () => {
      const width = canvas.clientWidth || 520;
      const height = canvas.clientHeight || 440;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer?.setSize(width, height, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const clock = new THREE.Clock();
    let animationFrame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      field.rotation.y = elapsed * 0.12;
      field.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
      points.rotation.y = -elapsed * 0.08;
      core.rotation.y = elapsed * 0.28;
      core.rotation.z = elapsed * 0.16;
      ring.rotation.z = -0.22 + elapsed * 0.12;
      coreGlow.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.06);
      renderer?.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      field.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-field__canvas" aria-hidden="true" />;
}
