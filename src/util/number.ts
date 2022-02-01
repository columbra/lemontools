import crypto from "crypto";

export function rnd(low: number, high: number): number {
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

export function secureRandomness(): Promise<number> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(256, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.readUInt32LE(0));
      }
    });
  });
}
