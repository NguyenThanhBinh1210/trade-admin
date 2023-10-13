import { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getAllConfig, searchConfig } from '~/apis/product.api'
import CreateModal from '~/components/Modal/CreateModal'
import { AppContext } from '~/contexts/app.context'
import { FormatNumber } from '~/hooks/useFormatNumber'

const Comment = () => {
  const { profile } = useContext(AppContext)
  const [data, setData] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: dataConfig, isLoading: isLoadingOption } = useQuery({
    queryKey: ['options', 2],
    queryFn: () => {
      return getAllConfig()
    },
    cacheTime: 120000
  })
  const searchMutation = useMutation({
    mutationFn: (title: string) => searchConfig(title)
  })
  const handleSearch = (e: any, title: string) => {
    e.preventDefault()
    searchMutation.mutate(title, {
      onSuccess: (data) => {
        setData(data.data[0])
        setModalOpen(true)
      },
      onError: (error: any) => {
        toast.warn(error.response.data)
      }
    })
  }
  return (
    <div className='p-5 flex flex-col h-full'>
      <div className='flex justify-between items-center mb-3'>
        <h1 className='mb-3  text-2xl font-bold dark:text-white'>Danh sách option</h1>
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
          <span className='my-4 font-bold dark:text-white'>Số lượng option: {dataConfig?.data.length || 0}</span>
        </div>
      </div>
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingOption ? (
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
                      Tên
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Giá
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Link
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Action
                    </th>
                  </tr>
                </thead>
                {dataConfig?.data !== 0 && (
                  <tbody>
                    {dataConfig?.data.map((item: any, idx: number) => {
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
                            {item.title}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {FormatNumber(item.price)}đ
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white mobile:w-[200px]'
                          >
                            <a href={item.url_tele} target='_blank' className='text-blue-500' rel='noreferrer'>
                              {item.url_tele}
                            </a>
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <button
                              type='button'
                              onClick={(e) => handleSearch(e, item.title)}
                              className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900'
                            >
                              Sửa
                            </button>
                          </th>
                        </tr>
                      )
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </>
        )}
      </div>
      <CreateModal data={data} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default Comment
