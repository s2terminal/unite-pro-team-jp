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
          <Card
            key={t.slug}
            variant="outlined"
            sx={{
              display: 'flex',
            }}
          >
            <CardActionArea
              component="div"
              role="link"
              tabIndex={0}
              sx={{
                flexGrow: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 96,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target?.closest('a')) return; // 子要素のリンククリックは優先
                window.location.href = href(['team', t.slug]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const target = e.target as HTMLElement;
                  if (target?.closest('a')) return;
                  e.preventDefault();
                  window.location.href = href(['team', t.slug]);
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  <Box
                    component="span"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      textDecorationThickness: '1.5px',
                      transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
                      textDecorationColor: 'rgba(0,0,0,0.3)',
                      '&:hover': {
                        color: 'primary.dark',
                        textDecorationColor: 'currentColor',
                      },
                    }}
                  >
                    {t.name}
                  </Box>
                </Typography>
              </CardContent>
              <CardContent>
                <MemberChips
                  slugs={rosters[t.slug] ?? []}
                  playersBySlug={playersBySlug}
                  emptyText=""
                />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </AppThemeProvider>
  );
}
