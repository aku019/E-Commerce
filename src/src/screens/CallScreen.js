import React from "react";
import {getUserDetails, updateUserProfile} from '../actions/userActions';
import {useDispatch, useSelector} from 'react-redux'

const axios = require('axios');

const CallScreen = () => {
   
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin;

    console.log(userInfo);




    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");
myHeaders.append("x-api-key", "AlZrlnRSbZ7l3l8YBIkT42WHwMavi84z2pydzX2G");
myHeaders.append("Authorization", "339f82d8-45f5-4807-8d4d-5e4497fe7bc1");

var raw = JSON.stringify({
  "k_number": "+919986734558",
  "agent_number": "+919903840588",
  "customer_number": userInfo.phone,
  "caller_id": ""
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://kpi.knowlarity.com/Basic/v1/account/call/makecall", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
    //  fetch('http://localhost:5000/api/users/call')
    // // fetch('https://api.publicapis.org/entries')
    // .then(data => data.json());
  return (
    <section className="section">
      <div className="container">
        <div className="has-text-centered">
          <h1 className='text-center py-3'>Thank you for opting in, we will call you shortly!</h1>
          <p>
           Hi, We have registered your request. You can expect call any minute.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallScreen;