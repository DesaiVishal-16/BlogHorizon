export type User = {
  _id: string,
  username: string,
  email: string,
  img: string,
  updatedAt: string;
  createdAt: string;
};
export type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
};
export type AuthResponse = {
    success: boolean;
    user: User;
    message?: string;
};
export type SignUpData = {
    username: string;
    email: string;
    password: string;
};
export type LoginData = {
    email: string;
    password: string;
}
export type ApiError = {
   response?: {
    data?: {
        message?: string;
    };
   };
   message?: string;
};
