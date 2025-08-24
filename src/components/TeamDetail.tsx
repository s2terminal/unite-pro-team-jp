import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

type Team = { slug: string; name: string; alias?: string[]; memo?: string; reference?: string[] };
type Player = { slug: string; name: string };
type RosterChange = { date: string; member: { in?: string[]; out?: string[] }; reference?: string[] };

export default function TeamDetail({ team, current, history, playersBySlug }: {
  team: Team;
  current: string[];
  history: RosterChange[];
  playersBySlug: Record<string, Player>;
}) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>{team.name}</Typography>
          {team.memo && <Typography variant="body1" sx={{ mb: 1 }}>{team.memo}</Typography>}
          {!!team.alias?.length && (
            <Typography variant="body2" color="text.secondary">別名: {team.alias.join(', ')}</Typography>
          )}
          {!!team.reference?.length && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              参考: {team.reference.map((r, i) => (
                <Link key={i} href={r} target="_blank" rel="noopener noreferrer" sx={{ mr: 1 }}>{r}</Link>
              ))}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>現在のメンバー</Typography>
          {current.length ? (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {current.map((pslug) => (
                <Chip key={pslug} clickable component="a" href={`/player/${pslug}/`} label={playersBySlug[pslug]?.name ?? pslug} />
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">メンバー情報がありません。</Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>ロスター履歴</Typography>
          {history.length ? (
            <Stack spacing={1}>
              {history.map((h, idx) => (
                <Box key={idx}>
                  <Typography component="span" sx={{ fontWeight: 600 }}>{h.date}:</Typography>{' '}
                  {!!h.member.in?.length && (
                    <Typography component="span">
                      加入:{' '}
                      {h.member.in.map((s, i) => (
                        <>
                          <Link key={`in-${s}`} href={`/player/${s}/`}>
                            {playersBySlug[s]?.name ?? s}
                          </Link>
                          {i < (h.member.in?.length ?? 0) - 1 ? ', ' : ''}
                        </>
                      ))}
                    </Typography>
                  )}
                  {!!h.member.out?.length && (
                    <Typography component="span">
                      {' '}離脱:{' '}
                      {h.member.out.map((s, i) => (
                        <>
                          <Link key={`out-${s}`} href={`/player/${s}/`}>
                            {playersBySlug[s]?.name ?? s}
                          </Link>
                          {i < (h.member.out?.length ?? 0) - 1 ? ', ' : ''}
                        </>
                      ))}
                    </Typography>
                  )}
                  {!!h.reference?.length && (
                    <Typography component="span" color="text.secondary"> [
                      {(h.reference ?? []).map((r, i) => (
                        <>
                          <Link key={i} href={r} target="_blank" rel="noopener noreferrer" sx={{ mr: 0.5 }}>{`参考${i + 1}`}</Link>
                          {i < ((h.reference?.length ?? 0) - 1) ? ' ' : ''}
                        </>
                      ))}
                    ]</Typography>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">履歴がありません。</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
