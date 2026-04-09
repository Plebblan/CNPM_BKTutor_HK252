import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'
import MessageIcon from '@mui/icons-material/Message'
import SettingsIcon from '@mui/icons-material/Settings'
import CheckIcon from '@mui/icons-material/Check'
import '../pages/HomePage.css';
import { useState, useEffect } from 'react';



function NavigationBar() {
    // KHAI BÁO CẦN THIẾT
    const navigate = useNavigate();

    // 1. State cho Thông báo (Notifications)
    const [notifAnchor, setNotifAnchor] = useState(null);
    const Notiopen = Boolean(notifAnchor);
    // State để lưu trữ dữ liệu thông báo thực tế (sẽ được fetch từ API)
    const [notifications, setNotifications] = useState([]); 
    
    // 2. State cho Tin nhắn (Messages)
    const [messages, setMessages] = useState([])
    const [messageAnchor, setMessageAnchor] = useState(null);
    const MessageOpen = Boolean(messageAnchor);
    // State để lưu trữ dữ liệu tin nhắn đã nhóm thực tế 

    // 3. State cho Trạng thái tải (Loading) - Đặt là true ban đầu nếu cần fetch data
    const [loading, setLoading] = useState(false); // Đặt false nếu dữ liệu được truyền từ prop hoặc fetch bên ngoài

    const [identity, setIdentity] = useState(null);

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
    // HANDLERS (Xử lý sự kiện)

    // Xử lý Đăng xuất
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
    
    // Hàm chuyển hướng chung cho logo/title
    const goToHome = () => {
        navigate('/studenthome');
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
    return (
        <AppBar className="header-nav">
        <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            
            {/* Logo và Tên Ứng dụng */}
            <img 
                src="/bk-logo.png" 
                alt="BK Logo" 
                style={{ width: 50, height: 50, cursor: 'pointer' }} 
                onClick={goToHome} 
            />
            <Typography 
                variant="h6" 
                sx={{ fontWeight: 600 , cursor: 'pointer'}}
                onClick={goToHome}
            >
                BK Tutor
            </Typography>

            {/* Các liên kết điều hướng - ĐÃ CHUYỂN TỪ HREF SANG ONCLICK VỚI NAVIGATE */}
            
            <Typography
                component="a" // Giữ component="a" để đảm bảo ngữ nghĩa và styling là link
                // href="#" // Bỏ href
                onClick={() => navigate('/studenthome')} // SỬ DỤNG navigate()
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
            <Typography
                component="a"
                // href="/calendar" // Bỏ href
                onClick={() => navigate('/calendar')} // SỬ DỤNG navigate()
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
                // href="/subjectlist" // Bỏ href
                onClick={() => navigate('/subjectlist')} // SỬ DỤNG navigate()
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
                // href="/DashboardRegisterClass" // Bỏ href
                onClick={() => navigate('/DashboardRegisterClass')} // SỬ DỤNG navigate()
                sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                }}
            >
                Đăng ký lớp học
            </Typography>
            </Box>

            {/* Khu vực Biểu tượng và Người dùng */}
            <Box sx={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            
            {/* 1. Notifications Menu */}
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                    sx: { width: 300, maxHeight: 400, p: 2, },
                    },
                }}
                >
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1 }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                    Các thông báo
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                    <IconButton size="small" sx={{ color: '#919090ff' }}>
                        <SettingsIcon fontSize="small"/>
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#919090ff' }}>
                        <CheckIcon fontSize="small"/>
                    </IconButton>
                    </Box>
                </Box>
                <Divider sx={{ mb: 1 }}/>
                <Box sx={{ mt: 1 }}>
                    {loading ? (
                    <Typography sx={{ color: '#666' }}>Loading...</Typography>
                    ) : notifications.length === 0 ? (
                    <Typography sx={{ color: '#666' }}>Không có thông báo mới.</Typography>
                    ) : (
                    notifications.map((note) => (
                        <MenuItem
                        key={note.id}
                        onClick={handleNotifClose}
                        sx={{
                            p: 1,
                            borderBottom: '1px solid #eee',
                            fontSize: '0.9rem',
                            color: '#333',
                            display: 'block', // Cho phép hiển thị nội dung dài
                            whiteSpace: 'normal' // Tự động xuống dòng
                        }}
                        >
                        {note.message} — <Typography variant="caption" display="block">{note.date}</Typography>
                        </MenuItem>
                    ))
                    )}
                </Box>
                </Menu>
            </>

            {/* 2. Messages Menu */}
            <>
                <IconButton
                sx={{ color: 'white' }}
                onClick={handleMessageClick}
                >
                <MessageIcon/>
                </IconButton>
                <Menu
                anchorEl={messageAnchor}
                open={MessageOpen}
                onClose={handleMessageClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                    sx: { width: 300, maxHeight: 400, p: 2, },
                    },
                }}
                >
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1 }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                    Tin nhắn
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                    <IconButton size="small" sx={{ color: '#919090ff' }}>
                        <SettingsIcon fontSize="small"/>
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#919090ff' }}>
                        <CheckIcon fontSize="small"/>
                    </IconButton>
                    </Box>
                </Box>
                <Divider sx={{ mb: 1 }}/>
                
                {/* Thông tin Người dùng hiện tại (hoặc có thể là nút đi đến trang tin nhắn) */}
                <Box sx={{ p: 1, borderBottom: '1px solid #ddd', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">
                        {identity?.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        (Click để xem chi tiết tin nhắn)
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {loading ? (
                    <Typography sx={{ color: '#666' }}>Loading...</Typography>
                    ) : Object.keys(groupedMessages).length === 0 ? (
                    <Typography sx={{ color: '#666' }}>Không có tin nhắn mới.</Typography>
                    ) : (
                    Object.entries(groupedMessages).map(([receiverId, msgs]) => (
                        <Box
                        key={receiverId}
                        sx={{
                            mb: 1,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                        }}
                        onClick={handleMessageClose} // Giả định click vào đây sẽ chuyển hướng đến cuộc trò chuyện
                        >
                        {/* Header cho mỗi người đối thoại */}
                        <Box sx={{ p: 1, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                            {/* receiverId nên là tên/ID người đối thoại */}
                            Trò chuyện với: {receiverId} 
                        </Box>

                        {/* Chỉ hiển thị tin nhắn gần nhất hoặc vài tin mới nhất */}
                        <Box sx={{ p: 1, fontSize: '0.9rem', color: '#333' }}>
                            {/* Hiển thị tin nhắn cuối cùng trong nhóm */}
                            Tin nhắn gần nhất: {msgs[msgs.length - 1].message}
                            <Typography variant="caption" display="block" align="right">
                                {msgs[msgs.length - 1].date}
                            </Typography>
                        </Box>
                        </Box>
                    ))
                    )}
                </Box>
                </Menu>
            </>

            {/* 3. Tên người dùng và nút Logout */}
            <Typography
                alignContent="center"
                sx={{ fontWeight: 500 }}
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
    );
}
export default NavigationBar;