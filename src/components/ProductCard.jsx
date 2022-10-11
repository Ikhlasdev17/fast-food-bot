import React, { useEffect, useState } from 'react'
// import { useTelegram } from '../hooks/useTelegram'
const ProductCard = ({ idx, product, onClick, selectedProducts }) => {
  const [isClicked, setIsClicked] = useState(false) 
  // const { tg } = useTelegram()

  useEffect(() => {
    if (selectedProducts?.find(item => item.id === product.id)) {
      setIsClicked(true)
    } else {
      setIsClicked(false)
    }
  }, [selectedProducts])

  return (
    <div>
      <div key={idx} className={"product_card"}>
        {
          isClicked && (<span className='badge'>{ selectedProducts?.find(x => x.id === product.id)?.count }</span>)
        }
        <img src={product?.image} />
        <div className='card-body'>
          <span className='product-info'>
            <b>{product?.name}</b>
            <br /> 
            <span>{ Number(product?.price).toLocaleString() } sum</span>
            </span>
                <div className={`buttons ${ isClicked ? "flex" : "" }`}>
                  {
                    isClicked ? (<button onClick={() => onClick(product, "remove")} className='btn btn-remove'>-</button>) : ""
                  }
                  <button onClick={() => onClick(product, "add")} className='btn btn-add'>
                    {
                      isClicked ? "+" : "ADD"
                    }
                  </button>
                </div> 
        </div>
      </div>
    </div>
  )
}

export default ProductCard