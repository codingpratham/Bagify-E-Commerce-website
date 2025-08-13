import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Register from "./pages/auth/register"
import Login from "./pages/auth/login"
import Landing from "./pages/user/Landing"
import { ProtectedRoutes } from "./utils/ProtectedRoutes"
import { AdminLanding } from "./pages/admin/Landing"
import Onboarding from "./pages/auth/onBoarded"
import Product from "./pages/admin/Product"
import ProductInfo from "./pages/admin/ProductInfo"
import { OrderPage } from "./pages/user/OrderPage"
import CartPage from "./pages/user/CartPage"
import ProductPage  from "./pages/user/ProductPage"

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <ProtectedRoutes>
              <div>Page Not Found</div>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
        path="/onboard"
        element={
          <Layout>
            <Onboarding/>
          </Layout>
        }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoutes allowedRoles={["USER"]}>
              <Layout>
                <Landing />
              </Layout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/product"
          element={
            <ProtectedRoutes allowedRoles={["USER"]}>
              <Layout>
                <ProductPage />
              </Layout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoutes allowedRoles={["USER"]}>
              <Layout>
                <CartPage />
              </Layout>
            </ProtectedRoutes>
          }
        />  

        <Route
          path="/orders"
          element={
            <ProtectedRoutes allowedRoles={["USER"]}>
              <Layout>
                <OrderPage />
              </Layout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoutes allowedRoles={["ADMIN"]}>
                <AdminLanding />
              </ProtectedRoutes>
            </Layout>
          }
        />

        <Route
          path="/product-info"
          element={
            <Layout>
              <ProtectedRoutes allowedRoles={["ADMIN"]}>
                <ProductInfo />
              </ProtectedRoutes>
            </Layout>
          }
          />

        <Route
          path="/products"
          element={
            <Layout>
              <ProtectedRoutes allowedRoles={["ADMIN"]}>
                <Product />
              </ProtectedRoutes>
            </Layout>
          }
        />
      </Routes>
    </>
  )
}

export default App