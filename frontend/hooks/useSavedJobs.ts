import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export function useSavedJobs(jobId: string) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, jobId]);

  const checkIfSaved = async () => {
    try {
      const response = await axios.get(`/api/users/saved-jobs?job_id=${jobId}`);
      setIsSaved(response.data.saved_jobs.some((job: any) => job.id === jobId));
    } catch (error) {
      // Job is not saved
      setIsSaved(false);
    }
  };

  const toggleSaved = async () => {
    if (!user) {
      toast.error('Please log in to save jobs');
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await axios.delete(`/api/users/saved-jobs/${jobId}`);
        setIsSaved(false);
        toast.success('Job removed from saved list');
      } else {
        await axios.post('/api/users/saved-jobs', { job_id: jobId });
        setIsSaved(true);
        toast.success('Job saved to your list');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update saved job');
    } finally {
      setLoading(false);
    }
  };

  return {
    isSaved,
    loading,
    toggleSaved,
  };
} 