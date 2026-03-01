import type { UserResponse } from "../../shared/@types/UserResponse";

export type AuthResponse = {
  user?: UserResponse;
  access_token?: string;
};
