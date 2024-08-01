import { NextRequest, NextResponse } from 'next/server'

import { signJwtAccessToken } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  const accessToken = signJwtAccessToken(
    {
      type: 'access'
    },
    {
      expiresIn: '10s'
    }
  )

  return NextResponse.json({ accessToken })
}
