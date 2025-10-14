import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fuse from 'fuse.js';
import href from '../../lib/url';
import { AppThemeProvider } from '../layout/AppTheme';

type Player = {
  slug: string;
  name: string;
  alias?: string[];
  currentTeam?: string;
  currentTeamName?: string;
  lastTeam?: string;
  lastTeamName?: string;
};

export default function PlayerList({ players }: { players: Player[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fuse.jsの設定
  const fuse = useMemo(
    () =>
      new Fuse(players, {
        keys: [
          { name: 'name', weight: 2 },
          { name: 'slug', weight: 1.5 },
          { name: 'alias', weight: 1 },
          // { name: 'currentTeamName', weight: 0.5 },
          // { name: 'lastTeamName', weight: 0.5 },
        ],
        // 0.5で "oyabun" で "おぶやん" がマッチする
        threshold: 0.5,
        includeScore: true,
      }),
    [players]
  );

  // フィルタリングされたプレイヤーリスト
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      return players;
    }
    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [searchQuery, fuse, players]);

  return (
    <AppThemeProvider>
      <h1>プレイヤー一覧</h1>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="プレイヤーを検索"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="プレイヤー名で検索..."
          // sx={{ maxWidth: 600 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {filteredPlayers.length} 人のプレイヤー
          {searchQuery && ` (全 ${players.length} 人中)`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
            lg: '1fr 1fr 1fr 1fr',
          },
          gap: 2,
        }}
      >
        {filteredPlayers.map((player) => (
          <Card
            key={player.slug}
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
                justifyContent: 'center',
                minHeight: 96,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => {
                window.location.href = href(['player', player.slug]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.location.href = href(['player', player.slug]);
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', width: '100%' }}>
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
                    {player.name}
                  </Box>
                </Typography>
                {player.alias && player.alias.length > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    （{player.alias.join(', ')}）
                  </Typography>
                )}
                {player.currentTeamName && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    所属: {player.currentTeamName}
                  </Typography>
                )}
                {!player.currentTeamName && player.lastTeamName && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    前所属: {player.lastTeamName}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {filteredPlayers.length === 0 && searchQuery && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            「{searchQuery}」に一致するプレイヤーが見つかりませんでした
          </Typography>
        </Box>
      )}
    </AppThemeProvider>
  );
}
