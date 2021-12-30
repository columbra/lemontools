import axios from "axios";

export async function getJSON<T = unknown>(url: string) {
  const res: T = JSON.parse((await axios.get(url)).data);
  return res;
}
