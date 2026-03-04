import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  TextField,
  Badge,
  Link,
  FormControl,
} from '@mui/material';
import {
  ArrowBack,
  Home,
  ChatBubble,
  Person,
  Description,
  Folder,
  MenuBook,
  BarChart,
  Dashboard,
  Settings,
  Launch,
  KeyboardArrowDown,
} from '@mui/icons-material';

import { AiReviewTab } from './ai-review/AiReviewTab';

// Checklist data
const checklistItems = [
  { id: 1, text: 'Functional currency of current year management report is similar to previous year', height: 55 },
  { id: 2, text: 'Issued and paid up capital is accurate', height: 55 },
  { id: 3, text: 'Revenues are recorded correctly where any debit entries (if any) are accurate and supported by relevant credit notes', height: 75 },
  { id: 4, text: 'Cost of sales are recorded correctly where any credit entries (if any) are accurate and supported by relevant credit notes', height: 75 },
  { id: 5, text: 'Ensure accounts do not show a gross loss in profit and loss statement', height: 55 },
  { id: 6, text: 'Other income does not consist of any debit entries; and only income from activities not related to the main business', height: 75 },
  { id: 7, text: 'All expenses year on year are consistent and accurate', height: 55 },
  { id: 8, text: 'Closing bank balance reconciles to bank statement at end of financial year', height: 55 },
  { id: 9, text: 'All investments are recorded accurately with correct share quantities verified with agreements', height: 75 },
  { id: 10, text: 'Depreciation or amortisation is done for the year', height: 55 },
  { id: 11, text: 'Inventory or stock is verified against client stock movement or inventory list', height: 55 },
  { id: 12, text: 'Prepayments, accruals and any interest on loans are recognised correctly with schedules', height: 75 },
  { id: 13, text: 'Amounts due to or due from director are recorded in their correct currency and are indeed reimbursable', height: 75 },
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(1);
  const [checkStatus, setCheckStatus] = useState('not-checked');
  const [note, setNote] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Render content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0: // Ticket tab
        return (
          <>
            {/* Middle Panel - Checklist */}
            <Box
              sx={{
                width: 637.5,
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  height: 63.75,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  Make sure all checks are confirmed (0/13 done)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<KeyboardArrowDown />}
                  sx={{ textTransform: 'none', fontSize: 13, color: '#666', borderColor: '#e0e0e0' }}
                >
                  Confirm all
                </Button>
              </Box>

              {/* Scrollable List */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List sx={{ p: 0 }}>
                  {checklistItems.map((item, index) => (
                    <ListItem
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      sx={{
                        height: item.height,
                        borderBottom: '1px solid #e0e0e0',
                        bgcolor: index === 0 ? '#e3f2fd' : selectedItem === item.id ? '#e3f2fd' : 'white',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                        },
                        px: 2,
                        gap: 2,
                      }}
                    >
                      <Badge
                        badgeContent="!"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: '#f44336',
                            color: 'white',
                            width: 20,
                            height: 20,
                            borderRadius: '10px',
                            fontSize: 12,
                            fontWeight: 600,
                          },
                        }}
                      />
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: { fontSize: 14, color: '#333', lineHeight: 1.5 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            {/* Right Panel - Details */}
            <Box
              sx={{
                flex: 1,
                bgcolor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Selected Item Header */}
              <Box
                sx={{
                  height: 55,
                  px: 2,
                  bgcolor: 'white',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Badge
                  badgeContent="!"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#f44336',
                      color: 'white',
                      width: 20,
                      height: 20,
                      borderRadius: '10px',
                      fontSize: 12,
                      fontWeight: 600,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ fontSize: 14, color: '#333' }}>
                  {checklistItems[0].text}
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {/* Action Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
                    Action
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, color: '#666', mb: 1 }}>
                    To ensure consistent currency presentation and usage
                  </Typography>
                  <Link
                    href="#"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: 13,
                      textDecoration: 'none',
                    }}
                  >
                    <Launch sx={{ fontSize: 16 }} />
                    How to work with this check
                  </Link>
                </Box>

                {/* Status Dropdown */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={checkStatus}
                    onChange={(e) => setCheckStatus(e.target.value)}
                    displayEmpty
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    }}
                  >
                    <MenuItem value="not-checked">Not checked</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                {/* Settings Icon */}
                <IconButton size="small" sx={{ color: '#666', mb: 2 }}>
                  <Settings sx={{ fontSize: 18 }} />
                </IconButton>

                {/* Note Section */}
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 13, color: '#333', mb: 1 }}>
                    Note
                  </Typography>
                  <TextField
                    multiline
                    rows={5}
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        );

      case 1: // AI Review tab
        return <AiReviewTab />;

      default:
        return (
          <Box
            sx={{
              flex: 1,
              bgcolor: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Content coming soon
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'white' }}>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ minHeight: '61.5px !important', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <IconButton
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ fontSize: 14 }}>
              Royale Infinite Pte. Ltd.: Review with Accountant for 1 Jan - 31 Dec 2023
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              px: 3,
              height: 36.5,
            }}
          >
            Done
          </Button>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: 14,
            },
          }}
        >
          <Tab label="Ticket" />
          <Tab label="AI Review" />
          <Tab label="Company" />
          <Tab label="Chat" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Persists across tabs */}
        <Box
          sx={{
            width: 64,
            bgcolor: '#fafafa',
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
            gap: 1,
          }}
        >
          <IconButton sx={{ color: '#666' }}>
            <Home />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <ChatBubble />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Person />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Description />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Folder />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <MenuBook />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <BarChart />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Dashboard />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Settings />
          </IconButton>
        </Box>

        {/* Dynamic Tab Content */}
        {renderTabContent()}
      </Box>
    </Box>
  );
}
