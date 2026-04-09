import { Container, Typography, TextField, Select, MenuItem, Grid, Card, CardContent, Box, AppBar, Toolbar, IconButton, Menu, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications'
import MessageIcon from '@mui/icons-material/Message'
import SettingsIcon from '@mui/icons-material/Settings'
import CheckIcon from '@mui/icons-material/Check'
import './HomePage.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Pagination from "@mui/material/Pagination";

export default function TutorClassPage(){
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
        break;
        default:
            navigate("/login");
        break;
    }
  }, [identity, navigate]);
    return (
        <Box sx={{width:'100vw', height:'100vh'}}>
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
                    onClick={()=>navigate("/tutorhome")}
                    >
                    Trang chủ
                    </Typography>
                    <Typography
                    component="a"
                    sx={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 500,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                    }}
                    onClick={() => navigate("/tutorcalendar")}
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
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: '#181b4e', // darker background
                            borderRadius: 1,
                            px: 2,
                            py: 0.5,
                        }}
                    >
                        <Typography
                        sx={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                        >
                        Lớp của tôi
                        </Typography>
                    </Box>
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
            <Box sx={{ pt: 8, position: 'relative', zIndex: 2 }}>
                <CourseDashboard/>
            </Box>
        </Box>
    )   
}
    const CourseDashboard = () => {
        const [sessions, setSessions] = useState([]);
        const [search, setSearch] = useState("");
        const [selectedDate, setSelectedDate] = useState(null);
        const [appliedSearch, setAppliedSearch] = useState("");
        const [appliedDate, setAppliedDate] = useState(null);
        const [page, setPage] = useState(1);
        const pageSize = 8;

        // Fetch courses when page loads
        useEffect(() => {
            const fetchSessions = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/fetch-sessions", {
                    method: "GET",
                    credentials: "include"            
                })
                const data = await res.json();
                setSessions(data); 
                console.log(data)
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
            };

            fetchSessions();
        }, []);

        const handleSearchClick = () => {
        setAppliedSearch(search);
        setAppliedDate(selectedDate);
        };

        const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
        };

        const HandleDeleteSession = async (sessionid) => {
            try {
                const res = await fetch(`http://localhost:8080/api/delete-session/${sessionid}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                const message = await res.json()
                if (message.success){
                    // remove from local state
                    setSessions(prev => prev.filter(s => s.sessionid !== sessionid));
                }
                else{
                    console.log(message.ErrorCode)
                }
            } catch (err) {
                console.error("Error deleting session:", err);
            }
        };

        const filteredSessions = sessions.filter(session => {
        const searchLower = appliedSearch.toLowerCase();

        const matchesText =
            session.title.toLowerCase().includes(searchLower) ||
            session.room.toLowerCase().includes(searchLower);

        const matchesDate = !appliedDate ||
            session.timestart.split("T")[0] === appliedDate;

        return matchesText && matchesDate;
        });

        const paginatedSessions = filteredSessions.slice(
        (page - 1) * pageSize,
        page * pageSize
        );

    return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Lớp của tôi</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Title"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Ngày học"
              value={selectedDate ? new Date(selectedDate) : null}
              onChange={(newValue) => {
                if (newValue) {
                  const formatted = newValue.toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
                  setSelectedDate(formatted);
                } else {
                  setSelectedDate(null);
                }
              }}
              format="dd/MM/yyyy"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearchClick}   // 👈 triggers filter on click
            >
            Tìm Kiếm
            </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {paginatedSessions.map(session => {
          const start = new Date(session.timestart);
          const end = new Date(session.timeend);

          const dateStr = start.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
          const startTime = start.toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" });
          const endTime = end.toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" });

          return (
            <Grid item xs={12} sm={6} md={4} key={session.sessionid}>
            <Card sx={{ bgcolor: "#f5f5f5" }}>
                <CardContent>
                {/* Title already styled */}
                <Typography 
                    variant="h6" 
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 1, cursor:'pointer', '&:hover': { opacity: 0.8 } }}
                    onClick={() => navigate("/tutorclass")}
                >
                    {session.title}
                </Typography>

                {/* Bold headers */}
                <Typography variant="body2">
                    <span style={{ fontWeight: "bold" }}>Phòng:</span> {session.room}
                </Typography>
                <Typography variant="body2">
                    <span style={{ fontWeight: "bold" }}>Số lượng đăng ký:</span> {session.joined} / {session.capacity}
                </Typography>
                <Typography variant="body2">
                    <span style={{ fontWeight: "bold" }}>Ngày:</span> {dateStr}
                </Typography>
                <Typography variant="body2">
                    <span style={{ fontWeight: "bold" }}>Thời gian:</span> {startTime} – {endTime}
                </Typography>
                </CardContent>
                <Button
                    onClick={() => HandleDeleteSession(session.sessionid)}
                >
                    Xoá buổi gặp
                </Button>
            </Card>
            </Grid>
          );
        })}
      </Grid>
      <Pagination
        count={Math.ceil(filteredSessions.length / pageSize)}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        />
    </Container>
  );
};
