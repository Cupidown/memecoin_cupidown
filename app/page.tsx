'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import WalletButton from '../components/wallet-button';
import { Wallet } from '../components/Wallet';

// Import dynamique de Scene avec SSR désactivé
const Scene = dynamic(() => import('@/components/explosion/cub-scene'), { ssr: false });

export default function Home() {
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  // État partagé pour savoir si un burn a été effectué
  const [hasBurned, setHasBurned] = useState(false);

  return (
    <Wallet>
      <div className="relative h-screen w-screen">
        {/* On affiche la scène seulement si l'interface du wallet n'est pas visible */}
        {!isWalletVisible && <Scene hasBurned={hasBurned} />}
        
        {/* WalletButton avec gestion d'état pour afficher/masquer */}
        <div className="absolute top-2 right-4 z-50">
          <WalletButton 
            onVisibilityChange={setIsWalletVisible} 
            onBurnSuccess={() => setHasBurned(true)}  // Mise à jour lorsque le burn réussit
          />
        </div>
      </div>
    </Wallet>
  );
}
