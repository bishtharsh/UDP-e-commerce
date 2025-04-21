import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';
import ROUTES from '../../../navigations/Routes';

function AllOrder() {
    const Swal = require('sweetalert2');
    const [token] = useState(localStorage.getItem('token'));
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [profile, setProfile] = useState([]);
    const [details, setDetails] = useState({});
    const [selectedProduct, setSelectedProduct] = useState("");
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
    });

    useEffect(() => {
        Profile();
        if(profile.role === "admin")
        {
            GetAllOrderHeader();
        }
    }, [profile]);
    
    function Profile() {
        axios.get("http://localhost:8081/profile?id="+token).then((d) => {
          setProfile(d.data.userData);
        });
    }

    function GetAllOrderHeader() {
        try {
            axios.get("http://localhost:8081/orderHeader").then((d)=>{
                setOrders(d.data.headData);
              });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Fail to get data !!!",
                icon: "error"
            });
        }
    }

    function getOrderDetailsByOrderHeaderId(orderHeaderId) {
        // Avoid calling API repeatedly for the same order
        if (!details[orderHeaderId]) {
            axios
                .get(`http://localhost:8081/orderDetails?id=${orderHeaderId}`)
                .then((d) => {
                    setDetails((prevDetails) => ({
                        ...prevDetails,
                        [orderHeaderId]: d.data.orderData,
                    }));
                })
                .catch(() => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Fail to get data !!!',
                        icon: 'error',
                    });
                });
        }
    }  

    function getProductNames() {
        const productNames = new Set();  // Using a Set to store unique product names
        Object.values(details).forEach(orderDetails => {
            orderDetails.forEach(item => {
                productNames.add(item.product.name);
            });
        });
        return Array.from(productNames); // Convert the Set to an array
    }

    async function deactivateAllSelectedOrders() {
        const filteredOrders = orders.filter((order) => 
            details[order._id]?.some(d => d.product.name === selectedProduct)
        );
    
        if (filteredOrders.length === 0) {
            Toast.fire({
                icon: 'warning',
                title: 'No orders found for this product',
            });
            return;
        }
    
        let deactivatedOrdersCount = 0;  
    
        for (let order of filteredOrders) {
            const { _id, phone, name, active } = order;
    
            
            if (active === true) {
                await orderActive(_id, phone, name);  
                deactivatedOrdersCount++;
            }
        }
    
        if (deactivatedOrdersCount > 0) {
            Toast.fire({
                icon: 'success',
                title: `All orders with ${selectedProduct} have been deactivated.`,
            });
        } else {
            Toast.fire({
                icon: 'info',
                title: `All selected orders are already deactivated.`,
            });
        }
    
        
        if (deactivatedOrdersCount === 0) {
            
            setButtonDisabled(true);
        }
        setTimeout(() => {
            window.location.reload(); 
        }, 3000); 
    }
    


    async function orderActive(id,phone,name){
        try{
          const response = await axios.put("http://localhost:8081/orderHeaderActive?id="+id);
          if(response.data.message === true){
            GetAllOrderHeader();
            Toast.fire({
              icon: "success",
              title: "Order is activated",
            });
            // Send SMS notification
            const message = `Hi ${name}, Your order with ID: ${id} has been activated. Thank you for shopping with us..`;
            
            await axios.post(`http://localhost:8081/sms-send?to=${phone}`, { message });
          }else{
            GetAllOrderHeader();
            Toast.fire({
              icon: "success",
              title: "Order is deactivated",
            });
            const message = `Hi ${name}, Your order with ID: ${id} has been deactivated. If you have any questions, please contact support..`;
            await axios.post(`http://localhost:8081/sms-send?to=${phone}`, { message });
          }
        }catch(error){
          Swal.fire({
            title: "Error",
            text: "Fail to submit data !!!",
            icon: "error"
          });
        } 
    }

    function renderAllOrder(){
        if(!orders){
            return<>
                <div className="row">
                    <tr>
                        <td colSpan="12" style={{textAlign:"center"}}>No Order in My Order</td>
                    </tr>
                </div>
            </>
        }else{
            const filteredData = orders.filter((item) =>
                Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()) &&
                (selectedProduct === "" || details[item._id]?.some(d => d.product.name === selectedProduct))
            );
            return filteredData?.map((item) => {
                const dateString = item.shippingDate;
                const date = new Date(dateString);

                // Format to dd-mm-yyyy using Intl.DateTimeFormat
                const formatter = new Intl.DateTimeFormat('en-GB'); // "en-GB" for day-first format
                const formattedDate = formatter.format(date);
                //
                getOrderDetailsByOrderHeaderId(item._id);
                return<>
                    <div class="card border-dark mb-3 w-100" key={item._id} >
                        <div class="card-header">
                            <div className="row">
                                <h6 className="text-left col-6">Order ID: {item._id}</h6>
                                <span className='text-right col-6'>
                                    <button
                                        className={`btn btn-sm ${item.active===false? `btn-outline-success `: `btn-outline-danger`} `}
                                        onClick={()=>{orderActive(item._id,item.phone,item.name)}}
                                        title={item.active===false?"Activate":"Deactivate"}
                                    >{item.active === false ? "Activate Order" : "Deactivate Order"}</button>
                                </span>
                            </div>
                            <div className='row text-left'>
                                <span className='col-4'>Name: {item.name}</span>
                                <span className='col-4'>Address: {item.address}, {item.city}</span>
                                <span className='col-4'>Phone No. : {item.phone}</span>
                            </div>
                            <div className='row text-left'>
                                <span className='col-4'>Delivery Date: {formattedDate}</span>
                                <span className='col-4'>Payed Amount: ₹ {item.orderTotal}/-</span>
                                <span className='col-4'>Txn Id: {item.transactionId}</span>
                            </div>
                        </div>
                        <div class="card-body text-dark " style={{width:"100%",display:"flex",justifyContent:"center"}}>
                            <table className="table " style={{width:"90%"}}>
                                <thead>
                                    <tr className='row text-left'>
                                        <th className='col-8 '>Product</th>
                                        <th className='col-1'>Price</th>
                                        <th className='col-2'>Quantity</th>
                                        <th className='col-1'>Total</th>    
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderOrderDetail(item._id)}
                                </tbody>
                            </table> 
                        </div>
                    </div>
                </>;
            });
        }   
    }

    function renderOrderDetail(orderHeaderId) {
        const orderDetails = details[orderHeaderId];
        if(!orderDetails){
            return (
                <tr>
                    <td colSpan="12" style={{ textAlign: 'center' }}>No items in this order</td>
                </tr>
            );
        }
        return orderDetails.map((item,index) => {
            const isLastItem = index === orderDetails.length-1;
            return <>
                <tr className='row text-left' key={item.product._id}>
                    <td className='col-8'>
                        <div className='row'> 
                            <div className='col-3'>
                                <img class="card-img-top border" src={"http://localhost:8081/" + item.product.images[0]} alt="Card image cap"  style={{height:"20vh"}} />
                            </div>
                            <div className=''>
                                <h6>{item.product.name}</h6>
                            </div>
                        </div>
                    </td>
                    <td className='col-1 '>
                        <span>₹{item.price}</span>
                    </td>
                    <td className='col-2 '>
                        <span>{item.quantity}</span>
                    </td>
                    <td className='col-1 '>
                        <strong>₹{item.price * item.quantity}</strong>
                    </td>
                </tr>
            </>
            
        });
    }

    return (
        <>
            <Header/>
            <div className='row p-2 m-2'>
                <div className='mx-auto rounded' style={{width:"94%"}}>
                    <div class="card ">
                        <div class="card-header bg-dark text-white">
                            <h5>All Order</h5>
                        </div>
                        <div class="card-body mx-3 row">
                            <div class="input-group mb-3 col-8">
                                <div class="input-group-prepend ">
                                    <span class="input-group-text " style={{
                                    fontWeight: 600,
                                    }}id="basic-addon3">Search</span>
                                </div>
                                <input
                                    id="basic-url" 
                                    type="text"
                                    className='form-control'
                                    placeholder="By Delivery Details..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div class="input-group mb-3 col-4 ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" style={{ fontWeight: 600 }} id="basic-addon3">Filter by Product</span>
                                </div>
                                <select
                                    className="form-control"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                >
                                    <option value="">Select Products</option>
                                    {getProductNames().map((productName, index) => (
                                        <option key={index} value={productName}>{productName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 ">
                                <button 
                                    id="deactivateAllSelectedOrders"
                                    className="btn btn-danger"
                                    onClick={deactivateAllSelectedOrders}
                                    disabled={isButtonDisabled}
                                >
                                    Deactivate All Selected Orders
                                </button>
                            </div>
                        </div>
                        <div class="card-body mx-3 row">
                        {renderAllOrder()}
                        </div>
                        <div class="card-footer bg-dark text-white"> 
                            <h6>Thank you for shopping with us.</h6>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllOrder
