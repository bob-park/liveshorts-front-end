type UserState = {
  me?: User;
};

type User = {
  id: number;
  userId: string;
  name: string;
  email?: string;
};
