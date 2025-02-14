'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Wallet } from './Wallet';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createBurnInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

interface WalletButtonProps {
  onVisibilityChange?: (isVisible: boolean) => void;
  onBurnSuccess?: () => void;
}

export default function WalletButtonPage({ onVisibilityChange, onBurnSuccess }: WalletButtonProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  // Log de la connexion du wallet
  useEffect(() => {
    console.log("Wallet connecté :", publicKey);
  }, [publicKey]);

  // Observer la visibilité du modal
  useEffect(() => {
    const handleModalVisibility = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const modalExists = document.querySelector('.wallet-adapter-modal-wrapper');
          onVisibilityChange?.(!!modalExists);
        }
      }
    };

    const observer = new MutationObserver(handleModalVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [onVisibilityChange]);

  const burnToken = async () => {
    console.log("Bouton Burn Token cliqué, wallet :", publicKey);
    if (!publicKey || !signTransaction) {
      console.error("Wallet non connecté !");
      return;
    }
  
    try {
      // Adresse du mint du token à brûler
      const tokenMint = new PublicKey("6ibNntNu7oysd6PPZ673neX1gCGYm2gsL8TGgKNbES2g");
      
      // Récupère l'Associated Token Account du wallet pour ce token
      const associatedTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );
  
      // Définir le montant à brûler
      // Ici, on brûle 10 000 tokens (en considérant 6 décimales)
      const tokenDecimals = 9;
      const amountToBurn = 100 * Math.pow(10, tokenDecimals);
  
      // Création de l'instruction de burn
      const burnIx = createBurnInstruction(
        associatedTokenAccount, // compte possédant les tokens
        tokenMint,              // mint du token
        publicKey,              // propriétaire du compte (autorité de burn)
        amountToBurn            // montant à brûler (en unité minimale)
      );
  
      // Création de la transaction et ajout de l'instruction de burn
      const transaction = new Transaction().add(burnIx);
  
      // Récupère un blockhash récent et définit le fee payer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
  
      // Demande au wallet de signer la transaction
      const signedTransaction = await signTransaction(transaction);
  
      // Envoi de la transaction sur le réseau
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature, 'confirmed');
  
      console.log("Burn de token réussi ! Signature :", signature);
      // Déclenche le callback de succès qui mettra à jour le statut dans la page
      onBurnSuccess && onBurnSuccess();
    } catch (error) {
      console.error("Échec du burn de token :", error);
    }
  };
  
  return (
    <Wallet>
      <div className="flex flex-col justify-center items-center space-y-4">
        <WalletMultiButtonDynamic />
        {/* Bouton pour déclencher le burn du token */}
        <button
          onClick={burnToken}
          className="px-4 md:px-10 py-2 text-xs md:text-base bg-red-600 text-white rounded hover:bg-red-700"
          disabled={!publicKey} // désactive si le wallet n'est pas connecté
        >
          Burn your token in HELL
        </button>
      </div>
    </Wallet>
  );
}
