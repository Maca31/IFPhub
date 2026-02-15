import Hashids from "hashids";

const secret = process.env.HASH_SECRET || "SUPER_SECRET_KEY_CHANGE_ME";

// Instancias separadas para usuario y proyecto (mejor seguridad)
const userHash = new Hashids(secret + "_user", 12);
const projectHash = new Hashids(secret + "_project", 12);

// -------- USER --------
export function encodeUserId(id: number): string {
  return userHash.encode(id);
}

export function decodeUserId(hash: string): number | null {
  const res = userHash.decode(hash);
  return res.length ? Number(res[0]) : null;
}

// -------- PROJECT --------
export function encodeProjectId(id: number): string {
  return projectHash.encode(id);
}

export function decodeProjectId(hash: string): number | null {
  const res = projectHash.decode(hash);
  return res.length ? Number(res[0]) : null;
}
