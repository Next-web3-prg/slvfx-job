'use client';

import React, { useState } from 'react';
import { Filter, X, MapPin, Building, Briefcase, Clock } from 'lucide-react';

interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      remote_type: '',
      job_type: '',
      experience_level: '',
      tags: '',
      company: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <div className="lg:block">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="badge badge-primary ml-2">
              {Object.values(filters).filter(v => v && v !== '').length}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={14} className="inline mr-1" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Remote, New York, London"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input"
              />
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building size={14} className="inline mr-1" />
                Company
              </label>
              <input
                type="text"
                placeholder="e.g., Google, Microsoft"
                value={filters.company || ''}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="input"
              />
            </div>

            {/* Remote Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remote Type
              </label>
              <select
                value={filters.remote_type || ''}
                onChange={(e) => handleFilterChange('remote_type', e.target.value)}
                className="input"
              >
                <option value="">All types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={14} className="inline mr-1" />
                Job Type
              </label>
              <select
                value={filters.job_type || ''}
                onChange={(e) => handleFilterChange('job_type', e.target.value)}
                className="input"
              >
                <option value="">All types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={filters.experience_level || ''}
                onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                className="input"
              >
                <option value="">All levels</option>
                <option value="entry">Entry</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills/Tags
              </label>
              <input
                type="text"
                placeholder="e.g., React, Python, AWS"
                value={filters.tags || ''}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (value && value !== '') {
                    return (
                      <span
                        key={key}
                        className="badge badge-secondary flex items-center gap-1"
                      >
                        {key}: {value}
                        <button
                          onClick={() => handleFilterChange(key, '')}
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 