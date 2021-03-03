const productBox = document.getElementById("container-product-box");
const categoryFromSelect = document.getElementById("categoryFromSelect");
const dropdownIcon = document.getElementsByClassName("dropdown-icon")[0];
const navList = document.querySelector("#header-nav");
const search = document.getElementById("search");
const searchIcon = document.querySelector(".search-icon");
const selectByCategory = document.querySelector('#selectByCategory');

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
    this.getProducts(data);
    this.selectCategory(data);
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
  
  getProducts(data){
    let getId = Storage.getCategory();
    console.log(getId);
   console.log(data);
   let categProd = data.filter(prod => prod.categoryId == getId);
   console.log(categProd);
   this.renderProducts(categProd);
    
  }

  renderProducts(prodCateg) {
    let output = "";
    for (let i in prodCateg) {
      for (let j in prodCateg[i].articles) {
        output += `
            <div class="img-item-container" data-id="${prodCateg[i].categoryId}">
            
            <img src="${prodCateg[i].articles[j].image.src}" alt="${prodCateg[i].articles[j].image.alt}" class="img-fluid img-item">
            
            <ul>
            <li>${prodCateg[i].articles[j].article}</li>
            <li>${prodCateg[i].articles[j].manifactur}</li>
            <li>${prodCateg[i].articles[j].dimension}</li>
            <li>${prodCateg[i].articles[j].price}</li>
            </ul>
            <button data-id="${prodCateg[i].articles[j].id}"class="seeProduct">Pogledaj proizvod</button>
            </div>
            `;
      }
    }
    if (window.location.href.endsWith("proizvodi.html")) {
      categoryFromSelect.innerHTML = output;
    }

    this.getProductBtn()
  }

  getProductBtn() {
      const seeProdBtn = [...document.querySelectorAll(".seeProduct")];
      seeProdBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          let btnId = btn.dataset.id;
          console.log(btnId);
          // Storage.category(btnId);
          // window.location.href = 'proizvodi.html';
          });
        });
    };


  selectCategory(data){
    let categorySelect = data.map(el => el.category);
    console.log(categorySelect);
    this.optionCateg(categorySelect);
  }
  optionCateg(categorySelect){
    
      let ispis = '';
      for(let i=0; i<categorySelect.length; i++){
        ispis += `
        <option value="${i}">${categorySelect[i]}</option>
        `;
      }
        selectByCategory.innerHTML=ispis;


    
   
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

class Registration{
  
}

class Storage {
  static category(btnId) {
    localStorage.setItem('category',btnId);
  }
  static getCategory() {
    return localStorage.getItem('category');
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const products = new AllProducts();
  const view = new View();
  products
    .getAllProducts()
    .then((data) => {
      view.renderCategories(data);
    })

    .then(() => {
      view.listeners();
    });
});
