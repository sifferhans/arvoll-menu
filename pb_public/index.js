const pb = new PocketBase("http://127.0.0.1:8090");
const app = document.getElementById("app");

updatePage();

pb.collection("products").subscribe("*", (event) => updatePage());
pb.collection("categories").subscribe("*", (event) => updatePage());

// get data and put onto page
function updatePage() {
  pb.collection("categories")
    .getFullList({
      // https://pocketbase.io/docs/working-with-relations/#back-relations
      expand: "products_via_category",
    })
    .then((categories) => {
      app.innerHTML = "";

      categories.forEach((category) => {
        const {
          id,
          name,
          expand: { products_via_category: products },
        } = category;

        const container = document.createElement("div");
        container.setAttribute("class", "category");
        container.setAttribute("id", id);
        container.innerHTML = `
          <h2>${name}</h2>
          ${productList(products)}
        `;

        app.appendChild(container);
      });
    });
}

function productList(products) {
  return [
    "<ul>",
    ...products.map(
      (product) =>
        `<li>
          <div>
            <span>${product.name}</span>
            <hr />
            <span>${product.price} kr</span>
          </div>
          ${product.description && `<p>${product.description}</p>`}
        </li>`,
    ),
    "</ul>",
  ].join("");
}
