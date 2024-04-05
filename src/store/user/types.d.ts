type UserState = {
  me?: User;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  failLoggedInMessage?: string;
};

type User = {
  id: number;
  userId: string;
  name: string;
  email?: string;
  role: string;
  authorities: string[];
  department?: string;
};
