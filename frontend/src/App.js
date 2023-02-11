import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webfont from "webfontloader";
import React, { useState } from "react";
import Home from "./component/Home/Home";
import Footer from "./component/layout/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Header from "./component/layout/Header";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import NotFound from "./component/layout/NotFound/NotFound";

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  const getStripeApiKey = async () => {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  };

  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/products/:keyword" element={<Products />} />
        <Route exact path="/Login" element={<LoginSignUp />} />
        <Route
          exact
          path="/account"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/me/update"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/password/update"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route exact path="/cart" element={<Cart />} />

        <Route
          exact
          path="/shipping"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <Shipping />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/order/confirm"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />

        {stripeApiKey && (
          <Route
            exact
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            }
          />
        )}

        <Route
          exact
          path="/success"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/orders"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/order/:id"
          element={
            <ProtectedRoute isAuth={isAuthenticated} loading={loading}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/*  admin authorizatable protected route */}

        <Route
          exact
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/products"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/product"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <NewProduct />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/product/:id"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/orders"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <OrderList />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/order/:id"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <ProcessOrder />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/users"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/user/:id"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <UpdateUser />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/reviews"
          element={
            <ProtectedRoute
              isAuth={isAuthenticated}
              loading={loading}
              user={user}
            >
              <ProductReviews />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
