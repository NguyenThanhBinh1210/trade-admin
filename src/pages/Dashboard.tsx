/* eslint-disable @typescript-eslint/no-explicit-any */

import moment from 'moment'
import { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { blockKey, getAllKey, removeKey, searchKey } from '~/apis/product.api'
import Modal from '~/components/Modal'
import Loading from '~/components/Modal/Loading'
import { AppContext } from '~/contexts/app.context'

const TokenUsers = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [keyState, setKeyState] = useState([])
  const { profile } = useContext(AppContext)
  const [search, setSearch] = useState<string>('')
  const { isLoading } = useQuery({
    queryKey: ['key', 1],
    queryFn: () => {
      return getAllKey()
    },
    onSuccess: (data) => {
      setKeyState(data.data)
    },
    cacheTime: 60000
  })

  const itemsPerPage = 8
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(keyState?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = keyState?.slice(startIndex, endIndex)
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const queryClient = useQueryClient()
  const toggleMutation = useMutation({
    mutationFn: (data: any) => blockKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key', 1] })
    }
  })
  const searchMutation = useMutation({
    mutationFn: (username: string) => searchKey(username)
  })
  const deleteMutation = useMutation({
    mutationFn: (body: { key: string }) => removeKey(body)
  })

  const handleSearch = (e: any) => {
    e.preventDefault()
    searchMutation.mutate(search, {
      onSuccess: (data) => {
        setKeyState(data.data)
        setCurrentPage(1)
      },
      onError: (error: any) => {
        toast.warn(error.response.data)
      }
    })
  }
  const handleDelete = (key: string) => {
    const body = { key: key }
    deleteMutation.mutate(body, {
      onSuccess: () => {
        toast.warn('Đã xoá thành công!')
        queryClient.invalidateQueries({ queryKey: ['key', 1] })
      }
    })
  }
  const handleToggle = (item: any) => {
    if (item.code === 'block') {
      const body: any = {
        key: item.key,
        code: 'open'
      }
      toggleMutation.mutate(body)
    } else {
      const body: any = {
        key: item.key,
        code: 'block'
      }
      toggleMutation.mutate(body)
    }
  }

  return (
    <div className='p-5 flex flex-col h-full'>
      <div className='flex justify-between items-center mb-3'>
        <h1 className='mb-3  text-2xl font-bold dark:text-white'>Danh sách key</h1>
        <div className='flex items-center space-x-4'>
          <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'>
            <svg
              className='absolute w-12 h-12 text-gray-400 -left-1'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              ></path>
            </svg>
          </div>
          <div className='font-medium dark:text-white'>
            <div>{profile?.name}</div>
          </div>
        </div>
      </div>
      <div className='flex justify-between mb-3 mobile:flex-col tablet:flex-col'>
        <div className='mb-2 flex items-center'>
          <span className='my-4 font-bold dark:text-white'>Số lượng key: {keyState.length || 0}</span>
          <button
            type='button'
            onClick={() => setModalOpen(true)}
            className='ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 h-[40px] text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Tạo tài khoản
          </button>
        </div>
        <div className='w-[50%] tablet:w-[75%] mobile:w-full'>
          <form onSubmit={(e) => handleSearch(e)}>
            <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
              Search
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <svg
                  className='w-4 h-4 text-gray-500 dark:text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                  />
                </svg>
              </div>
              <input
                type='search'
                id='default-search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Search...'
              />
              <button
                type='submit'
                className='text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoading ? (
          <div className='w-full flex justify-center items-center h-full gap-x-3'>
            <svg
              aria-hidden='true'
              className='inline w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='text-lg dark:text-white'>Đang tải...</span>
          </div>
        ) : (
          <>
            <div className='relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      STT
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Username
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Key
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Hết hạn
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Action
                    </th>
                  </tr>
                </thead>
                {keyState.length !== 0 && (
                  <tbody>
                    {currentData.map((item: any, idx: number) => {
                      const expirationDate = new Date(item.expirationDate)
                      const createdDate = new Date()
                      const timeDifference = Number(expirationDate) - Number(createdDate)
                      const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                      return (
                        <tr
                          key={item._id}
                          className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        >
                          <th
                            scope='row'
                            className='w-[100px] px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {'#' + (idx + 1)}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item.author?.username}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item.key}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white mobile:w-[200px]'
                          >
                            {daysRemaining + 1} ngày
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <button className='flex items-center' onClick={() => handleToggle(item)}>
                              <label className=' relative inline-flex items-center cursor-pointer'>
                                <input
                                  type='checkbox'
                                  className='sr-only peer'
                                  checked={item.code === 'block' ? false : true}
                                />
                                <div className="w-11 h-6 bg-gray-200  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                              </label>
                            </button>
                            <button
                              type='button'
                              onClick={() => handleDelete(item.key)}
                              className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                            >
                              Xoá
                            </button>
                          </th>
                        </tr>
                      )
                    })}
                  </tbody>
                )}
              </table>
            </div>
            <nav aria-label='Page navigation example' className='mx-auto'>
              <ul className='flex items-center -space-x-px h-10 text-base'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className='flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Previous</span>
                  <svg
                    className='w-3 h-3'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 6 10'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 1 1 5l4 4'
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={
                      currentPage === index + 1
                        ? 'z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Next</span>
                  <svg
                    className='w-3 h-3'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 6 10'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='m1 9 4-4-4-4'
                    />
                  </svg>
                </button>
              </ul>
            </nav>
          </>
        )}
      </div>
      {searchMutation.isLoading || deleteMutation.isLoading || toggleMutation.isLoading ? <Loading></Loading> : null}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default TokenUsers
