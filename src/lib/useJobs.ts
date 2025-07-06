'use client'

import { useState, useEffect } from 'react'

interface Job {
  id: number
  title: string
  company: string
  location: string
  description: string
  url: string
  posted_at: string
  source: string
  category: string
  salary_range?: string
  job_type?: string
  experience_level?: string
}

interface JobFilters {
  search?: string
  categories?: string[]
  sources?: string[]
  countries?: string[]
  remoteTypes?: string[]
  experienceLevels?: string[]
  jobTypes?: string[]
  skills?: string[]
  sortBy?: 'relevance' | 'date'
  page?: number
  limit?: number
}

interface UseJobsReturn {
  jobs: Job[]
  loading: boolean
  error: string | null
  totalJobs: number
}

export function useJobs(filters: JobFilters): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalJobs, setTotalJobs] = useState(0)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        
        if (filters.search) params.append('search', filters.search)
        if (filters.categories?.length) params.append('categories', filters.categories.join(','))
        if (filters.sources?.length) params.append('sources', filters.sources.join(','))
        if (filters.countries?.length) params.append('countries', filters.countries.join(','))
        if (filters.remoteTypes?.length) params.append('remoteTypes', filters.remoteTypes.join(','))
        if (filters.experienceLevels?.length) params.append('experienceLevels', filters.experienceLevels.join(','))
        if (filters.jobTypes?.length) params.append('jobTypes', filters.jobTypes.join(','))
        if (filters.skills?.length) params.append('skills', filters.skills.join(','))
        if (filters.sortBy) params.append('sort_by', filters.sortBy)
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.limit) params.append('limit', filters.limit.toString())

        const response = await fetch(`/api/jobs?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setJobs(data.jobs || [])
        setTotalJobs(data.total || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
        setJobs([])
        setTotalJobs(0)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [
    filters.search, 
    filters.categories, 
    filters.sources, 
    filters.countries,
    filters.remoteTypes,
    filters.experienceLevels,
    filters.jobTypes,
    filters.skills,
    filters.sortBy, 
    filters.page, 
    filters.limit
  ])

  return { jobs, loading, error, totalJobs }
} 