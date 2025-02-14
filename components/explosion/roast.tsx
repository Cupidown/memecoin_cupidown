'use client'
import React from 'react';
import { Html } from '@react-three/drei';

type RoastMessageProps = JSX.IntrinsicElements['group'] & {};

const RoastMessage: React.FC<RoastMessageProps> = (props) => {
  return (
    <group {...props}>
      <Html center>
        <div className="text-red-600 font-bold md:text-2xl animate-pulse whitespace-nowrap">
          {"\"LOVE IS A SCAM, LET ME ROAST YOU\""}
        </div>
      </Html>
    </group>
  );
};

export default RoastMessage;
