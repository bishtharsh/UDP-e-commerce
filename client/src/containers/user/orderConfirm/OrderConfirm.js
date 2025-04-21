import React from 'react';
import{ useLocation } from 'react-router-dom';
function useQuery(){
  const {search} =useLocation();
  return React.useMemo(()=> new URLSearchParams(search),[search]);
}
function OrderConfirm() {
  const query = useQuery();
  return <>
      <div className="order-confirmation">
        <h1 className='text-center text-success'>Order Confirmation</h1>
        <img src={require("../../../assets/box.gif")} alt='box' className='rounded rounded-circle' style={{width:"300px",height:"300px",alignItems:"center"}}/>
        <p className='text-center'>Thank you for your order!</p>
        <p className='text-center'><strong>Order ID:</strong> {query.get("orderId")}</p>
        <p className='text-center'><strong>Transaction ID:</strong> {query.get("transId")}</p> 
      </div>
  </>
}

export default OrderConfirm
