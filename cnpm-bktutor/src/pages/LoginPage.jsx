import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Stack
} from '@mui/material';

import { useState, useEffect } from 'react';

import LanguageIcon from '@mui/icons-material/Language'

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(null)
  const [loading, setLoading] = useState(false)

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
    <Box
      // ... (Phần style container giữ nguyên) ...
    >
      <Paper elevation={3} sx={{
          p: 4, 
          width: '40%',
          mx: 'auto'
        }}>
        {/* ... (Phần logo và tiêu đề giữ nguyên) ... */}
        
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          BKTutor Login (SSO)
        </Typography>

            <Box sx={{
              backgroundColor: '#f69898ff', 
              borderRadius: 2, 
              height: 40, 
              color: '#582020ff', 
              alignItems: "center", 
              textAlign: "center",
              justifyContent: "center",
              display: "flex"
            }}>
              Your session has timed out. Please log in again.
            </Box>
            
            <Box sx={{width:'100%', my: 2}}>
              <Divider sx={{ borderBottomWidth: 1, borderColor: '#919090ff' }}/>
            </Box>
            <Typography sx= {{color: '#919090ff'}}>
              Login using your account on:
            </Typography>
            <Stack sx={{width:'100%'}}>
              <Button
                variant="outlined"
                sx = {{borderColor: '#919090ff', color: '#919090ff'}}
                fullWidth
                onClick={() => window.location.href="http://localhost:8000/sso/login?service=http://localhost:5173/login"}
              >
                <img
                  src="/bk-logo.png"
                  alt="BK Logo"
                  style={{ width: 20, height: 20 }}
                />
                HCMUT Account
              </Button>
              <Button
                variant="outlined"
                sx = {{borderColor: '#919090ff', color: '#919090ff'}}
                fullWidth
                onClick={() => window.location.href="http://localhost:8000/admin"}
              >
                Admin
              </Button>
            </Stack>

            <Box sx={{width:'100%', my: 2}}>
              <Divider sx={{ borderBottomWidth: 1, borderColor: '#919090ff' }}/>
            </Box>

            <Button
              sx = {{borderColor: '#919090ff'}}
              variant='outlined'
              startIcon={<LanguageIcon/>}
            >
              Language
            </Button>
        </Paper>
      </Box>
  );
}