interface UserState {
  me?: User;
  updateMe: (jwt: string) => void;
}
