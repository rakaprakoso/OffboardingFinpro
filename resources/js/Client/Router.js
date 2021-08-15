import { React,useEffect } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import {Helmet} from "react-helmet";

import Header from './components/Header';
import Footer1 from './components/Footer/Footer1';
import NotFound from './pages/NotFound';

import Home from './pages/Home'
import ResignForm from './pages/ResignForm';
// import About from './pages/About'
// import Shop from './pages/Shop'
// import Contact from './pages/Contact'
// import Product from './pages/Ecommerce/Product';
// import {Cart,Checkout} from './pages/Ecommerce/Transactions.module'
// import Order from './pages/Ecommerce/Order';

const Main = props => {
    return (
        <>
            <Helmet>

                <link rel="shortcut icon" href="\assets\green-white.png" type="image/x-icon" />
            </Helmet>
            <div id="header">
                <Header />
            </div>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/resignform" component={ResignForm} />
                {/* <Route path="/about" component={About} />
                <Route path="/shop" component={Shop} />
                <Route path="/product/:slug" component={Product}/>
                <Route path="/cart" component={Cart}/>
                <Route path="/checkout" component={Checkout}/>
                <Route path="/order" component={Order}/>

                <Route path="/contact" component={Contact}/> */}
                <Route component={NotFound} />
            </Switch>
            <Footer1 />
        </>
    )
};
export default Main;
