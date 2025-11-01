import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import href, { normalizePath } from '../../lib/url';
import { AppThemeProvider } from './AppTheme';

interface NavigationTabsProps {
  currentPath?: string;
}

export default function NavigationTabs({ currentPath = '/' }: NavigationTabsProps) {
  const normalizedPath = normalizePath(currentPath);

  // 現在のパスに基づいてタブの値を決定
  const getCurrentTab = (): 0 | 1 | false => {
    if (normalizedPath.startsWith('/team')) {
      return 0;
    }
    if (normalizedPath.startsWith('/players') || normalizedPath.startsWith('/player')) {
      return 1;
    }
    return false;
  };

  return (
    <AppThemeProvider>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={getCurrentTab()}
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 'medium',
              minWidth: { xs: 100, sm: 120 },
            },
          }}
        >
          <Tab label="🏆 チーム" aria-label="チーム" href={href('team')} />
          <Tab label="👤 プレイヤー" aria-label="プレイヤー" href={href('players')} />
        </Tabs>
      </Box>
    </AppThemeProvider>
  );
}
