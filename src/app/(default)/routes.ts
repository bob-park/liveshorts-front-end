type Route = {
  id: string;
  name: string;
  route: string;
};

const routes: Route[] = [
  {
    id: 'recordSchedule',
    name: '채널 편성표',
    route: '/broadcast/schedule',
  },
];

export default routes;
