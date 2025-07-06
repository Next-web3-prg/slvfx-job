import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Demo registration - accept any valid input
    // In a real app, you would check for existing users and hash passwords
    
    const demoUser = {
      id: Math.floor(Math.random() * 1000) + 1,
      email: email,
      name: name
    }

    const demoToken = 'demo-jwt-token-' + Date.now()

    return NextResponse.json({
      token: demoToken,
      user: demoUser
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 