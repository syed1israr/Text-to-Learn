import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex w-full h-full items-center justify-center flex-col mt-50'>
        {children}
    </div>
  )
}

export default layout