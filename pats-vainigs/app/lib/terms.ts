import { db } from "./db";

export interface Term {
  id: number;
  name: string;
  definition: string;
  created_at: string;
}

export function getAllTerms(): Term[] {
  return db
    .prepare("SELECT * FROM terms ORDER BY name ASC")
    .all() as Term[];
}

export function getTermsMap(): Map<string, string> {
  const terms = getAllTerms();
  const map = new Map<string, string>();
  for (const t of terms) {
    map.set(t.name.toLowerCase(), t.definition);
  }
  return map;
}
