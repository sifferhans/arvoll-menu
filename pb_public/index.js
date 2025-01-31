import PocketBase from "./vendor/pocketbase.js";

const pb = new PocketBase("http://127.0.0.1:8090");
const app = document.getElementById("app");

function updatePage() {
  pb.collection("categories")
    .getFullList({ expand: "products_via_category" })
    .then((categories) => {
      const elements = categories.map((category) => {
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
          <ul>
          ${products
            .map(
              (product) =>
                `<li>
                  <div>
                    <span>${product.name}</span>
                    <hr />
                    <span>${product.price} kr</span>
                  </div>
                  ${product.description && `<p>${product.description}</p>`}
                </li>`,
            )
            .join("")}
          </ul>
        `;

        return container;
      });

      app.innerHTML = "";
      elements.forEach((element) => app.appendChild(element));
    });
}

updatePage();
pb.collection("products").subscribe("*", () => updatePage());
pb.collection("categories").subscribe("*", () => updatePage());
