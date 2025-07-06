'use client'

import { useState, useEffect } from 'react'

interface UseSavedJobsReturn {
  savedJobs: number[]
  toggleSavedJob: (jobId: number) => Promise<void>
  isJobSaved: (jobId: number) => boolean
  loading: boolean
}

export function useSavedJobs(): UseSavedJobsReturn {
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/users/saved-jobs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setSavedJobs(data.saved_jobs || [])
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedJobs()
  }, [])

  const toggleSavedJob = async (jobId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Redirect to login or show login modal
        return
      }

      const response = await fetch('/api/users/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: jobId })
      })

      if (response.ok) {
        setSavedJobs(prev => {
          if (prev.includes(jobId)) {
            return prev.filter(id => id !== jobId)
          } else {
            return [...prev, jobId]
          }
        })
      }
    } catch (error) {
      console.error('Error toggling saved job:', error)
    }
  }

  const isJobSaved = (jobId: number): boolean => {
    return savedJobs.includes(jobId)
  }

  return { savedJobs, toggleSavedJob, isJobSaved, loading }
} 