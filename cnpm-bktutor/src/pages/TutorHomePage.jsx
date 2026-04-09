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
import SettingsIcon from '@mui/icons-material/Settings'
import CheckIcon from '@mui/icons-material/Check'
import './HomePage.css';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [messageAnchor, setMessageAnchor] = useState(null);
  const Notiopen = Boolean(notifAnchor);
  const MessageOpen = Boolean(messageAnchor);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([])
  const [identity, setIdentity] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
        await fetch("http://localhost:8080/logout", {
        method: "GET",
        credentials: "include"
        });
        // after cookie is cleared, redirect to login
        navigate("/login");
    } catch (err) {
        console.error("Logout failed", err);
    }
    };

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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/notifications', {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifClick = (event) => {
    setNotifAnchor(event.currentTarget);
    fetchNotifications();
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };


  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/messages', {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      setMessages(data);
      console.log(data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.to]) {
      acc[msg.to] = [];
    }
    acc[msg.to].push(msg);
    return acc;
  }, {});

  const handleMessageClick = (event) => {
    setMessageAnchor(event.currentTarget);
    fetchMessages();
  };

  const handleMessageClose = () => {
    setMessageAnchor(null);
  };

  useEffect(() => {
    const run = async () => {
      await fetchidentity();
    };
    run();
  }, []);

  useEffect(() => {
    if (!identity) return;
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
      <AppBar className="header-nav">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50, cursor: 'pointer' }} onClick={() => navigate('/adminhome')}/>
            <Typography 
              variant="h6" 
              sx={{ fontWeight: 600 , cursor: 'pointer'}}
              onClick={() => navigate ('/tutorhome')}
            >
              BK Tutor
            </Typography>
            <Typography
              component="a"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => navigate("/tutorhome")}
            >
              Trang chủ
            </Typography>
            <Typography
              component="a"
              href="/tutorcalendar"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
            >
              Lịch
            </Typography>
            <Typography
              component="a"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => navigate("/subjectlist")}
            >
              Tài liệu
            </Typography>
            <Typography
              component="a"
              onClick={() => navigate("/tutorclass")}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Lớp của tôi
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            <>
              <IconButton
                sx={{ color: 'white' }}
                onClick={handleNotifClick}
              >
                <NotificationsIcon />
              </IconButton>
              <Menu
                anchorEl={notifAnchor}
                open={Notiopen}
                onClose={handleNotifClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',   
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',   
                }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 300,        
                      maxHeight: 400,   
                      p: 2,              
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // text left, icons right
                    width: '100%',
                  }}
                >
                  <Typography>
                    Các thông báo
                  </Typography>
                  <Box 
                    sx={{ display: 'flex' }}>
                    <Button
                      sx={{
                        color: '#919090ff',
                        "&:hover": { opacity: 0.8 }
                      }}
                    >
                      <SettingsIcon/>
                    </Button>
                    <Button
                      sx={{
                        color: '#919090ff',
                        "&:hover": { opacity: 0.8 }
                      }}
                    >
                      <CheckIcon/>
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {loading ? (
                    <Typography sx={{ color: '#666' }}>Loading...</Typography>
                  ) : notifications.length === 0 ? (
                    <Typography sx={{ color: '#666' }}>No notifications</Typography>
                  ) : (
                    notifications.map((note) => (
                      <Box
                        key={note.id}
                        sx={{
                          p: 1,
                          borderBottom: '1px solid #eee',
                          fontSize: '0.9rem',
                          color: '#333',
                        }}
                      >
                        {note.message} — {note.date}
                      </Box>
                    ))
                  )}
                </Box>
              </Menu>
            </>
            <>
              <IconButton
                sx={{ 
                  color: 'white'
                }}
                onClick={handleMessageClick}
              >
                <MessageIcon/>
              </IconButton>
              <Menu
                anchorEl={messageAnchor}
                open={MessageOpen}
                onClose={handleMessageClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',   
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',   
                }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 300,        
                      maxHeight: 400,   
                      p: 2,              
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // text left, icons right
                    width: '100%',
                  }}
                >
                  <Typography>
                    Tin nhắn
                  </Typography>
                  <Box 
                    sx={{ display: 'flex' }}>
                    <Button
                      sx={{
                        color: '#919090ff',
                        "&:hover": { opacity: 0.8 }
                      }}
                    >
                      <SettingsIcon/>
                    </Button>
                    <Button
                      sx={{
                        color: '#919090ff',
                        "&:hover": { opacity: 0.8 }
                      }}
                    >
                      <CheckIcon/>
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderBottom: '1px solid #eee',
                      fontSize: '0.9rem',
                      color: '#333',
                    }}
                  >
                    {identity?.name || "Unknown"}
                  </Box>
                  {loading ? (
                    <Typography sx={{ color: '#666' }}>Loading...</Typography>
                  ) : Object.keys(groupedMessages).length === 0 ? (
                    <Typography sx={{ color: '#666' }}>No Messages</Typography>
                  ) : (
                    Object.entries(groupedMessages).map(([receiverId, msgs]) => (
                      <Box
                        key={receiverId}
                        sx={{
                          mb: 2,
                          border: '1px solid #ddd',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        {/* Header for each receiver */}
                        <Box sx={{ p: 1, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                          To {receiverId}
                        </Box>

                        {/* Messages inside that block */}
                        {msgs.map((note) => (
                          <Box
                            key={note.id}
                            sx={{
                              p: 1,
                              borderBottom: '1px solid #eee',
                              fontSize: '0.9rem',
                              color: '#333',
                            }}
                          >
                            {note.message} — {note.date}
                          </Box>
                        ))}
                      </Box>
                    ))
                  )}
                </Box>
              </Menu>
            </>

            <Typography
                alignContent="center"
                onClick={() => navigate("/userinfo")}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
            >
                {identity?.name || "Unknown"}
            </Typography>

            <Button
              role="button"
              sx={{ backgroundColor: 'white', color: '#0099ff', fontWeight: 600 }}
              onClick={handleLogout}
            >
              Logout
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