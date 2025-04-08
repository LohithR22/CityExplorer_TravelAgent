import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Earth() {
  const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
    "/assets/earth-texture.jpg",
    "/assets/earth-topology.jpg",
    "/assets/earth-specular.png",
  ]);

  const earthRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime / 6;
  });

  return (
    <mesh ref={earthRef} scale={[2.5, 2.5, 2.5]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={normalMap}
        bumpScale={0.05}
        specularMap={specularMap}
        specular={0.05}
      />
    </mesh>
  );
}
