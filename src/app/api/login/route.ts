import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signJwtAccessToken } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const refreshToken = signJwtAccessToken({
    type: 'refresh'
  })

  // set-cookie: refreshToken
  const cookie = cookies().set('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict'
  })

  const accessToken = signJwtAccessToken(
    {
      type: 'access'
    },
    {
      expiresIn: '5s'
    }
  )

  return NextResponse.json({ accessToken }, { headers: { 'set-cookie': cookie.toString() } })
}
