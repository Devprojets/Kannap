
/*display the order id of confirmation */

const url_ = window.location.href
const strs = url_.split('=');
const product_id = strs.at(-1)   


setTimeout(function(){
    document.getElementById("orderId").innerHTML = product_id
  
  },1000)
  