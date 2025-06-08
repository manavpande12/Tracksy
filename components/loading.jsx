import React from 'react'
import { BarLoader } from 'react-spinners'

const Loading = () => {
    return (
        <BarLoader className='mt-4 gradient rounded-[0.2rem] shadow-2xl ease-linear' width={"100%"} />
    )
}

export default Loading