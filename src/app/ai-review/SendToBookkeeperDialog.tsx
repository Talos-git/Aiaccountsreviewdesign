import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import type { Finding } from './types';

type SendToBookkeeperDialogProps = {
  open: boolean;
  selectedFindings: Finding[];
  consolidatedNotes: string;
  onChangeConsolidatedNotes: (notes: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function SendToBookkeeperDialog({
  open,
  selectedFindings,
  consolidatedNotes,
  onChangeConsolidatedNotes,
  onClose,
  onConfirm,
}: SendToBookkeeperDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Send to Bookkeeper</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          You are sending {selectedFindings.length} finding(s). This is a prototype flow and will only update local UI state.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Consolidated notes (optional)"
          value={consolidatedNotes}
          onChange={(e) => onChangeConsolidatedNotes(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box>
          <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Preview
          </Typography>
          <List
            dense
            sx={(theme) => ({
              maxHeight: 240,
              overflow: 'auto',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.55),
            })}
          >
            {selectedFindings.map((f) => (
              <ListItem key={f.id} divider>
                <ListItemText
                  primary={f.title}
                  secondary={`${f.section.statement === 'balance_sheet' ? 'BS' : 'P&L'} > ${f.section.category} > ${f.section.account}`}
                  primaryTypographyProps={{ sx: { fontSize: 13 } }}
                  secondaryTypographyProps={{ sx: { fontSize: 12 } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text" sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={{ textTransform: 'none' }} disabled={selectedFindings.length === 0}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
