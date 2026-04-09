import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'
import MessageIcon from '@mui/icons-material/Message'
import './HomePage.css';
import { useState } from 'react';

export default function HomePage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const response = await fetch(''); 
      const result = await response.json();
      setData(result);
      console.log('GET result:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <Box className="home-page" sx={{width:'100vw', height:'100vh'}}>
      {/* Header Navigation */}
      <AppBar className="header-nav">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50, cursor: 'pointer' }} onClick={() => navigate('/adminhome')}/>
            <Typography 
              variant="h6" 
              sx={{ fontWeight: 600 , cursor: 'pointer'}}
              onClick={() => navigate ('/adminhome')}
            >
              BK Tutor
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Trang chủ
            </Typography>
            <>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
            >
              Danh sách giảng viên
            </Typography>
            {data && (
              <pre style={{ marginTop: 16 }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
            </>
            <Typography
              component="a"
              href="https://localhost:5173/subjectlist?ticket="
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Tài liệu
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Các lớp học
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => navigate('/login')}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              sx={{ 
                color: 'white'
              }}
              onClick={() => navigate('/login')}
            >
              <MessageIcon/>
            </IconButton>
            <Button
              class="dropdown"
              role="button"
              data-toggle="dropdown"
              sx={{ backgroundColor: 'white', color: '#0099ff', fontWeight: 600 }}
            >
              Menu
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box className="hero-section" sx={{ pt: 8, position: 'relative', zIndex: 2 }}>
        <Box className="hero-overlay"></Box>
        <Container maxWidth="lg" spacing={4}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: 500}}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    background: 'white',
                    padding: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/bk-logo.png"
                    alt="BK Logo"
                    style={{ width: 80, height: 80 }}
                  />
                </Box>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                BK Tutor Program
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#e0e7ff',
                  fontWeight: 500,
                }}
              >
                TRƯỜNG ĐẠI HỌC BÁCH KHOA
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} >
              <Box
                component="img"
                src="/team-background.jpg"
                alt="BK Tutor Team"
                sx={{
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                  opacity: 0.95,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Introduction Section */}
      <Container maxWidth="lg">
        <Paper
          elevation={2}
          sx={{
            p: 5,
            mt: 5,
            mb: 5,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#0099ff',
              fontWeight: 600,
              mb: 4,
            }}
          >
            Giới thiệu:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#333',
                textAlign: 'justify',
              }}
            >
              BK Tutor Program là hệ thống hỗ trợ quản lý chương trình Tutor-Mentor tại
              Trường Đại học Bách Khoa – ĐHQG TP.HCM (HCMUT), được thiết kế nhằm nâng
              cao hiệu quả học tập và phát triển kỹ năng cho sinh viên.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#333',
                textAlign: 'justify',
              }}
            >
              BK Tutor Program hướng đến một môi trường học tập hiệu dạt, thân thiện
              và đề mở rộng, góp phần nâng cao chất lượng đào tạo và trải nghiệm học
              tập của sinh viên.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}