interface UserState {
  me?: User;
  updateMe: (jwt: string) => void;
  updateDetailMe: (user: User) => void;
}
