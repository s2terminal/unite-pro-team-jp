import fs from 'node:fs/promises';
import { parse } from 'yaml';

// Types
export type TeamSlug = string;
export type PlayerSlug = string;

export type Team = {
  slug: TeamSlug;
  name: string;
  alias?: string[];
  reference?: string[];
  memo?: string;
};

export type Player = {
  slug: PlayerSlug;
  name: string;
  alias?: string[];
  reference?: string[];
};

export type RosterChange = {
  date: string; // ISO-like string in YAML
  member: { in?: PlayerSlug[]; out?: PlayerSlug[] };
  reference?: string[];
};

type TeamYaml = Record<string, {
  name: string;
  alias?: string[];
  reference?: string[];
  memo?: string;
}>;

type MemberYaml = {
  player: Record<string, {
    name: string;
    alias?: string[];
    reference?: string[];
  }>;
};

type RosterYaml = Record<string, RosterChange[]>;

async function readYaml(relativePathFromThisFile: string) {
  const url = new URL(relativePathFromThisFile, import.meta.url);
  const raw = await fs.readFile(url, 'utf-8');
  return parse(raw);
}

// Cache to avoid re-reading during a build
let cache: {
  teams?: Team[];
  players?: Player[];
  rosters?: Map<TeamSlug, RosterChange[]>;
} = {};

export async function getTeams(): Promise<Team[]> {
  if (cache.teams) return cache.teams;
  const data = await readYaml('../../data/team.yaml') as TeamYaml;
  const teams: Team[] = Object.entries(data).map(([slug, t]) => ({
    slug,
    name: t.name ?? slug,
    alias: t.alias,
    reference: t.reference,
    memo: t.memo,
  }));
  cache.teams = teams;
  return teams;
}

export async function getTeamSlugs(): Promise<TeamSlug[]> {
  const teams = await getTeams();
  return teams.map(t => t.slug);
}

export async function getTeamBySlug(slug: TeamSlug): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find(t => t.slug === slug);
}

export async function getPlayers(): Promise<Player[]> {
  if (cache.players) return cache.players;
  const data = await readYaml('../../data/member.yaml') as MemberYaml;
  const players: Player[] = Object.entries(data.player ?? {}).map(([slug, p]) => ({
    slug,
    name: p.name ?? slug,
    alias: p.alias,
    reference: p.reference,
  }));
  cache.players = players;
  return players;
}

export async function getPlayerSlugs(): Promise<PlayerSlug[]> {
  // Union of players defined in member.yaml and players appearing in any roster
  const [players, rosters] = await Promise.all([getPlayers(), getRosters()]);
  const set = new Set<PlayerSlug>(players.map(p => p.slug));
  for (const changes of rosters.values()) {
    for (const ch of changes) {
      for (const p of ch.member?.in ?? []) set.add(p);
      for (const p of ch.member?.out ?? []) set.add(p);
    }
  }
  return [...set].sort();
}

export async function getAllPlayerSlugs(): Promise<PlayerSlug[]> {
  return getPlayerSlugs();
}

export async function getPlayerBySlug(slug: PlayerSlug): Promise<Player | undefined> {
  const players = await getPlayers();
  return players.find(p => p.slug === slug);
}

export async function getRosters(): Promise<Map<TeamSlug, RosterChange[]>> {
  if (cache.rosters) return cache.rosters;
  const data = await readYaml('../../data/roster.yaml') as RosterYaml;
  const map = new Map<TeamSlug, RosterChange[]>();
  for (const [teamSlug, changes] of Object.entries(data)) {
    const sorted = [...(changes ?? [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    map.set(teamSlug, sorted);
  }
  cache.rosters = map;
  return map;
}

export async function getRosterForTeam(teamSlug: TeamSlug): Promise<{
  history: RosterChange[];
  current: PlayerSlug[];
}> {
  const rosters = await getRosters();
  const history = rosters.get(teamSlug) ?? [];
  const current = new Set<PlayerSlug>();
  for (const entry of history) {
    if (entry.member?.in) {
      for (const p of entry.member.in) current.add(p);
    }
    if (entry.member?.out) {
      for (const p of entry.member.out) current.delete(p);
    }
  }
  return { history, current: [...current] };
}

export async function getCurrentTeamForPlayer(player: PlayerSlug): Promise<TeamSlug | undefined> {
  const [rosters, teamSlugs] = await Promise.all([getRosters(), getTeamSlugs()]);
  for (const slug of teamSlugs) {
    const { current } = await getRosterForTeam(slug);
    if (current.includes(player)) return slug;
  }
  return undefined;
}

export type PlayerHistoryItem = { team: TeamSlug; date: string; action: 'in' | 'out' };

export async function getPlayerHistory(player: PlayerSlug): Promise<PlayerHistoryItem[]> {
  const rosters = await getRosters();
  const items: PlayerHistoryItem[] = [];
  for (const [team, history] of rosters.entries()) {
    for (const h of history) {
      if (h.member?.in?.includes(player)) items.push({ team, date: h.date, action: 'in' });
      if (h.member?.out?.includes(player)) items.push({ team, date: h.date, action: 'out' });
    }
  }
  return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function displayNameForPlayer(p?: Player): string {
  if (!p) return '';
  return p.name || p.slug;
}
