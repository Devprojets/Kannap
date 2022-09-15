var itemsSection = document.getElementById("items");
var url = "http://localhost:3000/api/products"

fetch(url)
  .then(response => response.json())
  .then(prouctsDatas => prouctsDatas.map(function(element){
   itemsSection.innerHTML += `
   

   <a href="./product.html?id=${element._id}">
   <article>
     <img src="${element.imageUrl}" alt=${element.altTxt}>
     <h3 class="productName">${element.name}</h3>
     <p class="productDescription">
     ${element.description.slice(0,50)}...
      </p>
   </article>
 </a> 


   `
}));


//PRODUCT PAGE todolist.filter(index => index.id !== action.dataId),

//PRODUCT PAGE todolist.filter(index => index.id !== action.dataId),

const url_ = window.location.href
const strs = url_.split('=');
const product_id = strs.at(-1)

let display_data;
var single_product = document.getElementById("product_display");

fetch(url)
  .then(response => response.json())
  .then(prouctsDatas => prouctsDatas.filter((item) => {
   
    if(item._id === product_id){
        display_data = item
         
        
            setTimeout(() => {
                var color_list = document.getElementById("colors")

                item.colors.forEach((element, index) => {
                    color_list.innerHTML +=  `<option value="${index}">${element}</option>`
                })
            }, 100);
          
    

product_display.innerHTML = `

<article>
<div class="item__img">
  <img src="${display_data.imageUrl}" alt="${display_data.altTxt}"> 
</div>
<div class="item__content">

  <div class="item__content__titlePrice">
    <h1 id="title">${display_data.name}</h1>
    <p>Prix : <span id="price">${display_data.price}</span>€</p>
  </div>

  <div class="item__content__description">
    <p class="item__content__description__title">Description :</p>
    <p id="description">${display_data.description}</p>
  </div>

  <div class="item__content__settings">
    <div class="item__content__settings__color">
      <label for="color-select">Choisir une couleur :</label>
      <select name="color-select" id="colors">

         
         


      </select>
    </div>

    <div class="item__content__settings__quantity">
      <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
      <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
    </div>
  </div>

  <div class="item__content__addButton">
    <button id="addToCart">Ajouter au panier</button>
  </div>

</div>
</article>


`;

    } 
       
       
}))


/* card page */
var basketDataDisplay = document.getElementById("cart__items");
let basketData

fetch(url)
  .then(response => response.json())
  .then(prouctsDatas => prouctsDatas.filter((item) => {

    basketData = item
   
  var basketItemsStorage= localStorage.getItem('basketItemId')
  var basketDatasStorage = localStorage.getItem('basketDataItems')

  var datason = JSON.parse(basketDatasStorage)
  datason.filter((item2) => {   
  var  item_id_ = item2.id
  if(item_id_.includes(item._id)){

    
    basketDataDisplay.innerHTML += `

    <article class="cart__item" data-id="${item._id}" data-color="{product-color}">
    <div class="cart__item__img">
      <img src="${basketData.imageUrl}" alt="${item.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${basketData.name}</h2>
        <p>${item2.color}</p>
        <p>${basketData.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté :${item2.productNumber} </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item2.productNumber}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
    </article> 
    
    
    `;
    

  }
  })


  
       
}))







/* add to card */



if(localStorage.getItem('basketItemId') == null){
  localStorage.setItem('basketItemId', '[]'); 

}


if(localStorage.getItem('basketDataItems') == null){
  localStorage.setItem('basketDataItems', '[]'); 

} 



let url2 = "http://localhost:3000/api/products/order"
setTimeout(function(){
  var addToCart = document.getElementById("addToCart");
  addToCart.addEventListener("click", function(){



  
   


    
      var colors_selected = document.getElementById("colors")
      var color_selected = colors_selected.options[colors_selected.selectedIndex].text;
      var quantity_selected = document.getElementById("quantity").value 
      var ItemPrice = document.getElementById("price").innerHTML 

    
     var oldBasketItemId = JSON.parse(localStorage.getItem("basketItemId")); 
     var oldbasketDataItems = JSON.parse(localStorage.getItem("basketDataItems")); 


     if (oldBasketItemId.includes(product_id) === false){
     


        oldBasketItemId.push(product_id);
        oldbasketDataItems.push({"color":color_selected, "productNumber": quantity_selected, "id":product_id});
        

        alert("Le produit a ete ajoute au panier")
      }else{
        alert("Le produit existe deja dans le panier")

      }
    
     localStorage.setItem('basketItemId', JSON.stringify(oldBasketItemId));
     localStorage.setItem('basketDataItems', JSON.stringify(oldbasketDataItems));
  
    
   


  })
}, 2000)



/*  commander */
let order_url = "http://localhost:3000/api/products/order"
setTimeout(function(){
  var order = document.getElementById("order");
  order.addEventListener("click", function(e){



e.preventDefault()
    /*get input and user data*/
    var user_firstName = document.getElementById("firstName").value
    var user_lastName = document.getElementById("lastName").value
    var user_address = document.getElementById("address").value
    var user_city = document.getElementById("city").value
    var user_email = document.getElementById("email").value

    

/* convert the data structure into the required structure at the backend (post)*/
    var basketItemsStorage_ = localStorage.getItem('basketItemId')
   /* var array_item = ["a6ec5b49bd164d7fbe10f37b6363f9fb","415b7cacb65d43b2b5c1ff70f3393ad1","034707184e8e4eefb46400b5a3774b5f"] */
    var array_item2 = basketItemsStorage_.replace(/\\/g, '')
    var array_item3 = array_item2.replace(/\"/g, '') 
    var array_item4 = array_item3.replace(/\[/g, '')
    var array_item5 = array_item4.replace(/\]/g, '')

   
    console.log("array_item 5:" + array_item5) 



    let  payload =  {contact: {
      firstName: user_firstName,
      lastName: user_lastName,
      address: user_address,
      city: user_city,
      email: user_email
    },
    
  }
  let stringifyedPayload_;



  stringifyedPayload_=payload
  stringifyedPayload_.products = array_item5.split(/[.,!,?,;,...]/);
  console.log(stringifyedPayload_)
 



    let options = {
      method : "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
      body: JSON.stringify(stringifyedPayload_)
     
    }
  fetch(order_url, options).then((res) => {
    return res.json();
})
.then((data) =>{  


  
    //validation form
    
      if( user_firstName == ""){ 

        alert("Veuillez entrer votre nom")
        }else if(user_lastName == ""){
      
          alert("Veuillez entrer votre prenom")
        }else if(user_address == ""){
      
          alert("Veuillez entrer votre adresse")
        }else if(user_city == ""){
      
          alert("Veuillez entrer votre ville")
        }else if(user_email == ""){
      
          alert("Veuillez entrer votre mail")
        }else{
        
    window.location.href = "../html/confirmation.html?order-id=" + data.orderId;
    localStorage.clear();
  
      
        
        }

  


  console.log(data)
});
  


  })
}, 1000)



/*display the order id of confirmation */

setTimeout(function(){
  document.getElementById("orderId").innerHTML = product_id

},1000)
 


/* total to pay */


let total = 0

let setItem_filter;
let new_prices_array = []

fetch(url)
  .then(response => response.json())
  .then(prouctsDatas => prouctsDatas.filter((item) => {

    setItem_filter = item
   
  var basketItemsStorage= localStorage.getItem('basketItemId')
  var basketDatasStorage = localStorage.getItem('basketDataItems')

  var datason = JSON.parse(basketDatasStorage)
  datason.filter((item2) => {   
  var  item_id_ = item2.id
  if(item_id_.includes(item._id)){

    new_prices_array.push(setItem_filter)

    console.log(new_prices_array)
    var RetracttotalPay = JSON.parse(localStorage.getItem("basketDataItems")); 
    var total_paybasket =  new_prices_array.map((bill) =>  parseInt(bill.price * item2.productNumber)).reduce((acc, amount) => acc + amount)



    console.log("why notttt??" + parseInt(total_paybasket))
    document.getElementById("totalPrice").innerHTML = total_paybasket
document.getElementById("totalQuantity").innerHTML = new_prices_array.length
  }
  })


  
       
}))










/*
var RetracttotalPay = JSON.parse(localStorage.getItem("basketDataItems"));
var total_pay = RetracttotalPay.map(bill =>  parseInt(bill.price * bill.productNumber)).reduce((acc, amount) => acc + amount);

console.log("to pay  :  "  + parseInt(total_pay))
document.getElementById("totalPrice").innerHTML = total_pay
document.getElementById("totalQuantity").innerHTML = RetracttotalPay.length

*/


//delete product from basket
setTimeout(function(){
  var deletProductBtn = document.getElementsByClassName("deleteItem")
  for(i = 0; i < deletProductBtn.length; i++){

    deletProductBtn[i].addEventListener("click", function(event){
   
      
       
      
     var getOldBasketItemId = JSON.parse(localStorage.getItem("basketItemId")); 
     var getOldbasketDataItems = JSON.parse(localStorage.getItem("basketDataItems")); 

     var rest_basketItemId = getOldBasketItemId.filter((data) => {
      var data_set_delete = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id")

             return data !== data_set_delete
     })

var rest_getOldbasketDataItems = getOldbasketDataItems.filter((data) => {
  var data_set_delete = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id")

         return data.id !== data_set_delete
 })




     localStorage.setItem('basketItemId', JSON.stringify(rest_basketItemId));
     localStorage.setItem('basketDataItems', JSON.stringify(rest_getOldbasketDataItems));


     window.location.href = "../html/cart.html"
       })
     

  }
  

},4000)
