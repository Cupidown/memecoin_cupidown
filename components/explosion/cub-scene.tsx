'use client';

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";

// Composants de la scène
import Cube from "./cube";
import Devil from "./devil";
import RoastMessage from "./roast";
import Cupidown from "./cupidown";
import PillButton from "./PillButton";

// Liste des phrases trash
const trashTalks = [
  "NO MATCHES? LOWER YOUR STANDARDS",
  "SINGLE FOREVER? EVEN YOUR MOM PITY YOU",
  "EVEN AI WON'T DATE YOU LOL",
  "Try Again, Looser"
];

interface SceneProps {
  hasBurned: boolean;
}

export default function Scene({ hasBurned }: SceneProps) {
  // Calcul d'un index aléatoire pour définir un cube "spécial"
  const innerModelIndex = useMemo(() => {
    // 1 chance sur 1000 d'obtenir l'étoile
    if (Math.random() < 0.001) {
      return Math.floor(Math.random() * 3);
    }
    // Sinon, aucun cube n'a d'étoile (indice invalide)
    return -1;
  }, []);
  
  // États pour gérer l'animation des cubes via pointer events
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [partialIndex, setPartialIndex] = useState<number | null>(null);
  const [stolen, setStolen] = useState(false);
  
  // Gestion de l'audio (volume, boucle, etc.)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/scary-witch-horror-background-laugh-vocal-250001.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    audioRef.current.addEventListener('canplaythrough', () => {
      console.log("Audio chargé correctement");
    });
    audioRef.current.addEventListener('error', (e) => {
      console.error("Erreur lors du chargement de l'audio", e);
      setAudioError("Erreur lors du chargement de l'audio. Vérifie que le fichier existe et est dans un format supporté.");
    });
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioStarted) {
        audioRef.current.pause();
        setAudioStarted(false);
      } else {
        audioRef.current
          .play()
          .then(() => setAudioStarted(true))
          .catch((err) => {
            console.error("Erreur lors du lancement de la musique:", err);
            setAudioError("Erreur lors du lancement de la musique.");
          });
      }
    }
  };

  // Gestion des interactions sur les cubes pour déclencher leur animation
  const handlePointerDown = (index: number) => {
    console.log("Pointer down on index", index);
    // Si aucun cube n'est sélectionné ou que c'est le même, on active
    if (selectedIndex === null || selectedIndex === index) {
      setSelectedIndex(index);
      setPartialIndex(index);
      // Si l'index correspond à celui défini comme spécial, on marque "stolen"
      if (index === innerModelIndex) {
        setStolen(true);
      }
    }
  };

  const handlePointerUp = (index: number) => {
    console.log("Pointer up on index", index);
    if (partialIndex === index) {
      setPartialIndex(null);
    }
  };

  const [scale, setScale] = useState(window.innerWidth / 1600);

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth / 1600);
    };

    window.addEventListener('resize', updateScale);
    updateScale();

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const [position, setPosition] = useState<number[]>([]);

  useEffect(() => {
    setPosition([-4.5 * scale, 0, 4.5 * scale]);
  }, [scale]);

  return (
    <>
      <Canvas gl={{ antialias: true }} dpr={[1, 1.5]}>
        <directionalLight position={[-1, -1, 1]} intensity={4} castShadow={false} />
        <ambientLight intensity={0.3} />
        <Suspense fallback={null}>
          <group>
            {position.map((posX, index) => (
              <group key={index}>
                <Cube
                  position={[posX, -2 - 0.2 / scale, 0]}
                  disabled={selectedIndex !== null && selectedIndex !== index}
                  innerModel={innerModelIndex === index ? "/star.glb" : undefined}
                  partial={partialIndex === index}
                />
                <Html position={[posX, -3.5, 0]} center pointerEvents="auto">
                  <div className="flex justify-center w-56">
                    <PillButton
                      // Le bouton est désactivé tant qu'il n'y a pas eu de burn
                      disabled={!hasBurned}
                      onPointerDown={() => handlePointerDown(index)}
                      onPointerUp={() => handlePointerUp(index)}
                    >
                      <span className="block 2xl:hidden text-xs font-bold text-center w-full whitespace-nowrap">
                        {index + 1}
                      </span>
                      <span className="hidden 2xl:block text-xs font-bold text-center w-full whitespace-nowrap">
                        {trashTalks[index]}
                      </span>
                    </PillButton>
                  </div>
                </Html>
              </group>
            ))}
            <Html position={[position[0], 2.85, 0]} center pointerEvents="auto">
              <div className="flex justify-center">
                <PillButton 
                  variant="joystick" 
                  disabled={!hasBurned}
                  onClick={() => window.location.reload()}
                >
                  <span className="text-[0.4rem] md:text-[0.5rem] 2xl:text-xs font-bold text-center block text-wrap sm:whitespace-nowrap z-10">
                    {trashTalks[3]}
                  </span>
                </PillButton>
              </div>
            </Html>
            <Devil position={[0, 2 - 0.2 / scale, 0]} bubbleVisible={selectedIndex !== null} steal={stolen} scaleProp={scale} />
            <RoastMessage position={[0, -0.35 - 0.3 / scale, 0]} />
            {/* Ici, on affiche éventuellement un composant d'animation (ex. des cœurs) si besoin */}
           <Cupidown position={[0, 3.2 - 0.2 / scale, 0]} />
          </group>
        </Suspense>
      </Canvas>
      <button
        onClick={toggleAudio}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <img src="/Speaker_Icon.svg" alt="Speaker Icon" width={20} height={20} />
      </button>
    </>
  );
}
