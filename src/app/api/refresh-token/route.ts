import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signJwtAccessToken, verifyJwt } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  // 驗證 refresh token 是否有效
  // 獲取 cookies
  console.log('/api/refresh-token', cookies().getAll())
  console.log('/api/refresh-token', req.cookies.get('refreshToken')?.value)
  const refreshToken = verifyJwt(req.cookies.get('refreshToken')?.value || '')

  // const accessToken = signJwtAccessToken(
  //   {
  //     type: 'access'
  //   },
  //   {
  //     expiresIn: '5s'
  //   }
  // )

  // return NextResponse.json({ accessToken })

  if (refreshToken) {
    const accessToken = signJwtAccessToken(
      {
        type: 'access'
      },
      {
        expiresIn: '5s'
      }
    )

    return NextResponse.json({ accessToken })
  } else {
    return NextResponse.json({ message: 'refresh token is invalid' }, { status: 401 })
  }
}
