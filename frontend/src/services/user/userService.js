import axios from "axios";
import { getOrgFromPath } from "../../helpers/getTenant";

export const getUserProfile = async () => {
  const tenant = getOrgFromPath();
  const response = await axios.get(`/${tenant}/api/users/me/`);
  return response.data;
};