type UserState = {
  me?: User;
  isLoggingIn: boolean;
  failLoggedInMessage?: string;
};

type User = {
  id: number;
  userId: string;
  name: string;
  email?: string;
};
