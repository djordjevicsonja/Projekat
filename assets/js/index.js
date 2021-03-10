const productBox = document.getElementById("container-product-box");
const categoryFromSelect = document.getElementById("categoryFromSelect");
const dropdownIcon = document.getElementsByClassName("dropdown-icon")[0];
const navList = document.querySelector("#header-nav");
const search = document.getElementById("search");
const searchIcon = document.querySelector(".search-icon");
const selectByCategory = document.querySelector("#selectByCategory");
const selectByPrice = document.querySelector("#selectByPrice");
const closeCart = document.querySelector(".close-cart");
const cartBtn = document.querySelector(".cart-btn");
const cartDOM = document.querySelector("#cart");
const cartWrapper = document.querySelector(".cart-wrapp");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const clearCartBtn = document.querySelector(".clear-cart");
const orderBtn = document.querySelector(".order");
const cartItems = document.querySelector(".cart-items");
let cart = [];

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

class CategoryProducts {
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

    if (window.location.href.endsWith("proizvodi.html")) {
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
        window.location.href = "proizvodi.html";
      });
    });
  }

  getProductsFromCategory(data) {
    let getId = Storage.getCategory();
    let categProd = data.filter((prod) => prod.categoryId == getId);
    this.renderProducts(categProd);
     this.getAddToCart(categProd);
  }

  renderProducts(prodCateg) {
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
        window.location.href = "proizvod.html";
      });
    });
  }
 
  getAddToCart(prodCateg){
    const addToCart = [...document.querySelectorAll('.addToCart')];
    addToCart.forEach(btn =>{
      btn.addEventListener('click',(e)=>{
        let ar = prodCateg[0].articles;
        let id = e.target.dataset.id;
        let addAr= ar.filter(ar=>ar.id == id);
        let prod = addAr[0];
        cart = Storage.getCart();
      if(cart.some(item=>item.articleNumber === prod.articleNumber)){
        alert("Proizvod je dodat u korpu");
        return;
      } else{
        cart.push(prod);
        Storage.saveCart(cart); 
      }
      const itemEl = new Cart(prod);
        itemEl.renderCart(prod);     
       })
      })
  };

  selectCategory(data) {
    let categorySelect = data.map((el) => el.category);
    console.log(categorySelect);
    let output = "";
    for (let i = 0; i < categorySelect.length; i++) {
      output += `
        <option value="${i}">${categorySelect[i]}</option>
        `;
    }
    selectByCategory.innerHTML = output;
    selectByCategory.selectedIndex = Storage.getCategory("category") - 1;
    if (!Storage.getCategory("category")) {
      selectByCategory.selectedIndex = 0;
    }

    selectByCategory.addEventListener("change", () => {
      let cat = selectByCategory.options[selectByCategory.selectedIndex].value;
      let selectedCat = parseInt(cat) + 1;
      console.log(selectedCat);
      Storage.category(selectedCat);
      let setupProd = data.filter((prod) => prod.categoryId == selectedCat);
      this.renderProducts(setupProd);
      this.getAddToCart(setupProd);
      console.log(setupProd);
    });
  }
  filterByPrice(data) {
    selectByPrice.addEventListener("change", () => {
      let id = Storage.getCategory();
      let productToSort = data.filter((prod) => {
        if (prod.categoryId == id) {
          return prod.articles;
        }
      });
      let products = productToSort[0].articles;
      let idx = selectByPrice.selectedIndex;
      if (idx == "1") {
        products.sort((a, b) => {
          if (a.price > b.price) return 1;
          else if (a.price < b.price) return -1;
          else return 0;
        });
        productToSort[0].articles = products;
        this.renderProducts(productToSort);
      } else if (idx == "2") {
        products.sort((a, b) => {
          if (a.price > b.price) return -1;
          else if (a.price < b.price) return 1;
          else return 0;
        });
        productToSort[0].articles = products;
        this.renderProducts(productToSort);
      }
    });
  }
  listeners() {
    this.showDropdownMenu();
    this.submitCart();
  }
  showDropdownMenu() {
    dropdownIcon.addEventListener("click", () => {
      navList.style.display === "none"
        ? (navList.style.display = "block")
        : (navList.style.display = "none");
    });
  }
  submitCart(){
    orderBtn.addEventListener('click', ()=>{
     if(cart.length > 0){
       window.location.href = 'form.html';
     }
    })
  }
}

class Product {
  allAboutProduct(data) {
    let productId = Storage.getProduct();
    let categId = Storage.getCategory();
    for (let i in data) {
      let categ = data[i];
      if (categ.categoryId == categId) {
        for (let j in categ.articles) {
          let prod = categ.articles[j];
          if (prod.id == productId) {
            this.renderProduct(prod);
            this.addProdToCart(prod);
          }
        }
      }
    }
  }
  renderProduct(prod) {
    const productRow = document.createElement("div");
    productRow.className = "row";
    productRow.innerHTML = `
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
    if (window.location.href.endsWith("proizvod.html")) {
      productBox.appendChild(productRow);
    }
  }
  addProdToCart(prod) {
    const addProdToCartBtn = document.querySelector(".addProdToCart");
    if (window.location.href.endsWith("proizvod.html")) {
      addProdToCartBtn.addEventListener("click", (e) => {
        cart = Storage.getCart();
        if(cart.some(item => item.articleNumber === prod.articleNumber)){
        alert("Proizvod je dodat u korpu");
        return;
      } else{
      cart.push(prod);
      Storage.saveCart(cart);        
      };
      const itemEl = new Cart(prod);
            itemEl.renderCart(prod);
      });
    }
  }
}
class Cart {
  setupCart() {
    cart = Storage.getCart();
    this.fillCart(cart);
    this.setCartValues();
    cartBtn.addEventListener("click", this.showCart);
    closeCart.addEventListener("click", this.hideCart);
  }
  renderCart(art) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${art.image.src}">
      <div class="${art.articleNumber}">      
          <h5 class="cart-article">${art.article}-${art.manifactur}</h5>
          <h6 class="cart-price">${art.price} RSD</h6>
          <button class="remove-item">Obriši artikal</button>          
      </div>
      <div class="cart-input">
      <input type="number" class="cart-quantity" value="1">
      </div>
  
      `;
    cartContent.appendChild(cartItem);
    // let quant = cartBtn.getElementsByClassName('cart-quantity');
    // let quantAr = [...quant];
    // quantAr.forEach(q =>{
    //   q.addEventListener("change", ()=> this.getQuantity() );
    // })
    cartItem
      .getElementsByClassName("cart-quantity")[0]
      .addEventListener("change", () => this.setCartValues());    
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearAllCart());
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeBtn = event.target;
        let itemNum = removeBtn.parentElement.classList.value;
        removeBtn.parentElement.parentElement.remove();
        console.log(itemNum);
        this.removeItem(itemNum);
      }
    });
    let q = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < q.length; i++) {
      q[i].addEventListener("change", (e) => { let input = e.target;
        if (isNaN(input.value) || input.value <= 0) {
          input.value = 1; }
      });
    }
    this.setCartValues();
  }
  // getQuantity(e) {
 
  // }

  setCartValues(){
   let items = document.getElementsByClassName("cart-item");    
    let sum = 0;
    let sumItems = 0;
    for (let i = 0; i < items.length; i++) {
      let priceEl = items[i].querySelector(".cart-price").innerHTML;
      let quantity = items[i].querySelector(".cart-quantity").value;
      let price = parseFloat(priceEl.replace('RSD', ''));
      sum = sum + price * parseInt(quantity);
      sumItems += parseInt(quantity);
      // console.log(items)
      // console.log(quantity);
      // console.log(price);
      // console.log(sum);
    }
    cartTotal.innerText = sum;
    cartItems.innerText = sumItems;
    console.log(sum);
    }
  
  removeItem(itemNum) {
    cart = cart.filter((item) => item.articleNumber != itemNum);
    Storage.saveCart(cart);
    console.log(cart);
    this.setCartValues();
  }

  clearAllCart() {
    let cartItems = cart.map((item) => item.articleNumber);
    console.log(cartItems);
    cartItems.forEach((itemNum) => this.removeItem(itemNum));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.setCartValues();
    this.hideCart();
  }

  fillCart(cart) {
    if(cart.length > 0 || cart.length !== null){
      cart.forEach((art) => this.renderCart(art));
    }
  }

  showCart() {
    cartDOM.style.transform = "translateX(0)";
    cartWrapper.classList.add("cart-wrapp-bckg");
  }
  hideCart() {
    cartDOM.style.transform = "translateX(100%)";
    cartWrapper.classList.remove("cart-wrapp-bckg");
  }
}

class Storage {
  static category(btnId) {
    localStorage.setItem("category", btnId);
  }
  static getCategory() {
    return localStorage.getItem("category");
  }
  static product(btnId) {
    localStorage.setItem("product", btnId);
  }
  static getProduct() {
    return localStorage.getItem("product");
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new AllProducts();
  const category = new CategoryProducts();
  const product = new Product();
  const cart = new Cart();
  cart.setupCart();
  category.listeners();
  products
    .getAllProducts()
    .then((data) => {
      category.renderCategories(data);
      product.allAboutProduct(data);
    })
    .then(() => {
      cart.cartLogic();
    });
});


function formValidation(){
  let errors = [];
  let fName = document.querySelector('#ime');
  let lName = document.querySelector('#prezime');
  let city = document.querySelector('#grad');
  let address = document.querySelector('#adresa');
  let email = document.querySelector('#email');
  let phone = document.querySelector('#telefon');

  let regFName = /^[A-Z][a-z]+$/;
  let regLName = /(^[A-Z][a-z]+)+$/;
  let regCity = /^[A-Z][a-z]{2,16}(\s([A-Z][a-z]{2,20})+)*$/;
  let regAddress = /^[\w]+(\s[\w\d]+)*$/;
  let regEmail = /^[\w]+([.-]?[\w\d]+)*@[\w]+([.-]?[\w]+)*(\.\w{2,4})+$/;
  let regPhone = /^06[01234569]\/\d{3}\-\d{3,4}$/;

  if(fName.value === "" || !regFName.test(fName.value)){
    errors.push('first name error');
    fName.classList.add("error");
    document.querySelector('#error-ime').innerHTML = 'Unesite podatke u polje'
  }else{
    fName.classList.remove("error");
    document.querySelector('#error-ime').innerHTML = '';
  };
  if(lName.value === "" || !regLName.test(lName.value)){
    errors.push('last name error');
    lName.classList.add("error");
    document.querySelector('#error-prezime').innerHTML = 'Unesite podatke u polje';
  }else{
    lName.classList.remove("error");
    document.querySelector('#error-prezime').innerHTML = '';
  };
  if(regCity.value === "" || !regCity.test(city.value)){
    errors.push('city error');
    city.classList.add("error");
    document.querySelector('#error-grad').innerHTML = 'Unesite podatke u polje'
  }else{
    city.classList.remove("error");
    document.querySelector('#error-grad').innerHTML = '';
  };
  if(address.value === "" || !regAddress.test(address.value)){
    errors.push('address error');
    address.classList.add("error");
    document.querySelector('#error-adresa').innerHTML = 'Unesite podatke u polje';
  }else{
    address.classList.remove("error");
    document.querySelector('#error-adresa').innerHTML = '';
  };  
  if(email.value === "" || !regEmail.test(email.value)){
    errors.push('email error');
    email.classList.add("error");
    document.querySelector('#error-email').innerHTML = 'Unesite podatke u polje';
  }else{
    email.classList.remove("error");
    document.querySelector('#error-email').innerHTML = '';
  };
  if(phone.value === "" || !regPhone.test(phone.value)){
    errors.push('phone error');
    phone.classList.add("error");
    document.querySelector('#error-telefon').innerHTML = 'Unesite podatke u polje';
  }else{
    phone.classList.remove("error");
    document.querySelector('#error-telefon').innerHTML = '';
  };
  console.log(errors);
  if(errors.length == 0){
    alert('Uspešna kupovina');
    return false;
  }else{
    return false;
  } 
}

