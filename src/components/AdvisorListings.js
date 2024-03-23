import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid } from '@mui/material';

import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';

const AdvisorListings = () => {
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get('https://run.mocky.io/v3/76a408e8-083a-4541-b292-af95fc22a66b');
        setAdvisors(response.data.data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      }
    };

    fetchAdvisors();
  }, []);

  const fetchAvailability = async (advisorId) => {
    try {
      const response = await axios.get(`https://run.mocky.io/v3/fccbbe76-83f9-44d0-a526-1e83e0b592a9?advisorId=${advisorId}`);
      // Update availability for advisor with advisorId
      setAdvisors(prevAdvisors => {
        return prevAdvisors.map(advisor => {
          if (advisor.id === advisorId) {
            return { ...advisor, callAvailable: response.data.callAvailable, chatAvailable: response.data.chatAvailable };
          }
          return advisor;
        });
      });
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      advisors.forEach(advisor => {
        fetchAvailability(advisor.id);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [advisors]);

  const handleCallButtonClick = (advisorId) => {
    // Handle call button click
    console.log('Call button clicked for advisor:', advisorId);
  };

  const handleChatButtonClick = (advisorId) => {
    // Handle chat button click
    console.log('Chat button clicked for advisor:', advisorId);
  };

  return (
    <Grid container spacing={2}>
      {advisors.map(advisor => (
        <Grid item xs={12} key={advisor.id}>
          <div className='tile' style={{display: 'flex'}}>
              <div style={{display: 'flex'}}>
                <img src={advisor.profilePictureUrl} alt={advisor.title} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <span className='title'>{advisor.title}</span>
              </div>
              <div>
                <div className='price'>${advisor.pricePerMinute}/<span style={{fontSize:'12px'}}>min</span></div>
                <Button
                  
                    variant="contained"
                    color="primary"
                    disabled={(advisor['call-availability'] !== 'online')}
                    onClick={() => handleCallButtonClick(advisor.id)}
                    >
                    <CallIcon className='icons'/>
                    {(advisor['call-availability'] === 'online') ? 'CALL NOW' : 'CALL LATER'}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={advisor['chat-availability'] !== 'online'}
                    onClick={() => handleChatButtonClick(advisor.id)}
                    >
                    <ChatIcon className='icons'/>
                    {(advisor['chat-availability'] === 'online') ? 'CHAT NOW' : 'CHAT LATER'}
                </Button>
                
              </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdvisorListings;