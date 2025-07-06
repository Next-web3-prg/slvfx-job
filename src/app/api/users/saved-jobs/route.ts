import { NextRequest, NextResponse } from 'next/server'

// Demo saved jobs (in a real app, this would be in a database)
const demoSavedJobs = [1, 3, 5] // Job IDs that are saved

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would verify the JWT token here
    // For demo purposes, we'll just return the saved jobs
    
    return NextResponse.json({ 
      saved_jobs: demoSavedJobs 
    })

  } catch (error) {
    console.error('Error fetching saved jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { job_id } = await request.json()

    if (!job_id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // In a real app, you would verify the JWT token here
    // For demo purposes, we'll just toggle the saved status
    
    const isCurrentlySaved = demoSavedJobs.includes(job_id)
    
    if (isCurrentlySaved) {
      // Remove from saved jobs
      const index = demoSavedJobs.indexOf(job_id)
      if (index > -1) {
        demoSavedJobs.splice(index, 1)
      }
      return NextResponse.json({ message: 'Job removed from saved list' })
    } else {
      // Add to saved jobs
      demoSavedJobs.push(job_id)
      return NextResponse.json({ message: 'Job added to saved list' })
    }

  } catch (error) {
    console.error('Error toggling saved job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 