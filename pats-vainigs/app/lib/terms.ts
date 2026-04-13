import { query } from "./db";

export interface Term {
  id: number;
  name: string;
  definition: string;
  created_at: string;
}

export async function getAllTerms(): Promise<Term[]> {
  return query<Term>("SELECT * FROM terms ORDER BY name ASC");
}

export async function getTermsMap(): Promise<Map<string, string>> {
  const terms = await getAllTerms();
  const map = new Map<string, string>();
  for (const t of terms) {
    map.set(t.name.toLowerCase(), t.definition);
  }
  return map;
}
