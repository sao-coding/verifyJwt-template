import { NextRequest, NextResponse } from 'next/server'

import { verifyJwt } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.split('Bearer ')[1]

  const verify = verifyJwt(accessToken as string)

  if (verify) {
    return NextResponse.json({ status: true })
  } else {
    return NextResponse.json({ status: false })
  }
}
