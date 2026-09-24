import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeSignalField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.8);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Primary Signal Field Group
    const field = new THREE.Group();
    rootGroup.add(field);

    // Dynamic Nodes & Connections
    const nodeCount = 56;
    const positions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const nodeVectors: THREE.Vector3[] = [];

    const baseColor = new THREE.Color(0x72e4c5);
    const accentColor = new THREE.Color(0xf4c76b);
    const alertColor = new THREE.Color(0xff887b);

    for (let index = 0; index < nodeCount; index += 1) {
      const phi = Math.acos(-1 + (2 * index) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 1.38 + ((index * 19) % 7) / 28;
      const vector = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
      );
      nodeVectors.push(vector);
      positions[index * 3] = vector.x;
      positions[index * 3 + 1] = vector.y;
      positions[index * 3 + 2] = vector.z;

      // Varied node colors for telemetry representation
      const chosenColor = index % 9 === 0 ? alertColor : index % 4 === 0 ? accentColor : baseColor;
      nodeColors[index * 3] = chosenColor.r;
      nodeColors[index * 3 + 1] = chosenColor.g;
      nodeColors[index * 3 + 2] = chosenColor.b;
    }

    for (let index = 0; index < nodeVectors.length - 1; index += 1) {
      const current = nodeVectors[index];
      const next = nodeVectors[index + 1];
      if ((index + 1) % 3 === 0 || Math.abs(current.y - next.y) < 0.36) {
        linePositions.push(current.x, current.y, current.z, next.x, next.y, next.z);
      }
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.09,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(nodeGeometry, nodeMaterial);
    points.rotation.set(0.18, -0.3, 0.08);
    field.add(points);

    // Network lines
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
    });
    field.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    // Core Wireframe Polyhedron
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 2),
      new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      }),
    );
    field.add(core);

    // Inner Glowing Core
    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 28, 28),
      new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
      }),
    );
    field.add(coreGlow);

    // Primary Orbital Ring (Golden Amber)
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring1.rotation.x = Math.PI / 2.5;
    ring1.rotation.z = -0.22;
    field.add(ring1);

    // Secondary Inclined Ring (Cyan / Teal)
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.28, 0.009, 8, 120),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = 0.45;
    field.add(ring2);

    // Ambient floating beacon particles
    const beaconCount = 24;
    const beaconPositions = new Float32Array(beaconCount * 3);
    for (let i = 0; i < beaconCount; i++) {
      const angle = (i / beaconCount) * Math.PI * 2;
      const bRad = 1.6 + ((i % 5) * 0.12);
      beaconPositions[i * 3] = Math.cos(angle) * bRad;
      beaconPositions[i * 3 + 1] = ((i % 7) - 3) * 0.25;
      beaconPositions[i * 3 + 2] = Math.sin(angle) * bRad;
    }
    const beaconGeo = new THREE.BufferGeometry();
    beaconGeo.setAttribute('position', new THREE.BufferAttribute(beaconPositions, 3));
    const beaconMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.065,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const beaconPoints = new THREE.Points(beaconGeo, beaconMat);
    field.add(beaconPoints);

    scene.add(new THREE.AmbientLight(0xa7f3d0, 1.8));

    // Mouse Tracking Parallax Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
      targetRotY = mouseX * 0.6;
      targetRotX = -mouseY * 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);

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

    const startTime = performance.now();
    let animationFrame = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth mouse lerp
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

      // Constant orbital rotations
      field.rotation.y = elapsed * 0.14;
      field.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
      points.rotation.y = -elapsed * 0.09;
      core.rotation.y = elapsed * 0.32;
      core.rotation.z = elapsed * 0.18;
      ring1.rotation.z = -0.22 + elapsed * 0.14;
      ring2.rotation.z = 0.35 - elapsed * 0.1;
      beaconPoints.rotation.y = elapsed * 0.05;

      // Heartbeat pulse on core
      const pulse = 1 + Math.sin(elapsed * 2.4) * 0.07;
      coreGlow.scale.setScalar(pulse);

      renderer?.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      container.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      field.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="signal-field__canvas-wrapper relative w-full h-full cursor-grab active:cursor-grabbing" aria-label="3D Live Portfolio Signal Field">
      <canvas ref={canvasRef} className="signal-field__canvas w-full h-full block" aria-hidden="true" />
    </div>
  );
}
