import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type Team = { slug: string; name: string; memo?: string };

export default function TeamList({ teams }: { teams: Team[] }) {
  return (
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
          <CardActionArea href={`/team/${t.slug}/`}>
            <CardContent>
              <Typography variant="h6" component="div">{t.name}</Typography>
              {t.memo && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t.memo}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
