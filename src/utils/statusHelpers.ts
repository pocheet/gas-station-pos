// src/utils/statusHelpers.ts
import type { PumpStatusType } from '../api/types';
import { PumpStatus } from '../api/types';

export const getStatusInfo = (status: PumpStatusType) => {
  const statusMap: Record<number, {
    text: string;
    color: string;
    bgColor: string;
    icon: string;
    animation?: string;
  }> = {
    [PumpStatus.Error]: { 
      text: 'Ошибка', 
      color: '#ff4757', 
      bgColor: 'rgba(255, 71, 87, 0.1)',
      icon: '⚠️',
      animation: 'shake'
    },
    [PumpStatus.Off]: { 
      text: 'Ожидание', 
      color: '#6c7293', 
      bgColor: 'rgba(108, 114, 147, 0.1)',
      icon: '⏸️'
    },
    [PumpStatus.Preset]: { 
      text: 'Готов к наливу', 
      color: '#ffd700', 
      bgColor: 'rgba(255, 215, 0, 0.1)',
      icon: '⏳',
      animation: 'pulse'
    },
    [PumpStatus.Call]: { 
      text: 'Пистолет снят', 
      color: '#5b9bd5', 
      bgColor: 'rgba(91, 155, 213, 0.1)',
      icon: '🖐️'
    },
    [PumpStatus.CallError]: { 
      text: 'Ошибка: неверный пистолет', 
      color: '#ff4757', 
      bgColor: 'rgba(255, 71, 87, 0.1)',
      icon: '⚠️'
    },
    [PumpStatus.Busy]: { 
      text: 'Идет налив', 
      color: '#00d4aa', 
      bgColor: 'rgba(0, 212, 170, 0.1)',
      icon: '⛽',
      animation: 'fueling'
    },
    [PumpStatus.BusyOverflow]: { 
      text: 'Перелив!', 
      color: '#ff4757', 
      bgColor: 'rgba(255, 71, 87, 0.2)',
      icon: '🚨',
      animation: 'shake'
    },
    [PumpStatus.WaitOffOverflow]: { 
      text: 'Завершение с переливом', 
      color: '#ff6b6b', 
      bgColor: 'rgba(255, 107, 107, 0.1)',
      icon: '⚠️'
    },
    [PumpStatus.WaitOffRemainder]: { 
      text: 'Ожидание продолжения', 
      color: '#ffd700', 
      bgColor: 'rgba(255, 215, 0, 0.1)',
      icon: '⏸️'
    },
    [PumpStatus.WaitOff]: { 
      text: 'Повесьте пистолет', 
      color: '#ffa502', 
      bgColor: 'rgba(255, 165, 2, 0.1)',
      icon: '⬆️'
    },
    [PumpStatus.WaitReset]: { 
      text: 'Ожидание сброса', 
      color: '#5b9bd5', 
      bgColor: 'rgba(91, 155, 213, 0.1)',
      icon: '🔄'
    },
  };

  return statusMap[status] || statusMap[PumpStatus.Error];
};

export const isPumpAvailable = (status: PumpStatusType): boolean => {
  return [PumpStatus.Off, PumpStatus.Preset, PumpStatus.Call].includes(status);
};

export const isPumpBusy = (status: PumpStatusType): boolean => {
  return [PumpStatus.Busy, PumpStatus.BusyOverflow].includes(status);
};
