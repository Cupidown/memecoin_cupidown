// Devil.tsx
'use client'
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';
import ComicBubble from './bubble';

type DevilProps = JSX.IntrinsicElements['group'] & {
  bubbleVisible?: boolean;
  steal?: boolean; // Nouvelle prop pour savoir si la pièce a été "volée"
  scaleProp: number;
};

export default function Devil({ bubbleVisible, steal, scaleProp, ...props }: DevilProps): JSX.Element {
  const { scene } = useGLTF('/devil.glb');
  
  // Clone du modèle et désactivation des ombres sur tous les meshes
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

  // Position à ajuster pour que la queue de la bulle parte du centre du visage du démon
  const bubblePosition: [number, number, number] = [-1.8 + 0.2 / scaleProp, -0.78, 0.5];

  // Calcul du texte de la bulle :
  // Si "steal" est vrai, afficher le message spécial.
  // Sinon, choisir aléatoirement parmi une liste de phrases.
  const bubbleText = useMemo(() => {
    if (!bubbleVisible) return "";
    if (steal) return "You're trying to rob me, you little bastard";
    const phrases = [
      "Your love life is like a Windows update—keeps getting delayed and crashes when it finally happens.",
      "The only heart you're getting this year is a 'like' from your mom on Facebook.",
      "Your dating life is like a silent disco—just you, alone, pretending something’s happening.",
      "At least your bank account is full… since you have no one to spend money on.",
      "Your biggest Valentine's surprise? A 'Hey, big head' text from your ex… at 2 AM.",
      "Even your shadow left you on read.",
      "If love is in the air, you must be living in a vacuum.",
      "You should start charging rent for how long you’ve been living in the friend zone.",
      "Cupid skipped your house like it was an unskippable ad.",
      "You’re not alone, even your notifications are dry.",
      "You and Wi-Fi got one thing in common—always searching for a better connection.",
      "Your love life is like a desert… dry, lifeless, and full of mirages.",
      "You should be a traffic light—because every potential date stops and turns away.",
      "Your love life is like a season of your favorite show—canceled before it even started.",
      "You’ve been single for so long, even your dream partner moved on.",
      "Your crush is like a delivery package—always 'out for delivery' but never arrives.",
      "Your longest relationship is still with your Wi-Fi router.",
      "You’re the human version of a '404 Error'—love not found.",
      "The only thing breaking records this Valentine's is your streak of being single.",
      "Your love life is like a Bluetooth connection—works best when no one's around."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [bubbleVisible, steal]);

  return (
    <group {...props}>
      <primitive object={clonedScene} />
      {bubbleVisible && bubbleText && (
        <ComicBubble 
          text={bubbleText} 
          position={bubblePosition}
          // Vous pouvez ajuster ici typingSpeed et delayBeforeTyping via des props si nécessaire
        />
      )}
    </group>
  );
}
