import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import {Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getOrderDetails, payOrder, deliverOrder} from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'
import dotenv from 'dotenv'
const Razorpay = require('razorpay');
dotenv.config();
function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}


const OrderScreen = ({match, history}) => {

    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, loading, error} = orderDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(()=>{

        if(!userInfo){
            history.push('/login')
        }

        const addPayPalScript = async () => {
            // const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            // script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        // addPayPalScript()

        if(!order || successPay || successDeliver ||order._id !== orderId){
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    },[dispatch, order, orderId, successPay, successDeliver, history, userInfo])

    async function displayRazorpay(amt,id,ord) {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		// const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
		// 	t.json()
		// )

		console.log(amt);
        console.log(typeof amt);

		const options = {
			key:  process.env.REACT_APP_RZP_KEY_ID,//'rzp_test_FaUMUiP2fDP9lr' ,
			currency: "INR",//data.currency,
			amount: amt*100,
		    order_id:id,
			name: 'SportsWorld',
			description: 'Thank you',// for nothing. Please give us some money',
			image: '',
            // modal: {
            //     ondismiss: paymentHandlers.onDismiss || (() => {}),
            //     escape: false,
            // },
            // handler: response => {
            //     paymentHandlers.onSuccess &&
            //         paymentHandlers.onSuccess({
            //             ...response,
            //             id: res.orderId,
            //             amount: res.amount,
            //             currency: res.currency,
            //         });
            // },
			handler: function (response) {
				 alert(response.razorpay_payment_id)
				 alert(response.razorpay_order_id)
				 alert(response.razorpay_signature)
                 order.isPaid=true;
                 order.paidAt=Date.now().toLocaleDateString();

                dispatch(payOrder(orderId, true));
			},
			prefill: {
				name:"",
				email: '',
				phone_number: ''
			} 
		}
        //const paymentObject = new Razorpay(options)
		const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
		
	}


    const successPaymentHandler = (paymentResult)=> {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () =>{
        dispatch(deliverOrder(order));
    }

    return loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : 
    <>
        <h1>Order {order._id}</h1>
        <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>

                            <p>
                                <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>

                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>

                            {order.isDelivered ? <Message variant="success">Delivered on {order.deliveredAt}</Message> : <Message variant="danger">Not Delivered</Message>}

                            
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? <Message variant="success">Order Paid</Message> : <Message variant="danger">Not Paid</Message>}
                            {/* {order.paidAt} */}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item, index)=> (
                                        <ListGroup.Item key={item.product}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>₹{order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>₹{order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>₹{order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>₹{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && userInfo._id === order.user._id &&(
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}
                                    {/* {!sdkReady ? <Loader/> : (
                                        <PayPalButton currency="INR" amount={order.totalPrice} onSuccess={successPaymentHandler}/>
                                    )} */}
                                      <Button type="button" className="btn btn-block" onClick={()=>displayRazorpay(order.totalPrice,order.razorpayid,order)}>Pay</Button>
                                </ListGroup.Item>
                                //onClick={displayRazorpay(order.totalPrice)}
                            )}

                            {loadingDeliver && <Loader/>}
                            {userInfo && order.isPaid && userInfo.isAdmin && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type="button" className="btn btn-block" onClick={deliverHandler}>Mark As Delivered</Button>
                                </ListGroup.Item>
                            )} 
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
    </>
}

export default OrderScreen