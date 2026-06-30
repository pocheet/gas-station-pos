// src/components/TopNavbar.tsx
import { useState, useEffect } from 'react';
import { AppBar, Toolbar } from '@mui/material';

export default function TopNavbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  const days = [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота'
  ];

  const time = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const day = days[currentTime.getDay()];
  const date = currentTime.getDate();
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: '#1a1a2e',
        borderBottom: '1px solid var(--color-gray-700)',
      }}
    >
      <Toolbar 
        variant="dense" 
        sx={{ 
          justifyContent: 'center',
          minHeight: '48px !important',
        }}
      >
        <div className="flex items-center gap-3 text-[#d1d5db] font-medium text-sm tracking-wide">
          <span className="text-lg font-mono text-[#e8e8f0]">
            {time}
          </span>
          <span>
            {day}
          </span>
          <span>
            {date} {month} {year}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
}
