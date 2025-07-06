'use client';

import { useState, useEffect } from 'react'
import SearchFilters from '@/components/SearchFilters'
import JobCard from '@/components/JobCard'
import Pagination from '@/components/Pagination'
import CompactPagination from '@/components/CompactPagination'
import GoToTop from '@/components/GoToTop'
import { useJobs } from '@/lib/useJobs'
import { useSavedJobs } from '@/lib/useSavedJobs'
import { Search, MapPin, Building, Briefcase, Star, Heart } from 'lucide-react'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedRemoteTypes, setSelectedRemoteTypes] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { jobs, loading, error, totalJobs } = useJobs({
    search: searchTerm,
    categories: selectedCategories,
    sources: selectedSources,
    countries: selectedCountries,
    remoteTypes: selectedRemoteTypes,
    experienceLevels: selectedExperienceLevels,
    jobTypes: selectedJobTypes,
    skills: selectedSkills,
    sortBy,
    page: currentPage,
    limit: itemsPerPage
  })

  const { savedJobs, toggleSavedJob, isJobSaved } = useSavedJobs()

  const totalPages = Math.ceil((totalJobs || 0) / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
    setCurrentPage(1)
  }

  const handleSourceChange = (sources: string[]) => {
    setSelectedSources(sources)
    setCurrentPage(1)
  }

  const handleCountryChange = (countries: string[]) => {
    setSelectedCountries(countries)
    setCurrentPage(1)
  }

  const handleRemoteTypeChange = (remoteTypes: string[]) => {
    setSelectedRemoteTypes(remoteTypes)
    setCurrentPage(1)
  }

  const handleExperienceLevelChange = (levels: string[]) => {
    setSelectedExperienceLevels(levels)
    setCurrentPage(1)
  }

  const handleJobTypeChange = (jobTypes: string[]) => {
    setSelectedJobTypes(jobTypes)
    setCurrentPage(1)
  }

  const handleSkillChange = (skills: string[]) => {
    setSelectedSkills(skills)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: 'relevance' | 'date') => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Glassdoor-style Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SLVFX Jobs</h1>
                <p className="text-sm text-gray-600">Find your next opportunity</p>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-600 hover:text-gray-900">Jobs</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Companies</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Salaries</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Interviews</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Jobs</p>
                <p className="text-lg font-bold text-primary-600">{totalJobs || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Search Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Find your dream job</h2>
            <p className="text-primary-100">Search thousands of jobs from top companies</p>
          </div>
          
          {/* Glassdoor-style Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Quick Filters */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Job Type</h4>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedJobTypes.includes(type)}
                          onChange={() => handleJobTypeChange(
                            selectedJobTypes.includes(type) 
                              ? selectedJobTypes.filter(t => t !== type)
                              : [...selectedJobTypes, type]
                          )}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
                  <div className="space-y-2">
                    {['Junior', 'Mid-level', 'Senior'].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedExperienceLevels.includes(level)}
                          onChange={() => handleExperienceLevelChange(
                            selectedExperienceLevels.includes(level) 
                              ? selectedExperienceLevels.filter(l => l !== level)
                              : [...selectedExperienceLevels, level]
                          )}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Remote Type</h4>
                  <div className="space-y-2">
                    {['Remote', 'Hybrid', 'On-site'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRemoteTypes.includes(type)}
                          onChange={() => handleRemoteTypeChange(
                            selectedRemoteTypes.includes(type) 
                              ? selectedRemoteTypes.filter(t => t !== type)
                              : [...selectedRemoteTypes, type]
                          )}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Filters Button */}
              <button className="w-full mt-6 text-sm text-primary-600 hover:text-primary-700 font-medium">
                Show more filters
              </button>
            </div>
          </div>

          {/* Right Content - Job Listings */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {totalJobs || 0} jobs found
                </h3>
                <p className="text-sm text-gray-600">
                  {searchTerm && `for "${searchTerm}"`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as 'relevance' | 'date')}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Posted</option>
                </select>
              </div>
            </div>

            {/* Top Pagination */}
            {totalPages > 1 && (
              <div className="mb-6">
                <CompactPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalJobs || 0}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}

            {/* Jobs List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <div className="text-gray-400 mb-4">
                  <Search className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={isJobSaved(job.id)}
                    onToggleSaved={() => toggleSavedJob(job.id)}
                  />
                ))}
              </div>
            )}

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalJobs || 0}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <GoToTop />
    </div>
  )
} 