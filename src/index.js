// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import LoginPage from './LoginPage';
// import Profile from './Profile';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//         {/* A <Switch> looks through its children <Route>s and
//             renders the first one that matches the current URL. */}
//         <Switch>
//           <Route exact path="/" component={LoginPage} />
//           <Route exact path="/profile" component={Profile} />
//         </Switch>
//     </Router>
//   );
// }

// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );


import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './src/store'
import './src/bootstrap.min.css'
import './src/index.css';
import App from './src/App';
import "./assets/scss/index.scss";

// import reportWebVitals from '.src/reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
