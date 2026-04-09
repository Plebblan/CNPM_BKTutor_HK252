//npm install @mui/x-date-pickers date-fns
//npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);

  // form fields
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
      console.log(data)
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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/events', {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      const formatted = data.map(ev => ({
        id: ev.id,
        title: `${ev.title}`,
        start: ev.timestart,
        end: ev.timeend,
        room: ev.room,
        tutor: ev.tutor
      }));

      setEvents(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
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

  const handleCreateEvent = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setRoom('');
    setStart(new Date());
    setEnd(new Date());
  };

  const handleSave = async () => {
    const newEvent = {
      title: `${title}`,
      start,
      end,
      userid: identity?.selfid || "unknown",
      room: room,
      status: "pending",
      tutorid: identity?.selfid || "unknown"
    };

    try {
      // POST to Flask backend
      const res = await fetch("http://localhost:8080/api/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const result = await res.json();

      if (result.success === false){
        if (result.ErrorCode === "1"){
          alert("Thời gian buổi học không hợp lệ!");
        }
        else if (result.ErrorCode === "2"){
          alert("Phòng học bận")
        }
        else if (result.ErrorCode === "3"){
          alert("Không có phòng này hoặc không có quyền sử dụng phòng này")
        }
      } else {
        handleClose();
      }
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleEventClick = (info) => {
    // info.event contains the clicked event
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      room: info.event.extendedProps.room,
      tutor: info.event.extendedProps.tutor
    });
    setDetailsOpen(true);
  };

  useEffect(() => {
    const run = async () => {
      await fetchidentity();
    };
    run();
  }, []);

  //fetch events on page loads
  useEffect(() => {
    const loadEvents = async () => {
      await fetchEvents();
    };
    loadEvents();
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
    <Box className="home-page" sx={{display: 'flex', width:'100vw', height:'100vh'}}>
      {/* Header Navigation */}
      <AppBar className="header-nav">
        <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
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
            </Box>
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
                  fontWeight: 600,
                }}
              >
                Lịch
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
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
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography
                component="a"
                sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 },
                }}
                onClick={() => navigate("/tutorclass")}
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
      <Container maxWidth="lg" sx={{ mt: 10 }} height='100vh'>
        <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleCreateEvent}
            >
            Tạo buổi học
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                label="Tên buổi gặp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                />
                <TextField
                label="Phòng học"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                fullWidth
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Giờ bắt đầu"
                    value={start}
                    onChange={(newValue) => setStart(newValue)}
                />
                <DateTimePicker
                    label="Giờ kết thúc"
                    value={end}
                    onChange={(newValue) => setEnd(newValue)}
                />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={!identity}>
                Save
                </Button>
            </DialogActions>
        </Dialog>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            editable={false}
            selectable={false}
            eventClick={(info) => handleEventClick(info)}
            height={600}
        />
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedEvent && (
              <>
                <Typography><strong>Title:</strong> {selectedEvent.title}</Typography>
                <Typography><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</Typography>
                <Typography><strong>End:</strong> {selectedEvent.end?.toLocaleString()}</Typography>
                <Typography><strong>Room:</strong> {selectedEvent.room}</Typography>
                <Typography><strong>Tutor:</strong> {selectedEvent.tutor}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}