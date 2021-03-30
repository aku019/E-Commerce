import React from 'react'
import {Link} from 'react-router-dom'
import { Card,Badge } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({product}) => {
    return (
        <Card className="my-3 p-3 rounded" style={{ minHeight: '430px'}}>
            <Link to={`/product/${product._id}`} >
                <Card.Img src={product.image} variant='top'/>
            </Link>

            <Card.Body>
            <Link to={`/product/${product._id}`} >
                <Card.Title as='div' ><strong>{product.name}</strong></Card.Title>
            </Link>

            {product.price === product.offerPrice ? (
          <p>
            <span className="font-weight-bold">
              ₹ {product.price}
            </span>
          </p>
        ) : (
          <p>
            <span className="font-weight-bold">
              ₹ {product.offerprice}
            </span>
            <span className="text-danger ml-3">
              <s>₹ {product.price}</s>
            </span>
            <span className="text-success text-weight-semibold ml-3" style={{fontSize: 10}}>
              {Math.floor(
                ((Number(product.price) - Number(product.offerprice)) /
                  Number(product.price)) *
                  100
              )}
              % off
            </span>
          </p>
          

        )}
          
            <Card.Text as='div'>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </Card.Text>
        

            {/* <Card.Text as='h3'>
                ${product.price}
            </Card.Text> */}

            
         
        <div className="input-group">
        <h7>
        <Badge variant="secondary">{product.category}</Badge>
        
  </h7>
       
        </div>

            </Card.Body>
        </Card>
    )
}

export default Product
