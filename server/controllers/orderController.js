import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'



import { createRequire } from 'module';
import { Console } from 'console'
 const require = createRequire(import.meta.url);
 const Razorpay = require('razorpay');
const crypto = require("crypto");
const express = require('express');
import dotenv from 'dotenv'
dotenv.config();
const router = express.Router();
 const rzpKey = process.env.REACT_APP_RZP_KEY_ID;
 const secret = process.env.RAZORPAY_API_SECRET;
const currency = 'INR';

const razorpay = new Razorpay({
    key_id: process.env.REACT_APP_RZP_KEY_ID,
    key_secret: secret
});

// const razorpay = new Razorpay({
// 	key_id: 'rzp_test_uGoq5ABJztRAhk',
// 	key_secret: 'FySe2f5fie9hij1a5s6clk9B'
// });

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async(req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if(orderItems && orderItems.length ===0){
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        })
       // const createdOrder = await order.save()
       const options = {
		amount: totalPrice * 100,
		currency:"INR",
		receipt: "shortid.generate()"
	}
        try {
            const response = await razorpay.orders.create(options);
            order.razorpayid=response.id;
            console.log(response)
            // res.json({
            //     id: response.id,
            //     currency: "INR",
            //     amount: response.totalPrice
            // })
            
        } catch (error) {
            console.log(error)
        }
       
        const createdOrder = await order.save();

        res.status(201).json(createdOrder)
    }
})


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async(req, res) => {
    
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order){
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    
    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_id,
            email_address: req.body.payer.email_address
        }

        updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
  
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
  
      const updatedOrder = await order.save()
  
      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })

// @desc    Get logged in user orders  
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async(req, res) => {  
    const orders = await Order.find({user: req.user._id})
    res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async(req, res) => {  
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

export { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders }