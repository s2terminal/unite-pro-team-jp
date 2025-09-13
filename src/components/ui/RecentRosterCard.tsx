import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import RosterHistory, { type RosterChange, type Player } from './RosterHistory';
import href from '../../lib/url';

export type RecentChangeItem = {
  date: string;
  team: { slug: string; name: string };
  ins: string[];
  outs: string[];
  references?: string[];
};

export default function RecentRosterCard({
  items,
  playersBySlug,
}: {
  items: RecentChangeItem[];
  playersBySlug: Record<string, Player>;
}) {
  if (!items.length) return null;
  const history: RosterChange[] = items.map((c) => ({
    date: c.date,
    member: { in: c.ins, out: c.outs },
    reference: c.references,
  }));
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          最近のロスター変更
        </Typography>
        <RosterHistory
          history={history}
          playersBySlug={playersBySlug}
          renderPrefix={(_, idx) => {
            const c = items[idx];
            return (
              <strong>
                <Link href={href(['team', c.team.slug])}>{c.team.name}</Link>
              </strong>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
