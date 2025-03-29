export interface User {
  id: string;
  userName: string;
  email: string;
}

export interface UserUpdateRequest {
    userName: string;
    email: string;
}
