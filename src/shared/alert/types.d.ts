type AlertState = {
  alerts: Toast[];
  addAlert: (message: string) => void;
  removeAlerts: (ids: string[]) => void;
};

type Toast = {
  id: string;
  message: string;
  createdDate: Date;
};
