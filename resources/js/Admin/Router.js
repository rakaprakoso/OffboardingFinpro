import { React, useEffect } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";

// import NotFound from './pages/NotFound';

// import Home from './pages/Admin/Home'
// import About from './pages/About'
// import Shop from './pages/Shop'
// import Contact from './pages/Contact'
// import Product from './pages/Ecommerce/Product';
// import {Cart,Checkout} from './pages/Ecommerce/Transactions.module'
import Dashboard from './views/admin/Dashboard'
import Admin from './layouts/Admin'
import AdminMain from './layouts/AdminMain'
import Profile from "./views/Profile.js";
import Landing from "./views/Landing.js";
import ResignForm from './views/ResignForm';

const Main = props => {
    return (
        <>
            {/* <Helmet>
                <link rel="shortcut icon" href="\assets\green-white.png" type="image/x-icon" />
            </Helmet> */}
            <Switch>
                <Route path="/admin/" component={Admin} />
                <Route path="/profile" component={Profile} />
                <Route path="/resignform" exact component={ResignForm} />
                <Route path="/offboarding/:id" component={ResignForm} />
                <Route path="/exitDocument" component={ResignForm} />
                <Route path="/exitClearance" component={ResignForm} />
                <Route path="/" exact component={Landing} />
                {/* <Route path="/admin/product" component={AdminMain}/>
                <Route path="/admin/dashboard" component={Home}/> */}
                {/* <Route path="/about" component={About} />
                <Route path="/shop" component={Shop} />
                <Route path="/product/:slug" component={Product}/>
                <Route path="/cart" component={Cart}/>
                <Route path="/checkout" component={Checkout}/>

                <Route path="/contact" component={Contact}/> */}
                <Route component={NotFound} />
            </Switch>
        </>
    )
};
export default Main;

const NotFound = () => {
    return (
        <div>
            NotFound
        </div>
    )
}
const Home = () => {
    return (
        <div>
            Home
        </div>
    )
}
