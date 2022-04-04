import { readFileSync } from "fs";
import { load } from "js-yaml";
import path from "path";

export default function getConfig(): Readonly<Record<string, any>> {
  return load(readFileSync(path.join(__dirname, "../../../config.yaml"), "utf-8"));
}
