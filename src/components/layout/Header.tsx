import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import href from '../../lib/url';
import { AppThemeProvider } from './AppTheme';
import LogoIcon from '../ui/LogoIcon';

export default function Header() {
  return (
    <AppThemeProvider>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              component="a"
              href={href('')}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { opacity: 0.9 },
              }}
            >
              <LogoIcon size={28} />
              <Typography variant="h6" component="span">
                Unite Pro Teams JP
              </Typography>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </AppThemeProvider>
  );
}
