import axios from 'axios';
import { response } from 'express';

const supabaseUrl = 'https://byptkdhuohdejphanekq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cHRrZGh1b2hkZWpwaGFuZWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDAzOTMsImV4cCI6MjA2MDM3NjM5M30.cclffzShuqafqNVfZomXMfIS_uesDJRu9oT9luhDh5c';

const getAllTasks = async () => {
  try {
    await axios.get(`${supabaseUrl}/rest/v1/tasks`, {
      headers: {
        apiKey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      params: {
        select: '*',
      },
    });
    console.log('Tasks: ', response.data);
  } catch (error) {
    console.error('Error fetching tasks: ', error.message);
  }
};

getAllTasks();
