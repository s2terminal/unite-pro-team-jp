import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import { AppThemeProvider } from '../layout/AppTheme';
import MemberChips from '../ui/MemberChips';
import RosterHistory, { type RosterChange } from '../ui/RosterHistory';

type Team = { slug: string; name: string; alias?: string[]; memo?: string; reference?: string[] };
type Player = { slug: string; name: string };
// RosterChange 型は RosterHistory から再利用

export default function TeamDetail({
  team,
  current,
  history,
  playersBySlug,
}: {
  team: Team;
  current: string[];
  history: RosterChange[];
  playersBySlug: Record<string, Player>;
}) {
  return (
    <AppThemeProvider>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {team.name}
            </Typography>
            {team.memo && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                {team.memo}
              </Typography>
            )}
            {!!team.alias?.length && (
              <Typography variant="body2" color="text.secondary">
                （{team.alias.join(', ')}）
              </Typography>
            )}
            {!!team.reference?.length && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {team.reference.map((r, i) => (
                  <Link key={i} href={r} target="_blank" rel="noopener noreferrer" sx={{ mr: 1 }}>
                    {r}
                  </Link>
                ))}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              現在のメンバー
            </Typography>
            <MemberChips slugs={current} playersBySlug={playersBySlug} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ロスター履歴
            </Typography>
            <RosterHistory history={history} playersBySlug={playersBySlug} />
          </CardContent>
        </Card>
      </Box>
    </AppThemeProvider>
  );
}
