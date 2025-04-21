import React, { useEffect, useState }  from 'react'
import Header from '../../../components/Header'
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';
import ROUTES from '../../../navigations/Routes';

function ShoppingCart() {
    const Swal = require('sweetalert2');
    const [token] = useState(localStorage.getItem('token'));
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");


    useEffect(()=>{
        getItemsByUserId();
    },[]);

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

    async function addItem(id,proId){
        try {
            let d = await axios.put("http://localhost:8081/shoppingCart?id="+id+"&action=increment");
            let c = await axios.put("http://localhost:8081/updateProductQyt?id="+proId+"&qyt=1");
            if(c.data.status === "success"){
                if (d.data.status === 'success') {
                    Toast.fire({
                        icon: "success",
                        title: d.data.message,
                    });
                    getItemsByUserId();
                }else{
                    Toast.fire({
                        icon: "error",
                        title: d.data.message,
                    });
                }  
            }else{
                Toast.fire({
                    icon: "error",
                    title: c.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Fail to get data !!!",
                icon: "error"
            });
        }
    }

    async function minusItem(id,proId){
        try {
            let d = await axios.put("http://localhost:8081/shoppingCart?id="+id+"&action=decrement");
            let c = await axios.put("http://localhost:8081/updateProductQyt?id="+proId+"&qyt=-1");
            if(c.data.status === "success"){
                if (d.data.status === 'success') {
                    Toast.fire({
                    icon: "success",
                    title: d.data.message,
                    });
                    getItemsByUserId();
                }else{
                    Toast.fire({
                    icon: "error",
                    title: d.data.message,
                    });
                }  
            }else{
                Toast.fire({
                    icon: "error",
                    title: c.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Fail to get data !!!",
                icon: "error"
            });
        }
    }
    function checkInOut(id){
        try {
            axios.put(`http://localhost:8081/shoppingCarta?id=${id}`).then((d)=>{
                getItemsByUserId();
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Fail to get data !!!",
                icon: "error"
            }); 
        }
    }

    async function removeItem(id,proId,quantity)
    {
        try {
            let d = await axios.delete("http://localhost:8081/shoppingCart?id="+id);
            let c = await axios.put("http://localhost:8081/updateProductQyt?id="+proId+"&qyt=-"+quantity);
            if(c.data.status === "success"){
                if (d.data.status == 'success') {
                    Toast.fire({
                    icon: "success",
                    title: d.data.message,
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }else{
                    Toast.fire({
                    icon: "error",
                    title: d.data.message,
                    });
                } 
            }else{
                Toast.fire({
                    icon: "error",
                    title: c.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Fail to get data !!!",
                icon: "error"
            });
        }
    }

    function renderCart(){
        if(cart == 0){
            return<>
                <tbody>
                    <tr>
                        <td colSpan="4" style={{textAlign:"center"}}>No items in cart</td>
                    </tr>
                </tbody>
                <tfoot className='row ' style={{borderTop:"2.5px solid rgb(209, 209, 209)",paddingTop:"10px"}}>
                    <div className='col-9 w-100'></div>
                    <div className='col-3'>
                        <div className=''>
                            <div className='row'>
                                <div className='col-8'>
                                    <h5>Subtotal</h5>
                                </div>
                                <div className='text-right col-4'>
                                    <h5 className=''>₹0</h5>
                                </div>
                            </div>
                            <span style={{color: "#a1a1a1",fontSize:"12.6px"}}>Taxes and shipping calculated at checkout</span>
                        </div>
                        <div>
                            <button className='btn btn-primary' disabled style={{width:"100%",}} title='Check Out'>Check Out</button>
                        </div>
                        <div className='mt-2'>
                            <a style={{cursor:"pointer",textDecoration:"none",color: "#a1a1a1"}} onClick={()=>{navigate(ROUTES.home.name)}} title='Continue Shopping'><i class="fa-solid fa-arrow-left " style={{color: "#a1a1a1"}}></i> Continue Shopping
                            </a>
                        </div> 
                    </div>
                </tfoot>
            </>;
        }else{ // Filter
            const filteredData = cart.filter((item) =>
                Object.values(item.product).join(" ").toLowerCase().includes(search.toLowerCase())
            ); 
            const total = cart.filter(item => item.active === true).reduce((sum, item) => sum + item.price * item.quantity, 0);
            return filteredData?.map((item, index) => {
                const isLastItem = index === filteredData.length - 1;
                return(
                    <>
                        <tbody className=''>
                            <tr className='row'>
                                <td className='col-8 '>
                                    <div className='row'>
                                        <div className='col-1'>
                                            <input type='checkbox' onClick={()=>{checkInOut(item._id)}}  checked={item.active === true} />
                                        </div>
                                        <div className='col-3'>
                                            <img class="card-img-top border" src={"http://localhost:8081/" + item.product.images[0]} alt="Card image cap"  style={{height:"23vh"}} />
                                        </div>
                                        <div className=''>
                                            <h6>{item.product.name}</h6>
                                            <a className='text-danger' style={{cursor:"pointer",textDecoration:"none"}} onClick={()=>{removeItem(item._id,item.product._id,item.quantity)}}>Remove</a>
                                        </div>
                                    </div>
                                </td>
                                <td className='col-1 '>
                                    <span>₹{item.price}</span>
                                </td>
                                <td className='col-2 '>
                                    <div class="input-group w-75">
                                        <div class="input-group-prepend">
                                            <button class="btn btn-outline-secondary" type="button" onClick={()=>{addItem(item._id,item.product._id)}} ><i class="fas fa-plus"></i></button>
                                        </div>
                                        <input type="text" class="form-control text-center" style={{paddingInlineStart:".65rem",fontWeight:"bold",background:"white",borderColor:"#6c757d"}}  value={item.quantity} aria-describedby="basic-addon1" readOnly/>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={()=>{minusItem(item._id,item.product._id)}}><i class="fas fa-minus"></i></button>
                                        </div>
                                    </div>
                                </td>
                                <td className='col-1 '>
                                    <strong>₹{item.price * item.quantity}</strong>
                                </td>
                            </tr>
                        </tbody>
                        {isLastItem &&(
                            <tfoot className='row ' style={{borderTop:"2.5px solid rgb(209, 209, 209)",paddingTop:"10px"}}>
                                <div className='col-9 w-100'></div>
                                <div className='col-3'>
                                    <div className=''>
                                        <div className='row'>
                                            <div className='col-8'>
                                                <h5>Subtotal</h5>
                                            </div>
                                            <div className='text-right col-4'>
                                                <h5 className=''>₹{total||0}</h5>
                                            </div>
                                        </div>
                                        <span style={{color: "#a1a1a1",fontSize:"12.6px"}}>Taxes and shipping calculated at checkout</span>
                                    </div>
                                    <div>
                                        <button className='btn btn-primary ' style={{width:"100%",}} title='Place Order' onClick={()=>{navigate(ROUTES.orderSummary.name)}}>Place Order</button>
                                    </div>
                                    <div className='mt-2'>
                                        <a style={{cursor:"pointer",textDecoration:"none",color: "#a1a1a1"}} onClick={()=>{navigate(ROUTES.home.name)}} title='Continue Shopping'><i class="fa-solid fa-arrow-left " style={{color: "#a1a1a1"}}></i> Continue Shopping
                                        </a>
                                    </div> 
                                </div>
                            </tfoot> 
                        )}
                        
                    </>   
                );
            });
        }
    }
  return <>
    <Header/> 
    <div className='row p-2 m-2'>
        <div className='mx-auto rounded' style={{width:"90%"}}>
            <div class="card ">
                <div class="card-header bg-dark text-white">
                    <h5 >Shopping Cart</h5>
                </div>
                <div class="card-body mx-3 row">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend ">
                            <span class="input-group-text " style={{
                            fontWeight: 600,
                            }}id="basic-addon3">Search</span>
                        </div>
                        <input
                            id="basic-url" 
                            type="text"
                            className='form-control'
                            placeholder="Cart item Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <table className="table text-left " >
                        <thead>
                            <tr className='row'>
                                <th className='col-8 '>Product</th>
                                <th className='col-1'>Price</th>
                                <th className='col-2'>Quantity</th>
                                <th className='col-1'>Total</th>    
                            </tr>
                        </thead>
                        {renderCart()}
                    </table>
                    
                </div>
                <div class="card-footer bg-dark text-white"> 
                    <h6 >Thank you for shopping with us.</h6>
                </div>
            </div>   
        </div>
    </div>     
  </>
}

export default ShoppingCart
