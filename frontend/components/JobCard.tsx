'use client';

import React from 'react';
import { MapPin, Building, Clock, Briefcase, ExternalLink, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedJobs } from '@/hooks/useSavedJobs';

// Helper function to strip HTML tags
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

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

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { user } = useAuth();
  const { isSaved, toggleSaved } = useSavedJobs(job.id);

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    
    const currency = job.salary_currency || 'USD';
    const symbol = currency === 'USD' ? '$' : currency;
    
    if (job.salary_min && job.salary_max) {
      return `${symbol}${job.salary_min.toLocaleString()} - ${symbol}${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `${symbol}${job.salary_min.toLocaleString()}+`;
    } else if (job.salary_max) {
      return `Up to ${symbol}${job.salary_max.toLocaleString()}`;
    }
    
    return null;
  };

  const getExperienceColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'senior':
      case 'lead':
        return 'badge-error';
      case 'mid':
        return 'badge-warning';
      case 'junior':
      case 'entry':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'full-time':
        return 'badge-primary';
      case 'part-time':
        return 'badge-warning';
      case 'contract':
        return 'badge-error';
      case 'freelance':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="card p-6 hover:shadow-medium transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {job.title}
            </h3>
            {user && (
              <button
                onClick={() => toggleSaved()}
                className={`p-1 rounded-full transition-colors ${
                  isSaved 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Building size={14} />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.remote_type === 'remote' ? 'Remote' : job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {formatSalary() && (
            <div className="text-sm font-medium text-green-600">
              {formatSalary()}
            </div>
          )}
          <div className="text-xs text-gray-500">
            via {job.source_name}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${getJobTypeColor(job.job_type)}`}>
          {job.job_type}
        </span>
        <span className={`badge ${getExperienceColor(job.experience_level)}`}>
          {job.experience_level}
        </span>
        {job.tags?.slice(0, 3).map((tag, index) => (
          <span key={index} className="badge badge-secondary">
            {tag}
          </span>
        ))}
        {job.tags?.length > 3 && (
          <span className="badge badge-secondary">
            +{job.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description ? (
          <>
            {stripHtml(job.description).substring(0, 200)}
            {stripHtml(job.description).length > 200 && '...'}
          </>
        ) : (
          'No description available'
        )}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <ExternalLink size={14} />
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
} 