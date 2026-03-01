import type { UserRes } from "../../shared/@types/UserRes";

export type AuthRes = {
  user?: UserRes;
  access_token?: string;
};
