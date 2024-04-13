interface LoginResponse {
  accessToken: string;
}

interface User {
  id: number;
  userId: string;
  name: string;
  email?: string;
  role: string;
  authorities: string[];
  department?: string;
}
