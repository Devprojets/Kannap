// presentation des produits sur la page d'aceuil

//récupérer la section du DOM//
const itemsSection = document.getElementById("items");

//url du endpoint list de produit du back
const url = "http://localhost:3000/api/products";

//requete api de la list des produi
fetch(url)
  .then((response) => response.json())

  .then((productsDatas) => {

    //a chaque elem du tableau productDatas
    productsDatas.forEach(element => {
      //je rajoute une card de produit 
      itemsSection.innerHTML += `
      <a href="./product.html?id=${element._id}">
      <article>
        <img src="${element.imageUrl}" alt=${element.altTxt}>
        <h3 class="productName">${element.name}</h3>
        <p class="productDescription">
        ${element.description.slice(0, 50)}...
         </p>
      </article>
    </a> 
      `;
    });
  });
