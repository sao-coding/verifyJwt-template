import api from '@/lib/server-api'
const getData = async () => {
  //   const { data } = await api.get('/access-token')
  //   return data
  try {
    const { data } = await api.get('/access-token')
    return data
  } catch (error) {
    console.error(error.response.data)
    return error.response.data
  }
}

const ServerPage = async () => {
  const data = await getData()
  console.log(data)
  return (
    <div className=''>
      <div className=''>data:{JSON.stringify(data)}</div>
    </div>
  )
}

export default ServerPage
