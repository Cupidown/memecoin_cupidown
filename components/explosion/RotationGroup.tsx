// RotatingGroup.tsx
'use client'
import { useFrame } from '@react-three/fiber';
import { useRef, ReactNode } from 'react';
import * as THREE from 'three';
import { MathUtils } from 'three';

type RotatingGroupProps = {
  children: ReactNode;
};

export default function RotatingGroup({ children }: RotatingGroupProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Ajustez la vitesse de rotation ici (0.2 degrés par frame)
      groupRef.current.rotation.y += MathUtils.degToRad(0.2);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
