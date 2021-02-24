
const productBox = document.getElementById('container-product-box');

async function getAllProducts(){
    const res = await fetch('assets/data/products.json');
    const data = await res.json();

    renderCategories(data);
    console.log(data);
    // return fetch('assets/data/products.json');
}

function renderCategories(data) {
    let categTitle = document.createElement('div');
    categTitle.innerHTML = `
    <h4>KATEGORIJE PROIZVODA</h4>
   `;
    productBox.appendChild(categTitle);

    const categRow = document.createElement('div');
    categRow.className = 'row';

    let output= '';
    data.forEach(obj => {
        //   const {articles } = obj
        output+= `
   <div class="col-6 col-lg-3 category" data-categId=${obj.categoryId}>
   <div class= "img-container">
   <img src="${obj.imgSrc}"
   alt="category image" class="img-categories">
   <button class="seeAllBtn" id=""${obj.categoryId}>VIDI SVE</button>
   </div>
   <h5>${obj.category}</h5>

    </div>
   `;
    });
    categRow.innerHTML=output;
    productBox.appendChild(categRow);
};

    getAllProducts();

 

