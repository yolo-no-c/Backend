const borrarProducto = async (cartId, productId) => {
    const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    mostrarCart()
}

const agregarProducto = async (productId, cantidad = 1) => {
    const responseCart = await fetch(`http://localhost:8080/api/carts/679e786229c5021d6084e788`)
    const dataCart = await responseCart.json()


    const productos = [{ product: productId, cantidad }];

    const response = await fetch(`http://localhost:8080/api/carts/${dataCart.response[0]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productos }),
    })

    const data = await response.json();

    mostrarCart()
}

const modificarCantidad = async (cartId, productId, nuevaCantidad) => {

    if (nuevaCantidad <= 0) { return console.log("La cantidad no puede ser menos a 1") }

    const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
    })
    mostrarCart()
}

const borrarTodo = async (cartId) => {
    console.log(cartId);
    const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
        method: 'DELETE'
    })
    mostrarCart()
}

// Referencia al contenedor donde se mostrará el carrito
const detalleCarrito = document.querySelector('#detalleCarrito')

const mostrarCart = async () => {
    const response = await fetch(`http://localhost:8080/api/carts/679e786229c5021d6084e788`)
    const data = await response.json()

    // Comienza a construir el HTML del carrito
    detalleCarrito.innerHTML = `<button class="btn btn-outline-danger" onclick="borrarTodo('${data.response[0]._id}')">Eliminar todo</button>`;

    // Itera sobre cada producto en el carrito y crea la tarjeta correspondiente
    data.response[0].products.forEach((item) => {
        const tarjetaProduct = `<div class="card">
        <div class="card-body list-group-item d-flex align-items-center">            
                <img src="${item.product.imagen}" alt="${item.product.titulo}" class="card-img">   
                <h5 class="card-title">${item.product.titulo}</h5>        
            <div class="card-info">
                <p class="card-text">Precio: $${item.product.precio.toLocaleString('es-CL')}</p>
                <div class="d-flex align-items-center mt-2 card-info">
                    <button class="btn btns btn-sm btn-outline-primary me-2" onclick="modificarCantidad('${data.response[0]._id}', '${item.product._id}', ${item.cantidad - 1})">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn btns btn-sm btn-outline-primary ms-2" onclick="modificarCantidad('${data.response[0]._id}', '${item.product._id}', ${item.cantidad + 1})">+</button>
                </div>
                <button class="btn btn-outline-danger ms-3" onclick="borrarProducto('${data.response[0]._id}', '${item.product._id}')">Eliminar</button>
            </div>
        </div>
    </div>`;

        detalleCarrito.innerHTML += tarjetaProduct; // Agrega el producto al HTML del carrito
    })

    // Muestra el total y el botón de compra
    detalleCarrito.innerHTML += `</ul><div class="mt-3"><strong>Total: $${data.response[0].monto}</strong></div>`
}

// Llama a la función para mostrar el carrito al inicio
mostrarCart()