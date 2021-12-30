import got from "got/dist/source";

export async function getJSON<T = unknown>(url: string) {
  const res = await got(url).json<T>();
  return res;
}
