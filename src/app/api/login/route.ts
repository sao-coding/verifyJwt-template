import { NextRequest, NextResponse } from 'next/server'

import { signJwtAccessToken } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const refreshToken = signJwtAccessToken(
    {
      type: 'refresh'
    },
    {
      expiresIn: '7d'
    }
  )

  // set-cookie: refreshToken

  const accessToken = signJwtAccessToken(
    {
      type: 'access'
    },
    {
      expiresIn: '5s'
    }
  )

  return NextResponse.json(
    { accessToken },
    {
      headers: {
        'set-cookie': `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
      }
    }
  )
}
