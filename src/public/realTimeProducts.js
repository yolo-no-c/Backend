const socket = io();

const contenedorProductosRTP = document.querySelector(".products-container-rtp");

socket.on("realtime", (data) => {
    contenedorProductosRTP.innerHTML = "";
    data.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("cart");

        const id = document.createElement("p");
        id.innerText = "id : "+product.id;
        const title = document.createElement("p");
        title.innerText = "nombre : "+product.title;
        const description = document.createElement("p");
        description.innerText = product.description;
        const price = document.createElement("p");
        price.innerText = "$" + product.price;
        const code = document.createElement("p");
        code.innerText = product.code;
        const stock = document.createElement("p");
        stock.innerText = "stock : "+product.stock;
        const category = document.createElement("p");
        category.innerText = "category : "+product.category;
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Eliminar";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = () => deleteProduct(product.id);

        div.appendChild(id);
        div.appendChild(title);
        div.appendChild(description);
        div.appendChild(price);
        div.appendChild(code);
        div.appendChild(stock);
        div.appendChild(category);
        div.appendChild(deleteButton);
        contenedorProductosRTP.appendChild(div);
    });
});

//.trim elimina espacion en blanco al principio y al final de los campos del formulario:
const addProduct = () => {
    const title = document.querySelector("#add-title").value.trim();
    const description = document.querySelector("#add-description").value.trim();
    const price = document.querySelector("#add-price").value.trim();
    const code = document.querySelector("#add-code").value.trim();
    const stock = document.querySelector("#add-stock").value.trim();
    const category = document.querySelector("#add-category").value.trim();
  
    //validar que no falte llenar ningun campo del formulario:
    if (!title || !description || !price || !code || !stock || !category) {
      alert("Por favor, rellene todos los campos del formulario");
      return;
    }
  
    const info = { title, description, price, code, stock, category };
    socket.emit("nuevo-producto", info);
  
    //limpiar los campos del formulario:
    document.querySelector("#add-title").value = "";
    document.querySelector("#add-description").value = "";
    document.querySelector("#add-price").value = "";
    document.querySelector("#add-code").value = "";
    document.querySelector("#add-stock").value = "";
    document.querySelector("#add-category").value = "";
    console.log("Poducto agregado");
    console.log(info);
  };
  
  //funcion para eliminar un producto
  const deleteProduct = (productId) => {
    socket.emit("eliminar-producto", productId);
    console.log("Producto Eliminado", productId);
  };