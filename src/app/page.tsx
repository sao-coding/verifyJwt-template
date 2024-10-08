'use client'

import React from 'react'

import api from '@/lib/api'

const HomePage = () => {
  type State = {
    status: boolean
  }

  const [state, setState] = React.useState<State>({ status: false })
  const timer = React.useRef<HTMLSpanElement>(null)

  const Login = async () => {
    const res = await fetch('/api/login', {
      method: 'GET'
    })
    const data = await res.json()
    console.log(data)
    localStorage.setItem('accessToken', data.accessToken)
  }

  const RefreshAccessToken = async () => {
    const res = await fetch('/api/refresh-token', {
      method: 'GET'
    })
    const data = await res.json()
    console.log(data)
    localStorage.setItem('accessToken', data.accessToken)

    // 重新計時()
    timer.current!.innerText = '5'
    const interval = setInterval(() => {
      const time = Number(timer.current!.innerText)
      if (time === 0) {
        clearInterval(interval)
        return
      }
      timer.current!.innerText = String(time - 1)
    }, 1000)
  }

  const verifyAccessToken = async () => {
    // const res = await fetch('/api/access-token', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    //   }
    // })
    // const data = await res.json()
    // console.log(data)
    // setState(data)

    const { data } = await api.get('/access-token')
    // 若驗證失敗，會重新導向到登入頁面或處理登出邏輯
    // 不會回傳 data 因為 axios 會攔截 401 的錯誤
    // 邏輯 -> 驗證 accessToken -> 驗證失敗 -> 嘗試刷新 accessToken ->
    // refreshToken 過期驗證失敗 -> 所以 setState 會是上一次的狀態(也就是成功的狀態)
    console.log('data', data)
    setState(data)
  }

  return (
    <div>
      <h1>Home Page</h1>
      <h2 className='text-2xl'>登入 & 刷新 RefreshToken</h2>
      <button
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
        onClick={Login}
      >
        登入 & 刷新 RefreshToken
      </button>
      <h2 className='text-2xl'>刷新 AccessToken</h2>
      <button
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
        onClick={RefreshAccessToken}
      >
        刷新 AccessToken
      </button>
      <div className='flex items-center gap-2'>
        <h2 className='text-2xl'>測試驗證 AccessToken</h2>
        計時器: <span ref={timer} className='text-red-500'></span>
      </div>
      <button
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
        onClick={verifyAccessToken}
      >
        測試驗證 AccessToken
      </button>
      <>{JSON.stringify(state)}</>
      <div className=''>是否驗證成功: {state?.status ? '成功' : '失敗'}</div>
    </div>
  )
}

export default HomePage
