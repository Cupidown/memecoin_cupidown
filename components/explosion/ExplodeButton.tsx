'use client'
import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createBurnInstruction } from '@solana/spl-token';

const EXPLODE_COST = 100; // Nombre de tokens à brûler
const MINT_ADDRESS = new PublicKey("11111111111111111111111111111111"); 

type ExplodeButtonProps = {
  onExplode: () => void; // callback déclenché en cas de succès
};

const ExplodeButton: React.FC<ExplodeButtonProps> = ({ onExplode }) => {
  const { publicKey, sendTransaction, connected, connect } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplode = async () => {
    if (!connected || !publicKey) {
      // Si le wallet n'est pas connecté, tentez de le connecter
      await connect();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Obtenir l'adresse du compte token associé pour le mint CUPIDOWN
      const tokenAccount = await getAssociatedTokenAddress(MINT_ADDRESS, publicKey);

      // Créer l'instruction de burn pour brûler EXPLODE_COST tokens
      const burnIx = createBurnInstruction(
        tokenAccount,        // Compte token à brûler
        MINT_ADDRESS,        // Mint du token CUPIDOWN
        publicKey,           // Propriétaire (doit signer)
        EXPLODE_COST,        // Montant à brûler
        [],
        TOKEN_PROGRAM_ID
      );

      // Créer la transaction et ajouter l'instruction de burn
      const transaction = new Transaction().add(burnIx);

      // Envoyer la transaction via le wallet
      const signature = await sendTransaction(transaction, connection);
      console.log("Signature de transaction:", signature);
      onExplode(); // Déclencher le callback en cas de succès
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transaction échouée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button 
        onClick={handleExplode}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#7f0000', // rouge foncé
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {loading ? "Traitement..." : "Exploser un cœur (100 CUPIDOWN)"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
            <p style={{ marginTop: '10px', fontStyle: 'italic', color: 'white' }}>
        &quot;Ton célibat te coûte cher... prépare-toi à brûler tes tokens!&quot;
        </p>

    </div>
  );
};

export default ExplodeButton;
