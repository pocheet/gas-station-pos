// src/components/Footer.tsx
import { AppBar, Toolbar, Button } from '@mui/material';
import { useState } from 'react';
import PriceSettingsModal from './PriceSettingsModal';
import { type Product } from '../types/schemas';

interface FooterProps {
  products?: Product[];
}

export default function Footer({ products = [] }: FooterProps) {
  const [showPrices, setShowPrices] = useState(false);

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: '#1a1a2e',
          borderTop: '1px solid var(--color-gray-700)',
          top: 'auto',
          bottom: 0,
        }}
      >
        <Toolbar 
          variant="dense" 
          sx={{ 
            justifyContent: 'flex-end',
            minHeight: '48px !important',
          }}
        >
          <Button
            onClick={() => setShowPrices(true)}
            sx={{
              color: '#9ca3af',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'none',
              gap: 1,
              '&:hover': {
                color: '#e8e8f0',
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Настройка цены
          </Button>
        </Toolbar>
      </AppBar>

      <PriceSettingsModal
        open={showPrices}
        onClose={() => setShowPrices(false)}
        products={products}
      />
    </>
  );
}
