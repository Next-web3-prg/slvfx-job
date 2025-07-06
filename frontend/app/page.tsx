'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Building, Clock, Briefcase, ArrowUpDown } from 'lucide-react';
import JobCard from '@/components/JobCard';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';
import CompactPagination from '@/components/CompactPagination';
import GoToTop from '@/components/GoToTop';
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
    limit: 20,
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');

  const { jobs, pagination, loading, error } = useJobs({ ...searchParams, sort: sortBy });

  const handleSearch = (newParams: any) => {
    setSearchParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setSearchParams(prev => ({ ...prev, limit, page: 1 }));
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
              
              <div className="flex items-center space-x-4">
                {/* Sort Button */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown size={16} className="text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date')}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="date">Sort by Date</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter size={16} />
                  <span>Filters applied</span>
                </div>
              </div>
            </div>

            {/* Top Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mb-6">
                <CompactPagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total_items}
                  itemsPerPage={pagination.items_per_page}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}

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
                  onClick={() => setSearchParams({
                    search: '',
                    location: '',
                    remote_type: '',
                    job_type: '',
                    experience_level: '',
                    tags: '',
                    company: '',
                    page: 1,
                    limit: 20
                  })}
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

            {/* Bottom Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total_items}
                  itemsPerPage={pagination.items_per_page}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Go to Top Button */}
      <GoToTop />
    </div>
  );
} 