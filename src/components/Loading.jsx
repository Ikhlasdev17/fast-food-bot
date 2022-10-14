import React from 'react'
import loading from '../loading.svg'
const Loading = () => {
  return (
    <center className="py-8 flex justify-center items-center">    
      <img src={loading} width={50} />
    </center>
  )
}

export default Loading