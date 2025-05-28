'use client'

import React from 'react'

import api from '@/lib/api'

const HomePage = () => {
  type State = {
    status: boolean
  }

  const [state, setState] = React.useState<State>({ status: false })
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [timeLeft, setTimeLeft] = React.useState<number>(0)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    // 檢查是否已有 accessToken
    const token = localStorage.getItem('accessToken')
    if (token) {
      setIsLoggedIn(true)
      startTimer(5) // 假設 token 有效期為 5 秒
    }
  }, [])

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds)
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const Login = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/login', {
        method: 'GET'
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken)
        setIsLoggedIn(true)
        startTimer(5)
      } else {
        throw new Error(data.message || '登入失敗')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const RefreshAccessToken = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/refresh-token', {
        method: 'GET'
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken)
        startTimer(5)
      } else {
        throw new Error(data.message || '刷新失敗')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyAccessToken = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await api.get('/access-token')
      setState(data)
    } catch (err) {
      setError('驗證失敗')
      setState({ status: false })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setIsLoggedIn(false)
    setState({ status: false })
    setTimeLeft(0)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const StatusBadge = ({ status }: { status: boolean }) => (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        status
          ? 'border border-green-200 bg-green-100 text-green-800'
          : 'border border-red-200 bg-red-100 text-red-800'
      }`}
    >
      <div className={`mr-2 h-2 w-2 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}`} />
      {status ? '驗證成功' : '驗證失敗'}
    </span>
  )

  const TimerDisplay = () => (
    <div className='flex items-center space-x-2'>
      <span className='text-sm text-gray-600'>Token 剩餘時間:</span>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          timeLeft > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {timeLeft}
      </div>
      <span className='text-xs text-gray-400'>秒</span>
    </div>
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mx-auto max-w-4xl'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-4xl font-bold text-gray-800'>JWT 驗證系統</h1>
            <p className='text-gray-600'>展示 JWT Token 的登入、刷新和驗證功能</p>
          </div>

          {/* Main Content */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Left Panel - Actions */}
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-6 text-2xl font-semibold text-gray-800'>操作面板</h2>

              {/* Login Section */}
              <div className='mb-6'>
                <h3 className='mb-3 text-lg font-medium text-gray-700'>步驟 1: 登入系統</h3>
                <button
                  className={`w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                    isLoading
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  } text-white shadow-md hover:shadow-lg`}
                  onClick={Login}
                  disabled={isLoading}
                >
                  {isLoading ? '登入中...' : '🔐 登入並獲取 Token'}
                </button>
              </div>

              {/* Refresh Section */}
              <div className='mb-6'>
                <h3 className='mb-3 text-lg font-medium text-gray-700'>步驟 2: 刷新 Token</h3>
                <button
                  className={`w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                    isLoading || !isLoggedIn
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  } text-white shadow-md hover:shadow-lg`}
                  onClick={RefreshAccessToken}
                  disabled={isLoading || !isLoggedIn}
                >
                  {isLoading ? '刷新中...' : '🔄 刷新 Access Token'}
                </button>
              </div>

              {/* Verify Section */}
              <div className='mb-6'>
                <h3 className='mb-3 text-lg font-medium text-gray-700'>步驟 3: 驗證 Token</h3>
                <button
                  className={`w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                    isLoading || !isLoggedIn
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                  } text-white shadow-md hover:shadow-lg`}
                  onClick={verifyAccessToken}
                  disabled={isLoading || !isLoggedIn}
                >
                  {isLoading ? '驗證中...' : '✅ 驗證 Access Token'}
                </button>
              </div>

              {/* Logout Section */}
              <div>
                <button
                  className={`w-full rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                    !isLoggedIn
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  } border border-gray-300`}
                  onClick={logout}
                  disabled={!isLoggedIn}
                >
                  🚪 登出
                </button>
              </div>
            </div>

            {/* Right Panel - Status */}
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-6 text-2xl font-semibold text-gray-800'>狀態監控</h2>

              {/* Login Status */}
              <div className='mb-6 rounded-lg bg-gray-50 p-4'>
                <h3 className='mb-2 text-sm font-medium text-gray-600'>登入狀態</h3>
                <div className='flex items-center'>
                  <div
                    className={`mr-2 h-3 w-3 rounded-full ${isLoggedIn ? 'bg-green-400' : 'bg-gray-400'}`}
                  />
                  <span
                    className={`font-medium ${isLoggedIn ? 'text-green-700' : 'text-gray-500'}`}
                  >
                    {isLoggedIn ? '已登入' : '未登入'}
                  </span>
                </div>
              </div>

              {/* Timer */}
              {isLoggedIn && (
                <div className='mb-6 rounded-lg bg-blue-50 p-4'>
                  <h3 className='mb-2 text-sm font-medium text-gray-600'>Token 計時器</h3>
                  <TimerDisplay />
                  <div className='mt-2'>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-blue-600 transition-all duration-1000'
                        style={{ width: `${(timeLeft / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className='mb-6 rounded-lg bg-gray-50 p-4'>
                <h3 className='mb-3 text-sm font-medium text-gray-600'>驗證結果</h3>
                <StatusBadge status={state.status} />
              </div>

              {/* Error Display */}
              {error && (
                <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4'>
                  <div className='flex items-center'>
                    <div className='mr-2 text-red-400'>⚠️</div>
                    <div>
                      <h3 className='text-sm font-medium text-red-800'>錯誤</h3>
                      <p className='text-sm text-red-700'>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw Data */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <h3 className='mb-2 text-sm font-medium text-gray-600'>原始數據</h3>
                <pre className='overflow-auto rounded border bg-white p-2 text-xs text-gray-700'>
                  {JSON.stringify(state, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className='mt-8 rounded-lg bg-white p-6 shadow-lg'>
            <h2 className='mb-4 text-xl font-semibold text-gray-800'>💡 使用說明</h2>
            <div className='grid gap-4 text-sm text-gray-600 md:grid-cols-3'>
              <div className='rounded-lg bg-blue-50 p-3'>
                <h3 className='mb-1 font-medium text-blue-800'>Access Token</h3>
                <p>
                  有效期限：5 秒<br />
                  用於 API 驗證
                </p>
              </div>
              <div className='rounded-lg bg-green-50 p-3'>
                <h3 className='mb-1 font-medium text-green-800'>Refresh Token</h3>
                <p>
                  有效期限：10 秒<br />
                  用於刷新 Access Token
                </p>
              </div>
              <div className='rounded-lg bg-purple-50 p-3'>
                <h3 className='mb-1 font-medium text-purple-800'>自動刷新</h3>
                <p>
                  API 錯誤時會自動
                  <br />
                  嘗試刷新 Token
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
