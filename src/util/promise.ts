export function sleep(time: number): Promise<true> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time);
  });
}
