'use client'
import React from 'react';
import { Html } from '@react-three/drei';

type TryAgainProps = JSX.IntrinsicElements['group'] & {};

const TryAgain: React.FC<TryAgainProps> = (props) => {
  return (
    <group {...props}>
      <Html center>
        <div className="text-red-600 font-bold text-2xl animate-pulse whitespace-nowrap">
          {"\"TRY AGAIN LOOSER\""}
        </div>
      </Html>
    </group>
  );
};

export default TryAgain;
