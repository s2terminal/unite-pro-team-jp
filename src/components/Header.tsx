import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Unite Pro Teams JP
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/" color="inherit" underline="hover">チーム一覧</Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
