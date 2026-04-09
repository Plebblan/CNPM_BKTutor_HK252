import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper
} from '@mui/material';

import './HomePage.css';
import { useState, useEffect } from 'react';
import NavigationBar from '../components/navigationbar.jsx';  
export default function HomePage() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false); // Đặt false nếu dữ liệu được truyền từ prop hoặc fetch bên ngoài
  const fetchidentity = async () => {
    try{
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/identity', {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      setIdentity(data);
    } catch (err){
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const run = async () => {
      await fetchidentity();
    };
    run();
  }, []);

  useEffect(() => {
    if (!identity) return;
    console.log(identity.role);
    switch (identity.role) {
        
        case "admin":
            navigate("/adminhome");
        break;
        case "student":
            navigate("/studenthome");
        break;
        case "tutor":
            navigate("/tutorhome");
        break;
        default:
            navigate("/login");
        break;
    }
  }, [identity, navigate]);


  return (
    <Box className="home-page" sx={{width:'100vw', height:'100vh'}}>
      {/* Header Navigation */}
      <NavigationBar/>

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