import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import href from '../../lib/url';

export type MemberChipsProps = {
  slugs: string[];
  playersBySlug: Record<string, { name?: string } | undefined>;
  chipColor?: 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  emptyText?: string;
};

export default function MemberChips({
  slugs,
  playersBySlug,
  chipColor = 'secondary',
  emptyText = 'メンバー情報がありません。',
}: MemberChipsProps) {
  if (!slugs?.length) {
    return <Typography color="text.secondary">{emptyText}</Typography>;
  }

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {slugs.map((pslug) => (
        <Chip
          key={pslug}
          clickable
          component="a"
          href={href(['player', pslug])}
          label={playersBySlug[pslug]?.name ?? pslug}
          color={chipColor}
        />
      ))}
    </Stack>
  );
}
