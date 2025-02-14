'use client';
import React from 'react';

// On étend les props d'un <button> et on ajoute la prop "variant"
type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'pill' | 'joystick';
};

const PillButton: React.FC<PillButtonProps> = ({ children, variant = 'pill', disabled, ...rest }) => {
  // Classes supplémentaires pour l'état désactivé
  const disabledClasses = disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "";

  if (variant === 'joystick') {
    return (
      <button
        {...rest}
        disabled={disabled}
        className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 2xl:w-60 2xl:h-60 text-5xl font-bold uppercase tracking-wider text-white bg-red-800 
                   border-8 border-red-900 rounded-full shadow-xl transition-transform duration-200 
                   hover:scale-110 hover:shadow-red-600 flex justify-center items-center ${disabledClasses}`}
        style={{
          position: "relative",
          overflow: "hidden",
          boxShadow: "0px 30px 90px rgba(139, 0, 0, 0.9)",
        }}
      >
        {children}
        {/* Élément décoratif rappelant la base du joystick, agrandi */}
        <span
          className="absolute left-1/2 bg-red-900 opacity-80 transform -translate-x-1/2 blur-lg animate-pulse"
          style={{
            bottom: "-18px", // -6px x 3
            width: "7.5rem", // 2.5rem x 3 (équivaut à environ 120px si 1rem = 16px)
            height: "7.5rem",
            borderRadius: "50%",
          }}
        ></span>
      </button>
    );
  }

  // Style par défaut en "pill"
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`relative 2xl:min-w-fit px-4 py-4 2xl:py-6 text-3xl font-bold uppercase tracking-wider text-white bg-red-800 
                 border-4 border-red-900 rounded-full shadow-xl transition-transform duration-200 
                 hover:scale-110 hover:shadow-red-600 flex justify-center items-center ${disabledClasses}`}
      style={{
        overflow: "hidden",
        boxShadow: "0px 10px 30px rgba(139, 0, 0, 0.9)",
      }}
    >
      <span className="text-center w-full block whitespace-nowrap">
        {children}
      </span>
      <span
        className="absolute bottom-[-8px] left-1/2 w-60 h-10 bg-red-900 opacity-80 transform -translate-x-1/2 
                   blur-lg animate-pulse"
        style={{
          borderRadius: "50%",
        }}
      ></span>
    </button>
  );
};

export default PillButton;
