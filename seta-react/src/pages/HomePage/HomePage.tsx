import { useState, useEffect } from 'react'
import { Carousel } from 'primereact/carousel'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import { CarouselService } from '../../services/CarouselService'
import './style.css'

const carousel = {
  index: 1, //index which u want to display first
  direction: null, //direction of the carousel..u need to set it to either 'next' or 'prev' based on user click
  nextIcon: <span className="pi pi-fw pi-caret-right" />,
  prevIcon: <span className="pi pi-fw pi-caret-left" />
}

const HomePage = () => {
  interface ImageProperties {
    name: string
    description: string
    image: string
  }

  const [products, setImages] = useState<ImageProperties[]>([])
  const carouselService = new CarouselService()
  const responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '567px',
      numVisible: 1,
      numScroll: 1
    }
  ]

  useEffect(() => {
    carouselService.getImages().then(data => {
      console.log(data)
      setImages(data.slice(0, 3))
    })
  }, [])

  const productTemplate = product => {
    return (
      <div className="card">
        <h1>{product.name}</h1>
        <Splitter gutterSize={0} style={{ height: '580px' }}>
          <SplitterPanel className="align-items-right" size={30}>
            <p
              style={{
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                fontSize: '1.3em',
                marginTop: '7em'
              }}
            >
              {product.description} {'\n'} <a href={product.link}>{product.descLink}</a>
            </p>
          </SplitterPanel>
          <SplitterPanel size={70}>
            <div className="product-item">
              <div className="product-item-content">
                <div className="mb-3">
                  <img src={`${product.image}`} alt={product.name} className="product-image" />
                </div>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    )
  }

  return (
    <div className="card justify-content-center">
      <Carousel
        value={products}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        className="custom-carousel"
        circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
      />
    </div>
  )
}

export default HomePage
