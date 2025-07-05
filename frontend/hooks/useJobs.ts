import useSWR from 'swr';
import axios from 'axios';

interface JobFilters {
  search?: string;
  location?: string;
  remote_type?: string;
  job_type?: string;
  experience_level?: string;
  tags?: string;
  company?: string;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'date';
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
  apply_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  job_type: string;
  remote_type: string;
  experience_level: string;
  posted_at: string;
  source_name: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useJobs(filters: JobFilters) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      params.append(key, value.toString());
    }
  });

  const { data, error, isLoading } = useSWR<JobsResponse>(
    `/api/jobs?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    jobs: data?.jobs || [],
    pagination: data?.pagination,
    loading: isLoading,
    error: error?.message || null,
  };
} 