const itemsSection = document.getElementById("items");
const url = "https://projet5.onrender.com/api/products"
let productsDatas=[]
let cartItems = JSON.parse(localStorage.getItem('cartItems')||'[]')

fetch(url)
.then(res=> res.json())
.then(data=>display_Data(data))


function display_Data(data=productsDatas){
    const sectionCardItems = document.getElementById("cart__items");
    if(data!==[])productsDatas=data
  //si data n'est pas vide//
    
    productsDatas.forEach(elem => {
        if(cartItems.some((item)=>item.id===elem._id)){
            let items=cartItems.filter(item=>item.id==elem._id)
        console.log(items)
            //index position du ponier//
            let index=cartItems.findIndex(item=>item.id==elem._id)
         items.forEach(item=>{
            sectionCardItems.innerHTML+= `<article class="cart__item" data-id="${elem._id}" data-color="${item.color}">
            <div class="cart__item__img">
              <img src="${elem.imageUrl}" alt="${elem.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${elem.name}</h2>
                <p>${item.color}</p>
                <p>${elem.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté :${item.qty} </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qty}"  data-id="${index}" onchange="addQty(${index})">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem" onclick="removeItems('${item.id}','${item.color}')">Supprimer</p>
                </div>
              </div>
            </div>
            </article> 
            `
         })
           
        }})


       document.querySelectorAll(`.itemQuantity`).forEach(elm=>{
        elm.oninput=function(){
            var max = parseInt(this.max);

              if (parseInt(this.value) > max) {
                  this.value = max; 
              }
          }
       })
        
        
       displayTotalToPay(productsDatas) 
      
}

function displayTotalToPay(productsDatas) {
            let total=0;
            let nbItems=0;
            console.log(cartItems.map(item=>item.qty))
            productsDatas.forEach(elem => {
                if(cartItems.some((item)=>item.id===elem._id)){
                    let i=cartItems.map(item=>item.qty)
                    let totalQty= i.reduce((acc,curr)=>acc+curr)
                    total+=elem.price*Number(totalQty)
                    nbItems+=Number(totalQty)
                    document.getElementById("totalPrice").innerHTML = total
                    document.getElementById("totalQuantity").innerHTML = nbItems
                }
                
            });
}

function addQty(index){


    let val=document.querySelector(`[data-id="${index}"]`).value;

    if(val>100)document.querySelector(`[data-id="${index}"]`).value=100;
    cartItems[index].qty=val
    localStorage.setItem('cartItems',JSON.stringify(cartItems))

     updateDisplay()  
}

function removeItems(id,color){
    cartItems=cartItems.filter((item=>item.id ==id && item.color!==color||item.id !==id))
   localStorage.setItem('cartItems',JSON.stringify(cartItems))
    updateDisplay()  
   
}

function updateDisplay(){
    const sectionCardItems = document.getElementById("cart__items");
    sectionCardItems.innerHTML=''
    document.getElementById("totalPrice").innerHTML=""
    document.getElementById("totalQuantity").innerHTML = ""
    display_Data(productsDatas)
}

/*  commander */
let order_url = "http://localhost:3000/api/products/order"
window.addEventListener('load', function() {
    const order = document.getElementById("order");
  
   

    order.addEventListener("click", function(e) {



        e.preventDefault()
        /*get input and user data*/
        const user_firstName = document.getElementById("firstName")
        const user_lastName = document.getElementById("lastName")
        const user_address = document.getElementById("address")
        const user_city = document.getElementById("city")
        const user_email = document.getElementById("email")

        /* convertir la structure de la data a envoyer dans le back-end (post)*/
        


        const cartItemsId=cartItems.map(({id})=>(id))
        console.log(cartItemsId)
    if(cartItemsId.length==0){
        document.querySelector('#orderErrorMsg').innerHTML='Veuillez ajoutez un produit au panier';
        return
    }
        let payload = {
            contact: {
                firstName: user_firstName,
                lastName: user_lastName,
                address: user_address,
                city: user_city,
                email: user_email
            },

        }

      
        payload.products = cartItemsId
        

        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)

        }
        fetch(order_url, options).then((res) => {
                return res.json();
            })
            .then((data) => {
           
                function validateEmail_(email) 
                {
                    if(email.indexOf('@') > 0){
                       return true
                    }else{
                        return false
                    }

               }
               
                if (cartItemsId.length>0 && (user_firstName)&& validateName(user_lastName) && user_address!=='' && validateName(user_city) && validateEmail(user_email)) {

                     window.location.href = "../html/confirmation.html?order-id=" + data.orderId;
                    localStorage.clear(); 
                }
                
            });
    }) 
})

function validateName(v){
    const tError=document.getElementById(`${v.name}ErrorMsg`)
   console.log(v)
   
    
    if(!(/^(([A-za-z]+[\s]{1}[A-za-z]+)|([A-Za-z]+))$/gi.test(v.value))){
       tError.innerHTML = `Veuillez rentrer un ${v.name} valide`
       if (v.value.length < 1) return true;
       return false
    }else{
        tError.innerHTML = ""
        return true
    }
  
    return false
  }


  function validStreetAddress(v){
    const tError=document.getElementById(`${v.name}ErrorMsg`)
   
   
    
    if(!(/\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Rue|Boulevard|Drive|Street|Ave|Bd|Dr|Rd|Blvd|Ln|St)\.?,\s(?:[A-Z][a-z.-]+[ ]?)+ \b\d{5}(?:-\d{4})?\b/gi.test(v.value))){
       tError.innerHTML = `Veuillez rentrer un ${v.name} valide`
       if (v.value.length <= 1) return false;
       return false
    }else{
        tError.innerHTML = ""
        return true
    }
  
    return false
  }
  function validateEmail(v){
    const tError=document.getElementById(`${v.name}ErrorMsg`)

  
    if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v.value))){
        tError.innerHTML = "Veuillez rentrer un email valide"
        if (v.value.length <= 1) return false;
        return false
    }
    else{
        tError.innerHTML = ""
        return true
    }
}

