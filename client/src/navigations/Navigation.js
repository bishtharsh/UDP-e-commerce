import React from 'react'
import ROUTES from './Routes'
import {BrowserRouter,Routes,Route} from "react-router-dom"


function Navigation() {
  return <>
    <BrowserRouter>
      <Routes>
          <Route path={ROUTES.about.name} element={ROUTES.about.component}/>
          <Route path={ROUTES.contact.name} element={ROUTES.contact.component}/>
          <Route path={ROUTES.support.name} element={ROUTES.support.component}/>
          <Route path={ROUTES.login.name} element={ROUTES.login.component}/>
          <Route path={ROUTES.register.name} element={ROUTES.register.component}/>
          <Route path={ROUTES.home.name} element={ROUTES.home.component}/>
          <Route path={ROUTES.departmentAdmin.name} element={ROUTES.departmentAdmin.component}/>
          <Route path={ROUTES.universityAdmin.name} element={ROUTES.universityAdmin.component}/>
          <Route path={ROUTES.productAdmin.name} element={ROUTES.productAdmin.component}/>
          <Route path={ROUTES.userList.name} element={ROUTES.userList.component}/>
          <Route path={ROUTES.departmentUser.name} element={ROUTES.departmentUser.component}/>
          <Route path={ROUTES.productUser.name} element={ROUTES.productUser.component}/>
          <Route path={ROUTES.productDetails.name} element={ROUTES.productDetails.component}/>
          <Route path={ROUTES.shoppingCart.name} element={ROUTES.shoppingCart.component}/>
          <Route path={ROUTES.orderSummary.name} element={ROUTES.orderSummary.component}/>
          <Route path={ROUTES.orderConfirm.name} element={ROUTES.orderConfirm.component}/>
          <Route path={ROUTES.allOrder.name} element={ROUTES.allOrder.component}/>
          <Route path={ROUTES.myOrder.name} element={ROUTES.myOrder.component}/>
          
      </Routes>
    </BrowserRouter>
  </>
}

export default Navigation