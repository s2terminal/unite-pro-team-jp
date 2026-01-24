import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fuse from 'fuse.js';
import href from '../../lib/url';
import { AppThemeProvider } from '../layout/AppTheme';

type Player = { slug: string; name: string; alias?: string[] };

export default function PlayerList({ players }: { players: Player[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fuse.jsの設定
  const fuse = useMemo(() => {
    return new Fuse(players, {
      keys: ['name', 'alias', 'slug'],
      threshold: 0.4, // ファジー度合い（0: 完全一致, 1: なんでもマッチ）
      includeScore: true,
    });
  }, [players]);

  // 検索結果
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

      {/* 検索フォーム */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="プレイヤーを検索"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="名前、エイリアス、IDで検索..."
          autoComplete="off"
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
          {filteredPlayers.length} 人のプレイヤーが見つかりました
        </Typography>
      </Box>

      {/* プレイヤーカードのグリッド */}
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
          mt: 1,
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
                minHeight: 80,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target?.closest('a')) return;
                window.location.href = href(['player', player.slug]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const target = e.target as HTMLElement;
                  if (target?.closest('a')) return;
                  e.preventDefault();
                  window.location.href = href(['player', player.slug]);
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
                    {player.name}
                  </Box>
                </Typography>
                {player.alias && player.alias.length > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    aka: {player.alias.join(', ')}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  @{player.slug}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {filteredPlayers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            該当するプレイヤーが見つかりませんでした
          </Typography>
        </Box>
      )}
    </AppThemeProvider>
  );
}
