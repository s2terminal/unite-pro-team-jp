import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import href from '../../lib/url';
import { AppThemeProvider } from '../layout/AppTheme';
import MemberChips from '../ui/MemberChips';

type Team = { slug: string; name: string; memo?: string };
type RostersByTeam = Record<string, string[]>; // teamSlug -> current member slugs
type PlayersBySlug = Record<string, { name?: string } | undefined>;

export default function TeamList({
  teams,
  rosters,
  playersBySlug,
}: {
  teams: Team[];
  rosters: RostersByTeam;
  playersBySlug: PlayersBySlug;
}) {
  return (
    <AppThemeProvider>
      <p>日本のポケモンユナイトプロチームの情報をまとめています。</p>
      <h1>チーム一覧</h1>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 2,
          mt: 1,
        }}
      >
        {teams.map((t) => (
          <Card key={t.slug} variant="outlined">
            <CardActionArea href={href(['team', t.slug])}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {t.name}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardContent>
              <MemberChips
                slugs={rosters[t.slug] ?? []}
                playersBySlug={playersBySlug}
                emptyText=''
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </AppThemeProvider>
  );
}
