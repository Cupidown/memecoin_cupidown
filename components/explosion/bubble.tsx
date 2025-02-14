'use client'
import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

type ComicBubbleProps = JSX.IntrinsicElements['group'] & {
  text: string;
  typingSpeed?: number;      // délai (en ms) entre chaque lettre (par défaut 50ms)
  delayBeforeTyping?: number; // délai (en ms) avant le début de l'effet (par défaut 500ms)
};

const ComicBubble = ({
  text,
  typingSpeed = 50,
  delayBeforeTyping = 500,
  ...props
}: ComicBubbleProps): JSX.Element => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    // On attend delayBeforeTyping avant de commencer à taper
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));
        if (index === text.length) {
          clearInterval(interval);
        }
      }, typingSpeed);
      // Nettoyage : on retourne une fonction de cleanup pour l'intervalle
      return () => clearInterval(interval);
    }, delayBeforeTyping);

    return () => clearTimeout(timeout);
  }, [text, typingSpeed, delayBeforeTyping]);

  return (
    // Le group permet de positionner la bulle dans l'espace 3D
    <group {...props}>
      <Html center>
        <div className="relative flex flex-col items-center justify-center w-40 sm:w-60 md:w-96 min-h-32 h-fit p-4 bg-white border-4 border-black rounded-lg shadow-lg">
          <p className="text-black text-lg font-bold">{displayedText}</p>
          {/* La "queue" de la bulle (flèche). Ajustez les valeurs pour obtenir l'effet désiré */}
          <div className="absolute bottom-[48px] left-[150px] sm:left-[230px] md:left-[372px] w-0 h-0 border-l-[20px] border-l-transparent border-t-[30px] border-t-black border-r-[20px] border-r-transparent transform rotate-[-90deg]"></div>
        </div>
      </Html>
    </group>
  );
};

export default ComicBubble;



