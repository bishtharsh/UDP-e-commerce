import React, { useEffect, useState }  from 'react'
import Header from '../../../components/Header'
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';

function MyOrder() {
    const Swal = require('sweetalert2');
    const [token] = useState(localStorage.getItem('token'));
    const [orders, setOrders] = useState([]);
    const [details, setDetails] = useState({});
    const [search, setSearch] = useState("");
    const [profile, setProfile] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(()=>{
        Profile();
        if(profile.role === "user")
        {
            getOrderHeaderByUserId();
            getItemsByUserId();
        }
    }, [profile]);
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

    function Profile() {
        axios.get("http://localhost:8081/profile?id="+token).then((d) => {
          setProfile(d.data.userData);
        });
    }

    function getItemsByUserId(){
        try {
            axios.get("http://localhost:8081/shoppingCart?id="+token).then((d)=>{
                setCart(d.data.cartData);
              });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Fail to get data !!!",
                icon: "error"
            });
        }
    }
    

    function getOrderHeaderByUserId(){
        try {
            axios.get("http://localhost:8081/orderHeaderUser?id="+token).then((d)=>{
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
    
    function handleReorder(orderHeaderId) {
        const reorderedItems = details[orderHeaderId]; // Get the items to reorder
        reorderedItems.forEach((reItem) => {
            const existingProductIndex = cart.findIndex((item) => item.product._id === reItem.product._id);
    
            // Prepare the form for adding to the cart
            const formData = {
                user: profile._id,
                product: reItem.product._id,
                quantity: 1,
                price: reItem.product.price
            };
    
            if (existingProductIndex >= 0) {
                // If the product already exists in the cart, increment its quantity
                const cartItem = cart[existingProductIndex];
                axios.put(`http://localhost:8081/shoppingCart?id=${cartItem._id}&action=increment`)
                    .then(() => {
                        // Update the product quantity in the inventory
                        axios.put(`http://localhost:8081/updateProductQyt?id=${reItem.product._id}&qyt=${reItem.quantity}`);
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Failed to update cart.',
                            icon: 'error'
                        });
                    });
            } else {
                // If the product does not exist in the cart, add it to the cart
                axios.post("http://localhost:8081/shoppingCart", formData)
                    .then(() => {
                        // Update the product quantity in the inventory
                        axios.put(`http://localhost:8081/updateProductQyt?id=${reItem.product._id}&qyt=${reItem.quantity}`);
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Failed to add product to the cart.',
                            icon: 'error'
                        });
                    });
            }
            Toast.fire({
                icon: "success",
                title: "Re-Order Add in Shopping Cart.",
            });
            setTimeout(() => {
                window.location.reload(); 
            }, 2000);
        });
    }

    function renderMyOrder(){
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
                Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
            );
            return filteredData?.map((item) => {
                const dateString = item.shippingDate;
                const date = new Date(dateString);

                // Format to dd-mm-yyyy using Intl.DateTimeFormat
                const formatter = new Intl.DateTimeFormat('en-GB'); // "en-GB" for day-first format
                const formattedDate = formatter.format(date);
                
                getOrderDetailsByOrderHeaderId(item._id);
                return<>
                    <div className="card border-dark mb-3 w-100" key={item._id} >
                        <div className="card-header">
                            <div className="row">
                                <h6 className="text-left col-6">Order ID: {item._id}</h6>
                                {item.active ? (
                                        <span className="text-right col-6">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleReorder(item._id)}>Re-Order</button>
                                        </span>
                                    ) : (
                                        <span className="text-right col-6">
                                            <button className="btn btn-sm btn-outline-secondary" disabled>Order Deactivated</button>
                                        </span>
                                    )
                                }
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
                        <div className="card-body text-dark " style={{width:"100%",display:"flex",justifyContent:"center"}}>
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
                                <img className="card-img-top border" src={"http://localhost:8081/" + item.product.images[0]} alt="Card image cap"  style={{height:"20vh"}} />
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
                    <div className="card ">
                        <div className="card-header bg-dark text-white">
                            <h5>My Order</h5>
                        </div>
                        <div className="card-body mx-3 row">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend ">
                                    <span className="input-group-text " style={{
                                    fontWeight: 600,
                                    }}id="basic-addon3">Search</span>
                                </div>
                                <input
                                    id="basic-url" 
                                    type="text"
                                    className='form-control'
                                    placeholder="By Delivery Details.."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-body mx-3 row">
                            {renderMyOrder()}
                        </div>
                        <div className="card-footer bg-dark text-white"> 
                            <h6>Thank you for shopping with us.</h6>
                        </div>
                    </div>
                </div>
            </div>                    
        </>
    )
}

export default MyOrder
