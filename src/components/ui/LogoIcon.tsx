import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import href from '../../lib/url';

type Props = {
  size?: number | string;
  sx?: SxProps<Theme>;
  alt?: string;
};

/**
 * サイト共通のロゴアイコン（favicon.svg を再利用）
 */
export default function LogoIcon({ size = 28, sx, alt = 'Unite Pro Teams JP ロゴ' }: Props) {
  return (
    <Box
      component="img"
      alt={alt}
      src={href('favicon.svg', { trailingSlash: false })}
      sx={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', ...sx }}
    />
  );
}
