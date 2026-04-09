import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
} from '@mui/material';
import { useState } from 'react';
import './Layout.css'; // Giữ nguyên, nhưng đảm bảo file này không có CSS xung đột

// Chiều rộng cố định của Sidebar
const DRAWER_WIDTH = 250; 

export default function Layout() {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = localStorage.getItem('token'); // Kiểm tra trạng thái đăng nhập

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Courses', path: '/courses' },
    { label: 'Calendar', path: '/calendar' }, // Thêm lịch vào Sidebar
    { label: 'Profile', path: '/profile' },
  ];

  return (
    // 1. Container chính: Đặt Flex Direction là cột (Header trên, Nội dung dưới)
    <Box className="layout" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #0099ff 0%, #0077cc 100%)' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexGrow: 1,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              BK Tutor
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Typography
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {isAuthenticated && (
            <Button
              variant="contained"
              color="inherit"
              sx={{ ml: 2, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 2. Main Container: Đặt Flex để Sidebar và Content nằm cạnh nhau */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        
        {/* Sidebar (Drawer) */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0, // QUAN TRỌNG: Đảm bảo sidebar không bao giờ co lại
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              backgroundColor: '#f5f5f5',
              // Đảm bảo Drawer nằm dưới AppBar
              position: 'relative', 
              height: '100%',
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <List>
              {navItems.map((item) => (
                <ListItem
                  button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* 3. Content: Chiếm toàn bộ không gian còn lại */}
        <Box 
          className="main-content"
          sx={{ 
            flexGrow: 1,           
            minWidth: 0,           
            overflowX: 'auto',     
            backgroundColor: '#f5f5f5', 
          }}
        >
          <Container maxWidth="xl" sx={{ py: 3 }}> {/* Đã đổi maxWidth thành "xl" để lịch có thêm không gian */}
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}