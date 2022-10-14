import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../tools/api'
import ProductCard from '../components/ProductCard'
const Products = () => {

  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  useEffect(() => {
    axios.get(`${baseUrl}/api/v1/category`)
      .then((res) => {
        setProducts(res.data.payload);
      })
  }, [])

  const addToCart = (product, type) => {
    const index = selectedProducts?.findIndex(item => item?.id === product.id)
    if (type === "add") {
      if (index === -1) {
        setSelectedProducts(prev => ([...selectedProducts, { ...product, count: 1 }]))
      } else {
        const newSelectedProducts = selectedProducts.filter(item => item.id !== product.id)
        setSelectedProducts(prev => ([...newSelectedProducts, { ...selectedProducts[index], count: selectedProducts[index]?.count + 1 }]))
      }
    } else {
      let currentProductCount = selectedProducts.find(item => item.id === product.id)
      const newProducts = selectedProducts?.filter(item => item.id !== product.id)
      if (currentProductCount.count === 1) {
        setSelectedProducts(newProducts)
      } else {
        setSelectedProducts([...newProducts, {...currentProductCount, count: currentProductCount.count - 1}])
      }
    }
  }


  const sendToOrder = () => {
    
  }


  return (
    <div className='container'>
      {
        products?.map((item, index) => {
          return <div key={index} className='category-container'>
            <h3>{ item?.name }</h3>
            <div className='products-container'>
            {
              item?.product?.map((product, idx) => (
                <ProductCard key={idx} idx={idx} product={product} onClick={addToCart} selectedProducts={selectedProducts} />
              ))
            }
            </div>
          </div>
        })
      }
    </div>
  )
}

export default Products