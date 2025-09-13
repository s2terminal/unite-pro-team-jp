import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import href from '../../lib/url';

export type Player = { slug: string; name: string };
export type RosterChange = {
  date: string;
  member: { in?: string[]; out?: string[] };
  reference?: string[];
};

export default function RosterHistory({
  history,
  playersBySlug,
  renderPrefix,
}: {
  history: RosterChange[];
  playersBySlug: Record<string, Player>;
  renderPrefix?: (c: RosterChange, index: number) => React.ReactNode;
}) {
  if (!history.length) {
    return <Typography color="text.secondary">履歴がありません。</Typography>;
  }

  return (
    <Stack spacing={0.5}>
      {history.map((h, idx) => {
        const hasIn = !!h.member.in?.length;
        const hasOut = !!h.member.out?.length;
        return (
          <Box
            key={idx}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' },
              alignItems: 'start',
              gap: 1,
              p: 1,
              borderRadius: 1,
              typography: 'body2',
              '&:nth-of-type(odd)': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <Box component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {h.date}
            </Box>
            <Box component="span" sx={{ fontSize: 14, lineHeight: 1.6 }}>
              {renderPrefix && <>{renderPrefix(h, idx)} </>}
              {hasIn && (
                <>
                  <strong>加入:</strong>{' '}
                  {h.member.in!.map((s, i) => (
                    <span key={`in-span-${s}`}>
                      <Link href={href(['player', s])}>{playersBySlug[s]?.name ?? s}</Link>
                      {i < (h.member.in!.length ?? 0) - 1 ? ', ' : ''}
                    </span>
                  ))}
                </>
              )}
              {hasOut && (
                <>
                  {hasIn && ' '}
                  <strong>離脱:</strong>{' '}
                  {h.member.out!.map((s, i) => (
                    <span key={`out-span-${s}`}>
                      <Link href={href(['player', s])}>{playersBySlug[s]?.name ?? s}</Link>
                      {i < (h.member.out!.length ?? 0) - 1 ? ', ' : ''}
                    </span>
                  ))}
                </>
              )}
              {!!h.reference?.length && (
                <Typography
                  component="span"
                  color="text.secondary"
                  variant="body2"
                  sx={{ ml: 0.5 }}
                >
                  [
                  {(h.reference ?? []).map((r, i) => (
                    <span key={`ref-span-${r}`}>
                      <Link
                        href={r}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mr: 0.5 }}
                      >{`参考${i + 1}`}</Link>
                      {i < (h.reference?.length ?? 0) - 1 ? ' ' : ''}
                    </span>
                  ))}
                  ]
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
