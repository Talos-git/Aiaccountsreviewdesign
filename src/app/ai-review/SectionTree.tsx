import { Box, Button, Chip, Collapse, IconButton, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { ExpandLess, ExpandMore, UnfoldLess, UnfoldMore } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

import type { SectionNode, SelectedSection } from './types';

type SectionTreeProps = {
  tree: SectionNode[];
  expandedIds: Set<string>;
  selectedSectionId: string | null;
  onSelectSection: (section: SelectedSection) => void;
  onToggleExpanded: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onClearSelection: () => void;
};

function renderNode({
  node,
  depth,
  expandedIds,
  selectedSectionId,
  onSelectSection,
  onToggleExpanded,
}: {
  node: SectionNode;
  depth: number;
  expandedIds: Set<string>;
  selectedSectionId: string | null;
  onSelectSection: (section: SelectedSection) => void;
  onToggleExpanded: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);

  return (
    <Box key={node.id}>
      <ListItemButton
        dense
        selected={selectedSectionId === node.id}
        onClick={() => onSelectSection(node.section)}
        sx={(theme) => ({
          pl: 2 + depth * 2,
          mx: 1,
          my: 0.25,
          borderRadius: 2.5,
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.10),
          },
          '&.Mui-selected:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.14),
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, 0.04),
          },
        })}
      >
        <ListItemText
          primary={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary' }}>
                {node.label}
              </Typography>
              <Chip
                size="small"
                label={node.count}
                variant="outlined"
                sx={(theme) => ({
                  height: 22,
                  fontSize: 12,
                  backgroundColor: alpha(theme.palette.text.primary, 0.03),
                })}
              />
            </Stack>
          }
        />
        {hasChildren ? (
          <IconButton
            size="small"
            edge="end"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded(node.id);
            }}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        ) : null}
      </ListItemButton>

      {hasChildren ? (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children.map((child) =>
              renderNode({
                node: child,
                depth: depth + 1,
                expandedIds,
                selectedSectionId,
                onSelectSection,
                onToggleExpanded,
              }),
            )}
          </List>
        </Collapse>
      ) : null}
    </Box>
  );
}

export function SectionTree({
  tree,
  expandedIds,
  selectedSectionId,
  onSelectSection,
  onToggleExpanded,
  onExpandAll,
  onCollapseAll,
  onClearSelection,
}: SectionTreeProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700 }}>
            Sections
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="text" startIcon={<UnfoldMore fontSize="small" />} onClick={onExpandAll}>
              Expand all
            </Button>
            <Button size="small" variant="text" startIcon={<UnfoldLess fontSize="small" />} onClick={onCollapseAll}>
              Collapse all
            </Button>
          </Stack>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          onClick={onClearSelection}
          sx={(theme) => ({
            mt: 1,
            fontSize: 12,
            borderColor: alpha(theme.palette.text.primary, 0.12),
            backgroundColor: alpha(theme.palette.background.paper, 0.55),
          })}
          fullWidth
        >
          All findings
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List disablePadding>
          {tree.map((node) =>
            renderNode({
              node,
              depth: 0,
              expandedIds,
              selectedSectionId,
              onSelectSection,
              onToggleExpanded,
            }),
          )}
        </List>
      </Box>
    </Box>
  );
}
