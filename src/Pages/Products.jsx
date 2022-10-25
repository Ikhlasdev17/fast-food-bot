import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../tools/api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { useTelegram } from '../hooks/useTelegram'
import { useParams } from 'react-router-dom'
const Products = () => {

  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { tg, user } = useTelegram()
  const params = useParams()
  const [productsForBackend, setProductsForBackend] = useState([])
  console.log(user);
  const ruLang = {
    order:"Оформить заказ",
    success:"Нажмите кнопку ЗАКРЫТЬ. Для вашего удобство, Пожалуйста выберите вид доставки."
  }

  const qqLang = {
    order: "Буйыртпаны тастыйықлаў",
    success: "“Закритъ” туймесин басың ҳәм өзиңизге қолай хызмет түрин сайлаң."
  }

  const uzLang = {
    order: "Buyurtmani tasdiqlash",
    success:"“Закритъ” tugmasini bosing va o'zingizga qulay xizmat turini tanlang."
  }

  let lang = params?.lang === "qq" ? qqLang : params?.lang === "uz" ? uzLang : ruLang

  useEffect(() => {
    setLoading(true)
    axios.get(`${process.env.NODE_ENV === "production" ? baseUrl : ""}/api/v1/category`)
      .then((res) => {
        setProducts(res.data.payload);
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const allSum = []
    selectedProducts.map((item) => {
      allSum.push(item.price * item.count)
    })
    let totalSum = allSum.reduce((prev, curr) => {
      return Number(prev + curr)
    }, 0)
    if (selectedProducts?.length) {
      tg.MainButton.show()
      tg.MainButton.setText(`${lang?.order} ${totalSum?.toLocaleString()} UZS`)
    } else {
      tg.MainButton.hide()
    }

    let newProducts = []
    selectedProducts.map((item) => {
      newProducts.push({ product_id: item.id, count: item.count, price: Number(Number(item.price) * Number(item.count)) })
    })
    setProductsForBackend(newProducts)
  }, [selectedProducts])

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


  const sendData = useCallback(() => {
    tg.MainButton.hide()
    axios.post(`${process.env.NODE_ENV === "production" ? baseUrl : ""}/api/v1/order/add`, { user_id: params.userId, orders: productsForBackend })
      .then((res) => {
        tg.showAlert(lang.success)
        tg.close()
      }) 
  }, [productsForBackend])

 
    useEffect(() => {
      tg.onEvent("mainButtonClicked", sendData)
      return () => {
        tg.offEvent('mainButtonClicked', sendData)
      }
    }, [sendData])



  return (
    <div className='container'>
      {JSON.stringify(user)}
      {
        loading ? (
          <>
            <br /><br />
            <Loading />
          </>
        ) : (
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
        )
      }
    </div>
  )
}

export default Products