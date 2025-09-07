import { loadMemberYaml, loadRosterYaml, loadTeamYaml } from './yamlLoader';

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

// YAML型はyamlLoaderからimport

export async function getTeams(): Promise<Team[]> {
  const data = await loadTeamYaml();
  const teams: Team[] = Object.entries(data).map(([slug, t]) => ({
    slug,
    name: t.name ?? slug,
    alias: t.alias,
    reference: t.reference,
    memo: t.memo,
  }));
  return teams;
}

export async function getTeamSlugs(): Promise<TeamSlug[]> {
  const teams = await getTeams();
  return teams.map((t) => t.slug);
}

export async function getTeamBySlug(slug: TeamSlug): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find((t) => t.slug === slug);
}

export async function getPlayers(): Promise<Player[]> {
  const data = await loadMemberYaml();
  const players: Player[] = Object.entries(data.player ?? {}).map(([slug, p]) => ({
    slug,
    name: p.name ?? slug,
    alias: p.alias,
    reference: p.reference,
  }));
  return players;
}

async function getPlayerSlugs(): Promise<PlayerSlug[]> {
  // member.yamlに定義されているplayerと、roster.yamlに登場するplayerの和集合
  const [players, rosters] = await Promise.all([getPlayers(), getRosters()]);
  const set = new Set<PlayerSlug>(players.map((p) => p.slug));
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
  return players.find((p) => p.slug === slug);
}

export async function getRosters(): Promise<Map<TeamSlug, RosterChange[]>> {
  const data = await loadRosterYaml();
  const map = new Map<TeamSlug, RosterChange[]>();
  for (const [teamSlug, changes] of Object.entries(data)) {
    const sorted = [...(changes ?? [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    map.set(teamSlug, sorted);
  }
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
  const teamSlugs = await getTeamSlugs();
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
