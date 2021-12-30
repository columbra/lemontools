import axios from "axios";

export async function getJSON<T = unknown>(url: string) {
  const res: T = await axios.get(url)
  return res;
}
