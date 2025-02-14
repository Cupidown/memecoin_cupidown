'use client'
import React from 'react';
import { Html } from '@react-three/drei';

const Cupidown: React.FC<JSX.IntrinsicElements['group']> = (props) => {
  // Définition des keyframes pour l'effet "drip" sanglant sur le texte
  const dripKeyframes = `
    @keyframes drip {
      0% { text-shadow: 2px 2px 3px #ff0000, 4px 4px 6px #ff0000; }
      50% { text-shadow: 2px 4px 4px #ff0000, 4px 8px 8px #ff0000; }
      100% { text-shadow: 2px 2px 3px #ff0000, 4px 4px 6px #ff0000; }
    }
  `;

  return (
    <group {...props}>
      <Html center>
        <div>
          {/* Injection des keyframes dans le document */}
          <style>{dripKeyframes}</style>
          <div
            className="whitespace-nowrap text-4xl lg:text-6xl xl:text-8xl"
            style={{
              fontFamily: '"Creepster", cursive', // Assurez-vous que la police est chargée
              color: '#7f0000',                   // Rouge foncé
              animation: 'drip 2s infinite',
              textShadow: '2px 2px 3px #ff0000, 4px 4px 6px #ff0000',
            }}
          >
            CUPIDOWN
          </div>
        </div>
      </Html>
    </group>
  );
};

export default Cupidown;
