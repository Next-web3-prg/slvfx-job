import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Demo data for testing
const demoJobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'TechCorp',
    location: 'Remote',
    description: 'We are looking for a senior full stack developer to join our team. Experience with React, Node.js, TypeScript, and modern web development required.',
    url: 'https://example.com/job1',
    posted_at: new Date().toISOString(),
    source: 'RemoteOK',
    category: 'Full Stack Development',
    salary_range: '$100,000 - $150,000',
    job_type: 'Full-time',
    experience_level: 'Senior'
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    description: 'Full stack engineer to build scalable web applications. Experience with React, Python, Django, and cloud platforms.',
    url: 'https://example.com/job2',
    posted_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    source: 'WeWorkRemotely',
    category: 'Full Stack Development',
    salary_range: '$85,000 - $130,000',
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'WebSolutions',
    location: 'Remote',
    description: 'Frontend developer to build beautiful user interfaces. Experience with React, Vue.js, and modern CSS frameworks.',
    url: 'https://example.com/job3',
    posted_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    source: 'RemoteYeah',
    category: 'Frontend Development',
    salary_range: '$65,000 - $95,000',
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  },
  {
    id: 4,
    title: 'Backend Developer',
    company: 'APITech',
    location: 'Remote',
    description: 'Backend developer to build robust APIs and services. Experience with Node.js, Python, databases, and microservices.',
    url: 'https://example.com/job4',
    posted_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    source: 'RemoteOK',
    category: 'Backend Development',
    salary_range: '$75,000 - $110,000',
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    description: 'Creative UI/UX designer needed for our growing design team. Experience with Figma, Adobe Creative Suite, and user research.',
    url: 'https://example.com/job5',
    posted_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    source: 'WeWorkRemotely',
    category: 'Design',
    salary_range: '$60,000 - $90,000',
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Remote',
    description: 'DevOps engineer to help us scale our infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines.',
    url: 'https://example.com/job6',
    posted_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    source: 'RemoteYeah',
    category: 'DevOps',
    salary_range: '$90,000 - $130,000',
    job_type: 'Full-time',
    experience_level: 'Senior'
  },
  {
    id: 7,
    title: 'Data Scientist',
    company: 'DataLab',
    location: 'Remote',
    description: 'Data scientist to help us build machine learning models. Experience with Python, TensorFlow, and statistical analysis.',
    url: 'https://example.com/job7',
    posted_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    source: 'RemoteOK',
    category: 'Data Science',
    salary_range: '$100,000 - $150,000',
    job_type: 'Full-time',
    experience_level: 'Senior'
  },
  {
    id: 8,
    title: 'Mobile Developer',
    company: 'AppStudio',
    location: 'Remote',
    description: 'Mobile developer to build iOS and Android apps. Experience with React Native, Swift, and Kotlin.',
    url: 'https://example.com/job8',
    posted_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    source: 'WeWorkRemotely',
    category: 'Mobile Development',
    salary_range: '$70,000 - $105,000',
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  },
  {
    id: 9,
    title: 'AI/ML Engineer',
    company: 'AITech',
    location: 'Remote',
    description: 'AI/ML engineer to develop intelligent systems. Experience with Python, TensorFlow, PyTorch, and machine learning.',
    url: 'https://example.com/job9',
    posted_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    source: 'RemoteYeah',
    category: 'AI/ML Engineering',
    salary_range: '$110,000 - $160,000',
    job_type: 'Full-time',
    experience_level: 'Senior'
  },
  {
    id: 10,
    title: 'Game Developer',
    company: 'GameStudio',
    location: 'Remote',
    description: 'Game developer to create engaging gaming experiences. Experience with Unity, C#, and game development principles.',
    url: 'https://example.com/job10',
    posted_at: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
    source: 'RemoteOK',
    category: 'Game Development',
    salary_range: '$80,000 - $120,000',
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const categories = searchParams.get('categories')?.split(',') || []
    const sources = searchParams.get('sources')?.split(',') || []
    const countries = searchParams.get('countries')?.split(',') || []
    const remoteTypes = searchParams.get('remoteTypes')?.split(',') || []
    const experienceLevels = searchParams.get('experienceLevels')?.split(',') || []
    const jobTypes = searchParams.get('jobTypes')?.split(',') || []
    const skills = searchParams.get('skills')?.split(',') || []
    const sortBy = searchParams.get('sort_by') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Check if we have a database connection
    const useDatabase = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech')

    if (useDatabase) {
      // Try to use real database
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        })

        let query = `
          SELECT 
            j.id,
            j.title,
            j.company,
            j.location,
            j.description,
            j.apply_url as url,
            j.posted_at,
            js.name as source,
            j.job_type,
            j.experience_level,
            j.remote_type,
            j.salary_min,
            j.salary_max,
            j.salary_currency,
            j.tags
          FROM jobs j
          JOIN job_sources js ON j.source_id = js.id
          WHERE j.is_active = true
        `
        
        const queryParams: any[] = []
        let paramIndex = 1

        if (search) {
          query += ` AND (
            j.title ILIKE $${paramIndex} OR 
            j.company ILIKE $${paramIndex} OR 
            j.description ILIKE $${paramIndex}
          )`
          queryParams.push(`%${search}%`)
          paramIndex++
        }

        if (categories.length > 0) {
          query += ` AND j.job_type = ANY($${paramIndex})`
          queryParams.push(categories)
          paramIndex++
        }

        if (sources.length > 0) {
          query += ` AND js.name = ANY($${paramIndex})`
          queryParams.push(sources)
          paramIndex++
        }

        if (countries.length > 0) {
          query += ` AND j.location ILIKE ANY($${paramIndex})`
          queryParams.push(countries.map(c => `%${c}%`))
          paramIndex++
        }

        if (remoteTypes.length > 0) {
          query += ` AND j.remote_type = ANY($${paramIndex})`
          queryParams.push(remoteTypes)
          paramIndex++
        }

        if (experienceLevels.length > 0) {
          query += ` AND j.experience_level = ANY($${paramIndex})`
          queryParams.push(experienceLevels)
          paramIndex++
        }

        if (jobTypes.length > 0) {
          query += ` AND j.job_type = ANY($${paramIndex})`
          queryParams.push(jobTypes)
          paramIndex++
        }

        if (skills.length > 0) {
          query += ` AND j.tags && $${paramIndex}`
          queryParams.push(skills)
          paramIndex++
        }

        // Add relevance scoring for search
        if (search) {
          query += `
            ORDER BY 
              CASE 
                WHEN j.title ILIKE $${paramIndex} THEN 3
                WHEN j.company ILIKE $${paramIndex} THEN 2
                WHEN j.description ILIKE $${paramIndex} THEN 1
                ELSE 0
              END DESC,
              j.posted_at DESC
          `
          queryParams.push(`%${search}%`)
          paramIndex++
        } else if (sortBy === 'date') {
          query += ` ORDER BY j.posted_at DESC`
        } else {
          query += ` ORDER BY j.posted_at DESC`
        }

        // Get total count (without ORDER BY and LIMIT)
        let countQuery = `
          SELECT COUNT(*) 
          FROM jobs j
          JOIN job_sources js ON j.source_id = js.id
          WHERE j.is_active = true
        `
        const countParams: any[] = []
        let countParamIndex = 1

        if (search) {
          countQuery += ` AND (
            j.title ILIKE $${countParamIndex} OR 
            j.company ILIKE $${countParamIndex} OR 
            j.description ILIKE $${countParamIndex}
          )`
          countParams.push(`%${search}%`)
          countParamIndex++
        }

        if (categories.length > 0) {
          countQuery += ` AND j.job_type = ANY($${countParamIndex})`
          countParams.push(categories)
          countParamIndex++
        }

        if (sources.length > 0) {
          countQuery += ` AND js.name = ANY($${countParamIndex})`
          countParams.push(sources)
          countParamIndex++
        }

        if (countries.length > 0) {
          countQuery += ` AND j.location ILIKE ANY($${countParamIndex})`
          countParams.push(countries.map(c => `%${c}%`))
          countParamIndex++
        }

        if (remoteTypes.length > 0) {
          countQuery += ` AND j.remote_type = ANY($${countParamIndex})`
          countParams.push(remoteTypes)
          countParamIndex++
        }

        if (experienceLevels.length > 0) {
          countQuery += ` AND j.experience_level = ANY($${countParamIndex})`
          countParams.push(experienceLevels)
          countParamIndex++
        }

        if (jobTypes.length > 0) {
          countQuery += ` AND j.job_type = ANY($${countParamIndex})`
          countParams.push(jobTypes)
          countParamIndex++
        }

        if (skills.length > 0) {
          countQuery += ` AND j.tags && $${countParamIndex}`
          countParams.push(skills)
          countParamIndex++
        }

        const countResult = await pool.query(countQuery, countParams)
        const total = parseInt(countResult.rows[0].count)

        // Add pagination
        query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
        queryParams.push(limit, offset)

        const result = await pool.query(query, queryParams)
        
        const jobs = result.rows.map(job => ({
          ...job,
          description: job.description ? job.description.replace(/<[^>]*>/g, '') : '',
          posted_at: job.posted_at ? new Date(job.posted_at).toISOString() : new Date().toISOString(),
          salary_range: job.salary_min && job.salary_max 
            ? `${job.salary_currency || 'USD'}${job.salary_min.toLocaleString()} - ${job.salary_currency || 'USD'}${job.salary_max.toLocaleString()}`
            : job.salary_min 
            ? `${job.salary_currency || 'USD'}${job.salary_min.toLocaleString()}+`
            : job.salary_max 
            ? `Up to ${job.salary_currency || 'USD'}${job.salary_max.toLocaleString()}`
            : null,
          category: job.job_type || 'Other'
        }))

        await pool.end()

        return NextResponse.json({
          jobs,
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit)
        })

      } catch (dbError) {
        console.log('Database error, falling back to demo data:', dbError instanceof Error ? dbError.message : 'Unknown database error')
        // Fall back to demo data if database fails
      }
    }

    // Use demo data (either no database or database failed)
    let filteredJobs = demoJobs.filter(job => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category filter
      if (categories.length > 0) {
        if (!categories.includes(job.category)) return false
      }

      // Source filter
      if (sources.length > 0) {
        if (!sources.includes(job.source)) return false
      }

      // Country filter
      if (countries.length > 0) {
        const jobLocation = job.location.toLowerCase()
        const matchesCountry = countries.some(country => 
          jobLocation.includes(country.toLowerCase())
        )
        if (!matchesCountry) return false
      }

      // Remote type filter
      if (remoteTypes.length > 0) {
        const jobRemoteType = job.location.toLowerCase().includes('remote') ? 'Remote' : 'On-site'
        if (!remoteTypes.includes(jobRemoteType)) return false
      }

      // Experience level filter
      if (experienceLevels.length > 0) {
        if (!experienceLevels.includes(job.experience_level || '')) return false
      }

      // Job type filter
      if (jobTypes.length > 0) {
        if (!jobTypes.includes(job.job_type || '')) return false
      }

      // Skills filter
      if (skills.length > 0) {
        const jobDescription = job.description.toLowerCase()
        const matchesSkill = skills.some(skill => 
          jobDescription.includes(skill.toLowerCase())
        )
        if (!matchesSkill) return false
      }

      return true
    })

    // Sort jobs
    if (sortBy === 'date') {
      filteredJobs.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())
    } else {
      // Relevance sorting (by date for demo)
      filteredJobs.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())
    }

    const total = filteredJobs.length
    const paginatedJobs = filteredJobs.slice(offset, offset + limit)

    return NextResponse.json({
      jobs: paginatedJobs,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
} 