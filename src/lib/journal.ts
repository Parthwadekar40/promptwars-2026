import { getProfile } from './auth';
import { deleteDoc, listDocs, saveDoc } from './firestore';
import type { Answered } from './analyze';

export type Entry = {
  id: string;
  at: number;
  /** uid of the signed-in owner, or "device" when saved while signed out */
  owner: string;
  title: string;
  decision: string;
  leaning: string;
  examined: number;
  total: number;
  answers: Answered[];
  call: string;
  changeMind: string;
};
export type Where = 'cloud' | 'device';

const LOCAL = 'pw_journal';
const COLLECTION = 'reflections';
const ownerNow = (): string => getProfile()?.uid ?? 'device';
const newest = (xs: Entry[]): Entry[] => [...xs].sort((a, b) => b.at - a.at);

function readLocal(): Entry[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL) ?? '[]') as Entry[];
  } catch {
    return [];
  }
}
const writeLocal = (xs: Entry[]): void => localStorage.setItem(LOCAL, JSON.stringify(xs));

export const newEntryId = (): string => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Always keeps a device copy; signed-in people also get a private cloud copy (users/{uid}/reflections). */
export async function saveEntry(e: Omit<Entry, 'owner'>): Promise<Where> {
  const entry: Entry = { ...e, owner: ownerNow() };
  writeLocal([entry, ...readLocal().filter((x) => x.id !== entry.id)]);
  if (!getProfile()) return 'device';
  const r = await saveDoc(COLLECTION, entry.id, { at: entry.at, json: JSON.stringify(entry) });
  return r.ok ? 'cloud' : 'device';
}

/** Merge cloud + device copies by id (Map → O(n)); a failed cloud read degrades to the device copy. */
export async function listEntries(): Promise<{ entries: Entry[]; where: Where }> {
  const mine = readLocal().filter((x) => x.owner === ownerNow());
  if (!getProfile()) return { entries: newest(mine), where: 'device' };
  const r = await listDocs(COLLECTION);
  if (!r.ok) return { entries: newest(mine), where: 'device' };
  const cloud = r.data.flatMap((d) => {
    try {
      return [JSON.parse(d.json) as Entry];
    } catch {
      return [];
    }
  });
  const byId = new Map([...mine, ...cloud].map((x) => [x.id, x]));
  return { entries: newest([...byId.values()]), where: 'cloud' };
}

export async function removeEntry(id: string): Promise<void> {
  writeLocal(readLocal().filter((x) => x.id !== id));
  if (getProfile()) await deleteDoc(COLLECTION, id);
}

export function toMarkdown(e: Omit<Entry, 'id' | 'owner'>): string {
  const when = new Date(e.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const parts = [
    `# ${e.title}`,
    `*${when} · ${e.examined} of ${e.total} blind spots examined*`,
    `## The decision\n${e.decision}`,
  ];
  if (e.leaning) parts.push(`## What I was leaning toward\n${e.leaning}`);
  if (e.answers.length)
    parts.push(`## Questions I sat with\n${e.answers.map((a) => `**${a.question}**\n${a.answer}`).join('\n\n')}`);
  parts.push(`## My call\n${e.call}`);
  if (e.changeMind) parts.push(`## What would change my mind\n${e.changeMind}`);
  return `${parts.join('\n\n')}\n`;
}
