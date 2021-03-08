const productBox = document.getElementById("container-product-box");
const categoryFromSelect = document.getElementById("categoryFromSelect");
const dropdownIcon = document.getElementsByClassName("dropdown-icon")[0];
const navList = document.querySelector("#header-nav");
const search = document.getElementById("search");
const searchIcon = document.querySelector(".search-icon");
const selectByCategory = document.querySelector('#selectByCategory');
const selectByPrice = document.querySelector('#selectByPrice');
const closeCart = document.querySelector('.close-cart');
const cartBtn = document.querySelector('.cart-btn');
const cartDOM = document.querySelector('#cart');
const cartWrapper = document.querySelector('.cart-wrapp');
const cartContent = document.querySelector('.cart-content');
const cartTotal = document.querySelector('cart-total');

let cart=[];

class AllProducts {
  async getAllProducts() {
    try {
      let res = await fetch("assets/data/products.json");
      let data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

class View {
  renderCategories(data) {
    let categTitle = document.createElement("div");
    categTitle.innerHTML = `
        <h4>KATEGORIJE PROIZVODA</h4>
       `;

    const categRow = document.createElement("div");
    categRow.className = "row";

    let output = "";
    data.forEach((obj) => {
      output += `
       <div class="col-6 col-lg-3 category" data-id="${obj.categoryId}">
       <div class= "img-container">
       <img src="${obj.imgSrc}"
       alt="category image" class="img-categories">
       <button class="seeAllBtn" data-id="${obj.categoryId}">VIDI SVE</button>
       </div>
       <h5>${obj.category}</h5>
        </div>
       `;
    });
    categRow.innerHTML = output;
    if (window.location.href.endsWith("index.html")) {
      productBox.appendChild(categTitle);
      productBox.appendChild(categRow);
    }
   
    console.log(data);
    this.getCategoryBtns();
    this.getProductsFromCategory(data);

    if(window.location.href.endsWith('proizvodi.html')){
      this.selectCategory(data);
      this.filterByPrice(data);
    }
  }

  getCategoryBtns() {
    const seeAllBtn = [...document.querySelectorAll(".seeAllBtn")];
    seeAllBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        let btnId = btn.dataset.id;
        Storage.category(btnId);
        window.location.href = 'proizvodi.html';
        });
      });   
  }
  
  getProductsFromCategory(data){
    let getId = Storage.getCategory();
    console.log(getId);
   console.log(data);
   let categProd = data.filter(prod => prod.categoryId == getId);
   console.log(categProd);
   this.renderProducts(categProd);   
   this.getAddToCart(categProd);

}

  renderProducts(prodCateg){
    let output = "";
    for (let i in prodCateg) {
      for (let j in prodCateg[i].articles) {
        output += `
            <div class="img-item-container" data-id="${prodCateg[i].categoryId}">
            <div class="img-cart-container">
            
            <img src="${prodCateg[i].articles[j].image.src}" alt="${prodCateg[i].articles[j].image.alt}" class="img-fluid img-item">
            <button class="addToCart" data-id="${prodCateg[i].articles[j].id}"><i class="fas fa-shopping-cart"></i></button>
            </div>            
            <ul>
            <li>${prodCateg[i].articles[j].article}</li>
            <li>${prodCateg[i].articles[j].manifactur}</li>
            <li>${prodCateg[i].articles[j].dimension}</li>
            <li>${prodCateg[i].articles[j].price} RSD</li>
            </ul>
            <button data-id="${prodCateg[i].articles[j].id}"class="seeProduct">Pogledaj proizvod</button>
            </div>
            `;
      }
    }
    if (window.location.href.endsWith("proizvodi.html")) {
      categoryFromSelect.innerHTML = output;
    }
    this.getProductBtn();
  }

  getProductBtn() {
      const seeProdBtn = [...document.querySelectorAll(".seeProduct")];
      seeProdBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          let btnId = btn.dataset.id;
          console.log(btnId);
          Storage.product(btnId);
          window.location.href = 'proizvod.html';
          });
        });
    };
  getAddToCart(prodCateg){
    const addToCart = [...document.querySelectorAll('.addToCart')];
    addToCart.forEach(btn =>{
      btn.addEventListener('click',(e)=>{
        for (let i in prodCateg) {
          for (let j in prodCateg[i].articles){
            if(e.target.dataset.id == prodCateg[i].articles[j].id){
              let prod = prodCateg[i].articles[j];
              console.log(prod);
             cart = Storage.getCart();
             cart.push(prod);
             Storage.saveCart(cart);
             const itemEl = new Cart(prod);
             itemEl.renderCart(prod)
            }
          }
        }
      })
    })
  };

  selectCategory(data){
    let categorySelect = data.map(el => el.category);
    console.log(categorySelect);  
      let output = '';
      for(let i=0; i<categorySelect.length; i++){
        output += `
        <option value="${i}">${categorySelect[i]}</option>
        `;
      }
        selectByCategory.innerHTML=output; 
        selectByCategory.selectedIndex = Storage.getCategory('category')-1;
        if(!Storage.getCategory('category')){
           selectByCategory.selectedIndex = 0;           
        }
        
        selectByCategory.addEventListener('change',()=>{
          let cat = selectByCategory.options[selectByCategory.selectedIndex].value;
          let selectedCat = parseInt(cat) + 1
          console.log(selectedCat);
          Storage.category(selectedCat);  
          let setupProd = data.filter(prod => prod.categoryId == selectedCat);
          this.renderProducts(setupProd);
          this.getAddToCart(setupProd);
          console.log(setupProd);
        })

  }
  filterByPrice(data){  
    selectByPrice.addEventListener('change',()=>{
      let id = Storage.getCategory();
      let productToSort = data.filter(prod=>{
        if(prod.categoryId== id){
         return prod.articles;
        }

      });
    let products = productToSort[0].articles;
    let idx = selectByPrice.selectedIndex;   
        if(idx=='1'){
          products.sort((a, b)=>{
            if(a.price > b.price) return 1;
            else if(a.price < b.price) return -1;
            else return 0;
          });
         productToSort[0].articles=products;
          this.renderProducts(productToSort);
        }else if(idx=='2'){
          products.sort((a, b)=>{
           if(a.price > b.price) return -1;
           else if(a.price < b.price) return 1;
           else return 0;
         });
         productToSort[0].articles=products;
         this.renderProducts(productToSort);   
        }    
    });
  }
  listeners() {
    this.showDropdownMenu();
  }
  showDropdownMenu() {
    dropdownIcon.addEventListener("click", () => {
      navList.style.display === "none"
        ? (navList.style.display = "block")
        : (navList.style.display = "none");
    });
  }
}
class Product {
  allAboutProduct(data){
    let productId = Storage.getProduct();
    let categId =Storage.getCategory();
    for(let i in data){
      let categ = data[i];
      if(categ.categoryId == categId){
        for(let j in categ.articles){
          let prod = categ.articles[j];
          if(prod.id == productId){
        this.renderProduct(prod);  
        this.addProdToCart(prod); 
          }
        }
      }
    }   
  }
  renderProduct(prod){
    const productRow = document.createElement("div");
    productRow.className = "row";  
     productRow.innerHTML=`
    <div class="col-12 col-lg-6">
    <div class="product-img">
        <img src="${prod.image.src}" alt="${prod.image.alt}">
    </div>                   
</div>
<div class="col-12 col-lg-6">
    <div class="product-info">                       
        <h2>${prod.article}</h2>
        <h3>${prod.manifactur}</h3>
        <h4>${prod.price}RSD</h4>
        <button class="addProdToCart" data-id="${prod.id}">Dodaj u korpu</button>
        <h5>Opis:</h5>
        <p>${prod.desc}</p>
        <h6><a href="proizvodi.html">Svi proizvodi iz kategorije</a></h6>
    </div>                  
</div>
  `;
    if(window.location.href.endsWith("proizvod.html")){
   productBox.appendChild(productRow);
    }

  }
  addProdToCart(prod){
    const addProdToCartBtn = document.querySelector('.addProdToCart');
    if(window.location.href.endsWith("proizvod.html")){
      addProdToCartBtn.addEventListener('click',(e)=>{
        console.log (e.target.dataset.id);
        cart=Storage.getCart();
        cart.push(prod);
        console.log(cart);
        Storage.saveCart(cart); 
       const itemEl = new Cart(prod);
      itemEl.renderCart(prod)
       })
    }    
  }
}
class Cart {
  setupCart(){
    cart = Storage.getCart();
    console.log(cart)
    this.fillCart(cart);
    // this.setCartValues();
    cartBtn.addEventListener('click', this.showCart);
    closeCart.addEventListener('click', this.hideCart);
  }
  renderCart(art){
    const cartItem= document.createElement('div'); 
    cartItem.classList.add("cart-item");   
    
    cartItem.innerHTML= `
      <img src="${art.image.src}">
      <div>
          <h5 class="cart-article">${art.article}-${art.manifactur}</h5>
          <h6 class="cart-price">${art.price} </h6>
          <button class="remove-item">Obriši artikal</button>
      </div>
      <div class="cart-input">
      <input type="number" class="cart-quantity" value="1">
      </div>
    
      `;
      cartContent.appendChild(cartItem);   
      const removeFromCartBtn = [...document.getElementsByClassName('remove-item')];
      removeFromCartBtn.forEach(b => b.addEventListener('click',this.removeCartItem))
    
  }
  removeCartItem(e){
    let clickedBtn = e.target;
    clickedBtn.parentElement.parentElement.remove();
  }
  fillCart(cart){
    cart.forEach(art=>this.renderCart(art));
  }

showCart(){
    cartDOM.style.transform = "translateX(0)";  
    cartWrapper.classList.add('cart-wrapp-bckg'); 
}
hideCart(){
  cartDOM.style.transform = "translateX(100%)";
  cartWrapper.classList.remove('cart-wrapp-bckg');  
}
}
  

class Storage {
  static category(btnId) {
    localStorage.setItem('category',btnId);
  }
  static getCategory() {
    return localStorage.getItem('category');
  }
  static product(btnId){
    localStorage.setItem('product',btnId);
  }
  static getProduct(){
    return localStorage.getItem('product');
  }
  static saveCart(cart){
    localStorage.setItem('cart',JSON.stringify(cart));
  }
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const products = new AllProducts();
  const view = new View();
  const p = new Product();
  const cart = new Cart();
  cart.setupCart();
  view.listeners();
  
  products
    .getAllProducts()
    .then((data) => {
      view.renderCategories(data);
      p.allAboutProduct(data);
    });

    
});
