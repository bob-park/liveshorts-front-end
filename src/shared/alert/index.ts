import { SlicePattern } from 'zustand';

export const createAlertSlice: SlicePattern<AlertState> = (set) => ({
  alerts: [],
  addAlert: (message) =>
    set(
      (state) => {
        const prevAlerts = state.alerts.slice();

        const createdToast: Toast = {
          id: crypto.randomUUID(),
          message: message,
          createdDate: new Date(),
        };

        prevAlerts.unshift(createdToast);

        return {
          alerts: prevAlerts,
        };
      },
      false,
      {
        type: 'alert/addAlert',
      },
    ),
  removeAlerts: (ids) =>
    set(
      (state) => {
        const prevAlerts = state.alerts
          .slice()
          .filter((item) => !ids.includes(item.id));

        return {
          alerts: prevAlerts,
        };
      },
      false,
      {
        type: 'alert/removeAlerts',
      },
    ),
});
