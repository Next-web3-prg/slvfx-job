"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  MapPin,
  Building,
  Briefcase,
  Clock,
  ArrowUpDown,
  Globe,
  Monitor,
  Users,
  Code,
} from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedSources: string[];
  onSourceChange: (sources: string[]) => void;
  selectedCountries: string[];
  onCountryChange: (countries: string[]) => void;
  selectedRemoteTypes: string[];
  onRemoteTypeChange: (remoteTypes: string[]) => void;
  selectedExperienceLevels: string[];
  onExperienceLevelChange: (levels: string[]) => void;
  selectedJobTypes: string[];
  onJobTypeChange: (jobTypes: string[]) => void;
  selectedSkills: string[];
  onSkillChange: (skills: string[]) => void;
  sortBy: "relevance" | "date";
  onSortChange: (sort: "relevance" | "date") => void;
}

const categories = [
  "Software Development", 
  "Full Stack Development", 
  "Frontend Development", 
  "Backend Development", 
  "Design", 
  "Data Science", 
  "DevOps",
  "Mobile Development",
  "Game Development",
  "AI/ML Engineering"
];

const sources = ["RemoteOK", "WeWorkRemotely", "RemoteYeah"];

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France", 
  "Netherlands", "Spain", "Italy", "Sweden", "Norway", "Denmark", 
  "Switzerland", "Australia", "New Zealand", "Japan", "Singapore",
  "Remote", "Worldwide"
];

const remoteTypes = ["Remote", "Hybrid", "On-site"];

const experienceLevels = ["Junior", "Mid-level", "Senior", "Lead", "Principal"];

const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

const skills = [
  "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C#", 
  "TypeScript", "JavaScript", "PHP", "Ruby", "Go", "Rust", "Swift", 
  "Kotlin", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "MongoDB", 
  "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API", "Machine Learning",
  "TensorFlow", "PyTorch", "Unity", "Unreal Engine", "Figma", "Adobe XD"
];

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedSources,
  onSourceChange,
  selectedCountries,
  onCountryChange,
  selectedRemoteTypes,
  onRemoteTypeChange,
  selectedExperienceLevels,
  onExperienceLevelChange,
  selectedJobTypes,
  onJobTypeChange,
  selectedSkills,
  onSkillChange,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('categories');

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleSourceToggle = (source: string) => {
    if (selectedSources.includes(source)) {
      onSourceChange(selectedSources.filter((s) => s !== source));
    } else {
      onSourceChange([...selectedSources, source]);
    }
  };

  const handleCountryToggle = (country: string) => {
    if (selectedCountries.includes(country)) {
      onCountryChange(selectedCountries.filter((c) => c !== country));
    } else {
      onCountryChange([...selectedCountries, country]);
    }
  };

  const handleRemoteTypeToggle = (remoteType: string) => {
    if (selectedRemoteTypes.includes(remoteType)) {
      onRemoteTypeChange(selectedRemoteTypes.filter((r) => r !== remoteType));
    } else {
      onRemoteTypeChange([...selectedRemoteTypes, remoteType]);
    }
  };

  const handleExperienceLevelToggle = (level: string) => {
    if (selectedExperienceLevels.includes(level)) {
      onExperienceLevelChange(selectedExperienceLevels.filter((l) => l !== level));
    } else {
      onExperienceLevelChange([...selectedExperienceLevels, level]);
    }
  };

  const handleJobTypeToggle = (jobType: string) => {
    if (selectedJobTypes.includes(jobType)) {
      onJobTypeChange(selectedJobTypes.filter((j) => j !== jobType));
    } else {
      onJobTypeChange([...selectedJobTypes, jobType]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onSkillChange([...selectedSkills, skill]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onCategoryChange([]);
    onSourceChange([]);
    onCountryChange([]);
    onRemoteTypeChange([]);
    onExperienceLevelChange([]);
    onJobTypeChange([]);
    onSkillChange([]);
    onSortChange("relevance");
  };

  const hasActiveFilters =
    searchTerm || 
    selectedCategories.length > 0 || 
    selectedSources.length > 0 ||
    selectedCountries.length > 0 ||
    selectedRemoteTypes.length > 0 ||
    selectedExperienceLevels.length > 0 ||
    selectedJobTypes.length > 0 ||
    selectedSkills.length > 0;

  const filterTabs = [
    { id: 'categories', label: 'Categories', icon: Briefcase, count: selectedCategories.length },
    { id: 'sources', label: 'Sources', icon: Building, count: selectedSources.length },
    { id: 'location', label: 'Location', icon: MapPin, count: selectedCountries.length },
    { id: 'remote', label: 'Remote Type', icon: Monitor, count: selectedRemoteTypes.length },
    { id: 'experience', label: 'Experience', icon: Users, count: selectedExperienceLevels.length },
    { id: 'jobType', label: 'Job Type', icon: Clock, count: selectedJobTypes.length },
    { id: 'skills', label: 'Skills', icon: Code, count: selectedSkills.length },
  ];

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary-600 text-white rounded-full">
                {filterTabs.reduce((sum, tab) => sum + tab.count, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as "relevance" | "date")
            }
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <div className={`lg:block ${isOpen ? "block" : "hidden"}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  activeFilterTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-600 text-white rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeFilterTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {activeFilterTab === 'sources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((source) => (
                  <label key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source)}
                      onChange={() => handleSourceToggle(source)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
            )}

            {activeFilterTab === 'location' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countries.map((country) => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => handleCountryToggle(country)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            )}

            {activeFilterTab === 'remote' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {remoteTypes.map((remoteType) => (
                  <label key={remoteType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRemoteTypes.includes(remoteType)}
                      onChange={() => handleRemoteTypeToggle(remoteType)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{remoteType}</span>
                  </label>
                ))}
              </div>
            )}

            {activeFilterTab === 'experience' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experienceLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedExperienceLevels.includes(level)}
                      onChange={() => handleExperienceLevelToggle(level)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            )}

            {activeFilterTab === 'jobType' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobTypes.map((jobType) => (
                  <label key={jobType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(jobType)}
                      onChange={() => handleJobTypeToggle(jobType)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{jobType}</span>
                  </label>
                ))}
              </div>
            )}

            {activeFilterTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Active Filters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                    Search: {searchTerm}
                    <button
                      onClick={() => onSearchChange("")}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategories.map((category) => (
                  <span key={category} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                    {category}
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedSources.map((source) => (
                  <span key={source} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    {source}
                    <button
                      onClick={() => handleSourceToggle(source)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedCountries.map((country) => (
                  <span key={country} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                    {country}
                    <button
                      onClick={() => handleCountryToggle(country)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedRemoteTypes.map((remoteType) => (
                  <span key={remoteType} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                    {remoteType}
                    <button
                      onClick={() => handleRemoteTypeToggle(remoteType)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedExperienceLevels.map((level) => (
                  <span key={level} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                    {level}
                    <button
                      onClick={() => handleExperienceLevelToggle(level)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedJobTypes.map((jobType) => (
                  <span key={jobType} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1">
                    {jobType}
                    <button
                      onClick={() => handleJobTypeToggle(jobType)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedSkills.map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
