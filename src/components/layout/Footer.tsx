import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { AppThemeProvider } from './AppTheme';
import LogoIcon from '../ui/LogoIcon';

export default function Footer() {
  return (
    <AppThemeProvider>
      <AppBar
        position="static"
        color="default"
        component="footer"
        sx={{
          mt: 4,
          top: 'auto',
          bottom: 0,
          bgcolor: (t) => t.palette.background.default,
          boxShadow: 'none',
          borderTop: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <LogoIcon size={18} />
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Unite Pro Teams JP
            </Typography>
            <Typography variant="body2" color="text.secondary" aria-hidden="true">
              •
            </Typography>
            <Link
              href="https://github.com/s2terminal/unite-pro-team-jp"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              https://github.com/s2terminal/unite-pro-team-jp
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </AppThemeProvider>
  );
}
