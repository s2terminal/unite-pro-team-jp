import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import href from '../../lib/url';
import { AppThemeProvider } from './AppTheme';
import LogoIcon from '../ui/LogoIcon';

export default function Header() {
  return (
    <AppThemeProvider>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Link
              href={href('')}
              color="inherit"
              underline="hover"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
            >
              <LogoIcon size={28} sx={{ mr: 0.5 }} />
              <Typography variant="h6" component="span">
                Unite Pro Teams JP
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href={href('')} color="inherit" underline="hover">
              チーム一覧
            </Link>
            <Link href={href('players')} color="inherit" underline="hover">
              プレイヤー一覧
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </AppThemeProvider>
  );
}
