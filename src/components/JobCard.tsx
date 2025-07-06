'use client';

import React from 'react';
import { MapPin, Building, Clock, Briefcase, ExternalLink, Heart, Star, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Helper function to strip HTML tags
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_at: string;
  source: string;
  category: string;
  salary_range?: string;
  job_type?: string;
  experience_level?: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSaved?: () => void;
}

export default function JobCard({ job, isSaved = false, onToggleSaved }: JobCardProps) {
  const formatSalary = () => {
    if (!job.salary_range) return null;
    return job.salary_range;
  };

  const getExperienceColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-700';
    
    switch (level.toLowerCase()) {
      case 'senior':
      case 'lead':
        return 'bg-red-100 text-red-700';
      case 'mid':
        return 'bg-yellow-100 text-yellow-700';
      case 'junior':
      case 'entry':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getJobTypeColor = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-700';
    
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-700';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-700';
      case 'contract':
        return 'bg-red-100 text-red-700';
      case 'freelance':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Mock company rating (in real app, this would come from database)
  const companyRating = 4.2;
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Job Title and Save Button */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                {job.title}
              </h3>
              <div className="flex items-center mt-1">
                <Building size={16} className="text-gray-400 mr-1" />
                <span className="text-gray-700 font-medium">{job.company}</span>
                <div className="flex items-center ml-3">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{companyRating}</span>
                  <span className="text-xs text-gray-500 ml-1">({reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            {onToggleSaved && (
              <button
                onClick={onToggleSaved}
                className={`p-2 rounded-full transition-colors ${
                  isSaved 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          {/* Location and Posted Time */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin size={14} className="mr-1" />
            <span>{job.location}</span>
            <span className="mx-2">•</span>
            <Clock size={14} className="mr-1" />
            <span>{formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}</span>
          </div>

          {/* Salary and Tags */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {formatSalary() && (
                <div className="flex items-center text-green-600 font-medium">
                  <DollarSign size={14} className="mr-1" />
                  {formatSalary()}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {job.job_type && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobTypeColor(job.job_type)}`}>
                  {job.job_type}
                </span>
              )}
              {job.experience_level && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExperienceColor(job.experience_level)}`}>
                  {job.experience_level}
                </span>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Briefcase size={14} className="mr-1" />
              <span>via {job.source}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {job.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <button className="hover:text-primary-600 transition-colors">
            Save job
          </button>
          <button className="hover:text-primary-600 transition-colors">
            Share
          </button>
          <button className="hover:text-primary-600 transition-colors">
            Report job
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
            View company profile
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            <ExternalLink size={14} />
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
} 