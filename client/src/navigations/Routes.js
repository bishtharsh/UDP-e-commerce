import About from "../containers/about/About";
import Department from "../containers/admin/department/Department";
import Product from "../containers/admin/product/Product";
import University from "../containers/admin/university/University";
import UserList from "../containers/admin/userList/UserList";
import Contact from "../containers/contact/Contact";
import Login from "../containers/login/Login";
import Register from "../containers/register/Register";
import Support from "../containers/support/Support";
import UserDepartment from "../containers/user/department/UserDepartment";
import Home from "../containers/user/home/Home";
import UserProduct from "../containers/user/product/UserProduct";
import ProductDetails from "../containers/user/productDetails/ProductDetails";
import ShoppingCart from "../containers/user/shoppingCart/ShoppingCart";
import OrderSummary from "../containers/user/orderSummary/OrderSummary";
import OrderConfirm from "../containers/user/orderConfirm/OrderConfirm";
import AllOrder from "../containers/admin/allOrder/AllOrder";
import MyOrder from "../containers/user/myOrder/MyOrder";


const ROUTES = {
    about:{
        name:"/about",
        component:<About/>,
    },
    contact:{
        name:"/contact",
        component:<Contact/>,
    }, 
    support:{
        name:"/support",
        component:<Support/>,
    },
    login:{
        name:"/login",
        component:<Login/>,
    },
    register:{
        name:"/register",
        component:<Register/>,
    },
    universityAdmin:{
        name:"/universityAdmin",
        component:<University/>,
    },
    departmentAdmin:{
        name:"/departmentAdmin",
        component:<Department/>,
    },
    productAdmin:{
        name:"/productAdmin",
        component:<Product/>,
    },
    userList:{
        name:"/userList",
        component:<UserList/>,
    },
    home:{
        name:"/",
        component:<Home/>,
    },
    departmentUser:{
        name:"/departmentUser",
        component:<UserDepartment/>,
    },
    productUser:{
        name:"/productUser",
        component:<UserProduct/>,
    },
    productDetails:{
        name:"/productDetails",
        component:<ProductDetails/>,
    }, 
    shoppingCart:{
        name:"/shoppingCart",
        component:<ShoppingCart/>,
    },
    orderSummary:{
        name:"/orderSummary",
        component:<OrderSummary/>,
    },
    orderConfirm:{
        name:"/orderConfirm",
        component:<OrderConfirm/>,
    },
    myOrder:{
        name:"/myOrder",
        component:<MyOrder/>,
    },
    allOrder:{
        name:"/allOrder",
        component:<AllOrder/>,
    },
    
};

export default ROUTES;