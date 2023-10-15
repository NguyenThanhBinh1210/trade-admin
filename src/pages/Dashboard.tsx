import { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteComment, getAllComment, getAllContact, getAllStaff, searchComment } from '~/apis/product.api'
import CreateModal from '~/components/Modal/CreateModal'
import { AppContext } from '~/contexts/app.context'

const Dashboard = () => {
  const { profile } = useContext(AppContext)
  const [data, setData] = useState<any>([])
  const { data: dataConfig, isLoading: isLoadingOption } = useQuery({
    queryKey: ['comments', 2],
    queryFn: () => {
      return getAllComment({
        page: 1
      })
    },
    onSuccess: (data) => {
      setData(data.data.comments)
    },
    cacheTime: 120000
  })
  const { data: dataContact, isLoading: isLoadingOptionCT } = useQuery({
    queryKey: ['contacts', 2],
    queryFn: () => {
      return getAllContact({
        page: 1
      })
    },
    onSuccess: (data) => {
      setData(data.data.contacts)
    },
    cacheTime: 120000
  })
  const { data: dataStaff, isLoading: isLoadingOptionStaff } = useQuery('users', () => getAllStaff(), {
    onSuccess: (data) => {
      setData(data.data.users)
    },
    cacheTime: 120000
  })

  return (
    <>
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingOption || isLoadingOptionCT || isLoadingOptionStaff ? (
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
            <div className='p-5 '>
              <div className='tablet:hidden mobile:hidden grid grid-cols-3 gap-x-10 mt-5 dark:text-white font-bold text-[16px]'>
                <div className='col-span-1 text-center'>Nhân viên</div>
                <div className='col-span-1 text-center'>Bình luận</div>
                <div className='col-span-1 text-center'>Liên hệ</div>
              </div>
              <div className='grid grid-cols-3 gap-3 tablet:gap-y-6 mobile:gap-y-6 tablet:grid-cols-1 mobile:grid-cols-1 tablet:gap-x-0 mobile:gap-x-0 gap-x-10 mt-3 h-[251px]'>
                <div className='text-center bg-emerald-300 pt-14 tablet:h-[300px] mobile:h-[200px] border-pink-400 border dark:border-none col-span-1 custom-scrollbar rounded-md relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <span className='my-4 text-[#ffff] m-auto text-9xl font-bold dark:text-white'>
                    {dataStaff?.data.count || 0}
                  </span>
                </div>
                <div className='text-center pt-14 bg-teal-300 tablet:h-[200px] mobile:h-[200px] border-pink-400 border dark:border-none col-span-1 custom-scrollbar rounded-md relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <span className='my-4 m-auto text-[#ffff] text-9xl font-bold dark:text-white'>
                    {dataConfig?.data.count || 0}
                  </span>
                </div>
                <div className='text-center bg-cyan-300 pt-14 tablet:h-[300px] mobile:h-[200px] border-pink-400 border dark:border-none col-span-1 custom-scrollbar rounded-md relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <span className='my-4 m-auto text-[#ffff] text-9xl font-bold dark:text-white'>
                    {dataContact?.data.count || 0}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Dashboard
