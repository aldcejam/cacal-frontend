import type { UserRes } from "../../user/@types/UserRes";

export type AuthRes = {
  user?: UserRes;
  access_token?: string;
};
