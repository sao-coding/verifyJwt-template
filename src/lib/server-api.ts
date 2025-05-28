import { cookies } from 'next/headers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('error', error.response.data)
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log('cookie', cookies().getAll())

      try {
        // 附帶 cookie
        const { data } = await axios.get('http://localhost:3000/api/refresh-token', {
          headers: {
            // 'Content-Type': 'application/json',
            // 'Cookie': 'refreshToken=' + document.cookie
            Cookie: cookies().toString()
          }
        })

        const { accessToken } = data
        console.log('refresh token', accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        // /login?redirect=
        // 重新導向到登入頁面或處理登出邏輯
        // window.location.href = '/login?redirect=' + window.location.pathname
      }
    }

    return Promise.reject(error)
  }
)

export default api
