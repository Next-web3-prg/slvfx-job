'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Building, Clock, Briefcase } from 'lucide-react';
import JobCard from '@/components/JobCard';
import SearchFilters from '@/components/SearchFilters';
import { useJobs } from '@/hooks/useJobs';

export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    search: '',
    location: '',
    remote_type: '',
    job_type: '',
    experience_level: '',
    tags: '',
    company: '',
    page: 1,
  });

  const { jobs, pagination, loading, error } = useJobs(searchParams);

  const handleSearch = (newParams: any) => {
    setSearchParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Next
              <span className="block text-primary-200">Remote Job</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Aggregated job listings from top remote job boards
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  className="w-full pl-10 pr-4 py-4 text-lg rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  value={searchParams.search}
                  onChange={(e) => handleSearch({ search: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={searchParams}
              onFiltersChange={handleSearch}
            />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading jobs...' : `${pagination?.total_items || 0} jobs found`}
                </h2>
                {searchParams.search && (
                  <p className="text-gray-600 mt-1">
                    Showing results for "{searchParams.search}"
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter size={16} />
                <span>Filters applied</span>
              </div>
            </div>

            {/* Job Cards */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : jobs?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => setSearchParams({ page: 1 })}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs?.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_prev_page}
                    className="btn btn-outline btn-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {pagination.current_page} of {pagination.total_pages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.has_next_page}
                    className="btn btn-outline btn-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 