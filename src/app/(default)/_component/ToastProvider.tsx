'use client';

import { useEffect } from 'react';

import { useStore } from '@/shared/rootStore';

import Alert from '@/components/alert/Alert';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type ToastProviderProps = {};

export default function ToastProvider({}: ToastProviderProps) {
  const alerts = useStore((state) => state.alerts);
  const removeAlerts = useStore((state) => state.removeAlerts);

  // useEffect
  useEffect(() => {
    const id = setInterval(() => {
      // 생성된지 5초가 지나면 삭제
      const removeAlertIds = alerts
        .filter((item) => dayjs(item.createdDate).unix() < dayjs().unix() - 5)
        .map((item) => item.id);

      removeAlertIds && removeAlertIds.length && removeAlerts(removeAlertIds);
    }, 1_000);

    return () => {
      clearInterval(id);
    };
  }, [alerts]);

  // handle
  const handleRemove = (id: string) => {
    removeAlerts([id]);
  };

  return (
    <div className="fixed top-20 right-0 flex flex-col gap-2 z-50 mt-2 mr-5 items-end">
      {alerts.map((alert) => (
        <Alert
          key={`alert-${alert.id}`}
          message={alert.message}
          onRemove={() => handleRemove(alert.id)}
        />
      ))}
    </div>
  );
}
