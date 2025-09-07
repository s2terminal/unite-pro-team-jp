import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import href from '../lib/url';

type Team = { slug: string; name: string };
type Player = { slug: string; name: string; alias?: string[]; reference?: string[] };
type HistoryItem = { team: string; date: string; action: 'in' | 'out' };

export default function PlayerDetail({
  player,
  currentTeam,
  history,
  teamBySlug,
}: {
  player: Player;
  currentTeam?: string;
  history: HistoryItem[];
  teamBySlug: Record<string, Team>;
}) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {player?.name ?? player.slug}
          </Typography>
          {!!player?.alias?.length && (
            <Typography variant="body2" color="text.secondary">
              （{player.alias.join(', ')}）
            </Typography>
          )}
          {!!player?.reference?.length && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {player.reference.map((r, i) => (
                <Link key={i} href={r} target="_blank" rel="noopener noreferrer" sx={{ mr: 1 }}>
                  {r}
                </Link>
              ))}
            </Typography>
          )}
        </CardContent>
      </Card>

      {currentTeam ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              現在の所属
            </Typography>
            <Typography>
              <Link href={href(['team', currentTeam])}>
                {teamBySlug[currentTeam]?.name ?? currentTeam}
              </Link>
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            所属履歴
          </Typography>
          {history.length ? (
            <Box sx={{ display: 'grid', gap: 1 }}>
              {history.map((h, idx) => (
                <Typography key={idx}>
                  <strong>{h.date}</strong> {h.action === 'in' ? '加入' : '離脱'} -{' '}
                  <Link href={href(['team', h.team])}>{teamBySlug[h.team]?.name ?? h.team}</Link>
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">履歴がありません。</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
