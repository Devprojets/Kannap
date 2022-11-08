/* const itemsSection = document.getElementById("items");*/
const url = "https://projet5.onrender.com/" 


//recupere l'url de la page
const urlPage = window.location.href

//découpage de l'url //
const strs = urlPage.split('id=');

//recupere l'id dans le tableau split
const product_id = strs[1]

let display_data;
const single_product = document.getElementById("product_display");

let uniqueProduct = url + product_id

fetch(uniqueProduct)
    .then(response => response.json())
    .then(productData => {

      //verifie si le productData est bien celui voulu
        if (productData._id === product_id) {

            display_data = productData


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
                  <input type="number" name="itemQuantity" min="1" max="100"  id="quantity" value="1" oninput="checkQty">
                 
                </div>
              </div>

              <div class="item__content__addButton">
                <button id="addToCart">Ajouter au panier</button>
              </div>

            </div>
            </article>


            `;
            document.querySelector(`#quantity`).oninput=function(){
              var max = parseInt(this.max);
              if(parseInt(this.value)==0){
               
                this.value=1
              }
             
                if (parseInt(this.value) > max) {
                    this.value = max; 
                }
            }
      
              const color_list = document.getElementById("colors")

              //parcous chaque couleur dispo du produit
              productData.colors.forEach((element, index) => {
                  color_list.innerHTML += `<option value="${index}">${element}</option>`
              })
            
              const addToCart = document.getElementById("addToCart");
              addToCart.addEventListener("click", handleAddTocart)

      } else {
        document.getElementById("product_display").innerHTML('PAS DE PRODUIT')
      }


    })


//si l'utilisateur  viens sur la page la première fois  on initialise cartitems avec un array vide//
if (localStorage.getItem('cartItems') == null) {
    localStorage.setItem('cartItems', '[]');

}

function handleAddTocart(){
  const colors_selected = document.getElementById("colors")
  const color_selected = colors_selected.options[colors_selected.selectedIndex].text;
  const quantity_selected = document.getElementById("quantity").value

  let oldCartItems= JSON.parse(localStorage.getItem("cartItems"));
  if(quantity_selected<1) return;
  if (oldCartItems.some((item)=>item.id===product_id)) {

    //recupe l'index du produit selectionner dan sle tableau
    const index =oldCartItems.findIndex(item=>item.id===product_id && item.color===color_selected)

    // si je trouve le produit mais pas la meme couleur que celle du panie//
    if(index == -1){
      oldCartItems.push({
       /*  "newIdSet" : product_id +'itemColor'+color_selected, */
          "color": color_selected,
          "qty":Number(quantity_selected),
          "id": product_id
     });

     alert("Le produit a été ajoute au panier ")
    }else{
       //donc augmenter la quantité
      oldCartItems[index].qty=Number(oldCartItems[index].qty)+Number(quantity_selected)<=100 ?Number(oldCartItems[index].qty)+Number(quantity_selected) :100
      alert("Vous ne pouvez pas commander plus de 100 articles, vous avez actuellement 100 articles dans votre panier. ")
    }

    

  } else {
    oldCartItems.push({
   /*  "newIdSet" : product_id +'itemColor'+color_selected, */
      "color": color_selected,
      "qty":Number(quantity_selected),
      "id": product_id
  });

  alert("Le produit a ete ajoute au panier ")
}  
  
  localStorage.setItem('cartItems', JSON.stringify(oldCartItems));
  
 

}

  
