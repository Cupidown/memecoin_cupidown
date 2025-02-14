'use client'
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMotionValue, useSpring } from "framer-motion";
import { AnimationAction, Group, MathUtils, Mesh } from "three";
import { useRef, useMemo, useEffect, useState } from "react";

type CubeProps = JSX.IntrinsicElements["group"] & {
  innerModel?: string;
  disabled?: boolean;
  partial?: boolean; // Si true, le cœur est à 50% d'ouverture
};

function InnerModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [scene]);
  return <primitive object={clonedScene} />;
}

export default function Cube({ innerModel, disabled, partial, ...props }: CubeProps) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 100, damping: 10 });
  const group = useRef<Group>(null);

  // Charger le modèle de base "/heart.glb"
  const { scene: cubeScene, animations } = useGLTF("/heart.glb");
  const clonedCube = useMemo(() => {
    const clone = cubeScene.clone(true);
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [cubeScene]);

  const { actions } = useAnimations(animations, clonedCube);

  // Lorsque la prop "partial" change, on règle motionVal :
  useEffect(() => {
    if (partial) {
      // Ici, on suppose que 0.5 correspond à 50% d'ouverture
      motionVal.set(0.58);
    } else {
      motionVal.set(0);
    }
  }, [partial, motionVal]);

  useFrame(() => {
    group.current?.rotateY(MathUtils.degToRad(0.2));
    Object.keys(actions).forEach((key) => {
      const action = actions[key] as AnimationAction;
      // On joue l'animation en mode "paused" et on force le temps via le spring
      action.play().paused = true;
      action.time = spring.get();
    });
  });
  
  const [scale, setScale] = useState(window.innerWidth / 1600);

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth / 1600);
    };

    window.addEventListener('resize', updateScale);
    updateScale();

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <group ref={group} {...props}>
      <primitive object={clonedCube} scale={scale} />
      {innerModel && (
        <group position={[0, 0, 0]} scale={0.5 * scale}>
          <InnerModel url={innerModel} />
        </group>
      )}
    </group>
  );
}
