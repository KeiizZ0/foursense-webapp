import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/api'
const API_KEY = process.env.API_KEY || 'dnwioadnaiowndioa198198njawx'

export async function POST(request: NextRequest) {
  try {
    const { endpoint, method = 'GET', body, searchParams } = await request.json()

    const url = new URL(`${BACKEND_URL}${endpoint}`)

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url.toString(), options)
    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('[v0] API Proxy Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
      return NextResponse.json(
        { status: 'error', message: 'Endpoint parameter required' },
        { status: 400 }
      )
    }

    const url = new URL(`${BACKEND_URL}${endpoint}`)
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        url.searchParams.append(key, value)
      }
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('[v0] API Proxy Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
