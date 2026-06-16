// src/components/TopNavbar.tsx
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { type PumpValue } from '../types/schemas';

interface TopNavbarProps {
  pumps: PumpValue[];
}

export default function TopNavbar({ pumps }: TopNavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const lockedPumps = pumps.filter(p => p.LockTag);

  return (
    <AppBar position="static" color="default" sx={{ bgcolor: '#1a1a2e' }}>
      <Toolbar variant="dense">
        <Button color="inherit" sx={{ mr: 2 }}>Продажа</Button>
        
        <Button 
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Разблокировать
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {lockedPumps.length === 0 ? (
            <MenuItem disabled>Нет заблокированных ТРК</MenuItem>
          ) : (
            lockedPumps.map(pump => (
              <MenuItem key={pump.Number} onClick={() => setAnchorEl(null)}>
                ТРК {pump.Number}
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}