import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Demo login - accept any email/password combination
    // In a real app, you would verify against the database
    
    const demoUser = {
      id: 1,
      email: email,
      name: 'Demo User'
    }

    const demoToken = 'demo-jwt-token-' + Date.now()

    return NextResponse.json({
      token: demoToken,
      user: demoUser
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 