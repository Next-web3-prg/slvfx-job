import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Demo token verification - accept any token that starts with 'demo-jwt-token-'
    // In a real app, you would verify the JWT token
    
    if (!token.startsWith('demo-jwt-token-')) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const demoUser = {
      id: 1,
      email: 'demo@example.com',
      name: 'Demo User'
    }

    return NextResponse.json({
      user: demoUser
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
} 