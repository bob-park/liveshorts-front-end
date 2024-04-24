import { SlicePattern } from 'zustand';

export const createAlertSlice: SlicePattern<AlertState> = (set) => ({
  alerts: [],
  addAlert: (message) =>
    set(
      (state) => {
        const prevAlerts = state.alerts.slice();

        // 최대 alert 개수가 넘은 경우 처리
        if (prevAlerts.length >= 3) {
          prevAlerts.splice(2, prevAlerts.length - 2);
        }

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
