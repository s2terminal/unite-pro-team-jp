import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import href from '../../lib/url';
import { AppThemeProvider } from '../layout/AppTheme';

type Team = { slug: string; name: string; memo?: string };

export default function TeamList({ teams }: { teams: Team[] }) {
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
          </Card>
        ))}
      </Box>
    </AppThemeProvider>
  );
}
