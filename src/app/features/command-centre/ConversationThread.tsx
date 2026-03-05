import { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';
import { format } from 'date-fns';
import { ConversationMessage, MessageAuthor } from './types';
import { accentGradient, monoFontFamily, roleColors, shadowAccentLg, uiFontFamily } from './tokens';

interface ConversationThreadProps {
  messages: ConversationMessage[];
  activeRole: 'accountant' | 'bookkeeper';
  onSendMessage: (text: string) => void;
}

const authorLabel: Record<MessageAuthor, string> = {
  ai: 'AI',
  accountant: 'Accountant',
  bookkeeper: 'Bookkeeper',
};

const authorInitial: Record<MessageAuthor, string> = {
  ai: 'AI',
  accountant: 'AC',
  bookkeeper: 'BK',
};

interface MessageBubbleProps {
  message: ConversationMessage;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const isAi = message.author === 'ai';

  const bgColor = isAi
    ? '#F1F5F9'
    : message.author === 'accountant'
      ? `${roleColors.accountant}12`
      : `${roleColors.bookkeeper}12`;

  const borderColor = isAi
    ? '#E2E8F0'
    : message.author === 'accountant'
      ? `${roleColors.accountant}30`
      : `${roleColors.bookkeeper}30`;

  const avatarBg = isAi
    ? '#64748B'
    : message.author === 'accountant'
      ? roleColors.accountant
      : roleColors.bookkeeper;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        gap: 1,
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: avatarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: monoFontFamily,
            fontSize: 9,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.02em',
          }}
        >
          {authorInitial[message.author]}
        </Typography>
      </Box>

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: '80%',
          border: `1px solid ${borderColor}`,
          borderRadius: isOwn ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
          bgcolor: bgColor,
          px: 1.5,
          py: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Typography
            sx={{
              fontFamily: monoFontFamily,
              fontSize: 10,
              fontWeight: 700,
              color: avatarBg,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {authorLabel[message.author]}
          </Typography>
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 11, color: '#94A3B8' }}>
            {format(new Date(message.timestamp), 'dd MMM, HH:mm')}
          </Typography>
        </Stack>
        <Typography sx={{ fontFamily: uiFontFamily, fontSize: 13, color: '#0F172A', lineHeight: 1.55 }}>
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
};

export const ConversationThread = ({ messages, activeRole, onSendMessage }: ConversationThreadProps) => {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onSendMessage(trimmed);
    setDraft('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box>
      {/* Message list */}
      {messages.length > 0 ? (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.author === activeRole}
            />
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            border: '1px dashed #E2E8F0',
            borderRadius: 2,
            p: 2,
            mb: 2,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 13, color: '#94A3B8' }}>
            No messages yet. Add context before sending to the bookkeeper.
          </Typography>
        </Box>
      )}

      {/* Compose */}
      <TextField
        multiline
        minRows={2}
        fullWidth
        placeholder={activeRole === 'accountant' ? 'Add context or instructions for the bookkeeper…' : 'Reply to the accountant…'}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontFamily: uiFontFamily,
            bgcolor: '#FFFFFF',
            '& textarea': {
              fontFamily: uiFontFamily,
              fontSize: 13,
              color: '#0F172A',
              '&::placeholder': { color: '#94A3B8', opacity: 1 },
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: activeRole === 'accountant' ? roleColors.accountant : roleColors.bookkeeper,
              borderWidth: 2,
            },
          },
        }}
      />

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          size="small"
          disabled={draft.trim().length === 0}
          onClick={handleSend}
          endIcon={<Send sx={{ fontSize: 14 }} />}
          sx={{
            textTransform: 'none',
            fontFamily: uiFontFamily,
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            py: 0.75,
            background: accentGradient,
            boxShadow: 'none',
            fontSize: 13,
            '&:hover': { background: accentGradient, boxShadow: shadowAccentLg },
            '&.Mui-disabled': { background: 'none', bgcolor: '#E2E8F0', color: '#94A3B8' },
          }}
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
};
