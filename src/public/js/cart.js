const borrarProducto = async (cartId, productId) => {
    const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    mostrarCart()
}

const agregarProducto = async (productId, cantidad) => {
    try {
        // Obtener el carrito actual
        const responseCart = await fetch(`http://localhost:8080/api/carts/679e786229c5021d6084e788`);
        const dataCart = await responseCart.json();

        if (!dataCart.cart || !dataCart.cart._id) {
            console.error('No se encontró el carrito');
            return;
        }

        const cartId = dataCart.cart._id;

        const productos = [{ product: productId, cantidad: cantidad }];

        const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: productos }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error al agregar producto:', data.message);
            return;
        }

        console.log('Producto agregado con éxito:', data);
        mostrarCart();
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
};


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
const detalleCarrito = document.querySelector('#detalleCarrito');

const mostrarCart = async () => {
    try {
        const response = await fetch(`http://localhost:8080/api/carts/679e786229c5021d6084e788`);
        const data = await response.json();

        if (!data.cart || !data.cart.products) {
            console.error('El carrito no contiene productos.');
            return;
        }

        console.log("Información para mostrar del carrito:", data.cart.products);

        detalleCarrito.innerHTML = '';

        detalleCarrito.innerHTML += `<button class="btn btn-outline-danger mb-3" onclick="borrarTodo('${data.cart._id}')">Eliminar todo</button>`;

        let htmlContent = '';

        data.cart.products.forEach((item) => {
            if (!item.product) return; // Evitar errores si el producto no existe

            htmlContent += `
                <div class="card mb-3">
                    <div class="card-body d-flex align-items-center">
                        <img src="${item.product.imagen}" alt="${item.product.titulo}" class="card-img" style="width: 100px; height: 100px; object-fit: cover;">   
                        <div class="ms-3">
                            <h5 class="card-title">${item.product.titulo}</h5>
                            <p class="card-text">Precio: $${item.product.precio.toLocaleString('es-CL')}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="modificarCantidad('${data.cart._id}', '${item.product._id}', ${item.cantidad - 1})">-</button>
                                <span>${item.cantidad}</span>
                                <button class="btn btn-sm btn-outline-primary ms-2" onclick="modificarCantidad('${data.cart._id}', '${item.product._id}', ${item.cantidad + 1})">+</button>
                            </div>
                            <button class="btn btn-outline-danger mt-2" onclick="borrarProducto('${data.cart._id}', '${item.product._id}')">Eliminar</button>
                        </div>
                    </div>
                </div>`;
        });

        // Agregar el contenido generado al contenedor
        detalleCarrito.innerHTML += htmlContent;

        // Mostrar el total del carrito
        detalleCarrito.innerHTML += `<div class="mt-3"><strong>Total: $${data.cart.monto.toLocaleString('es-CL')}</strong></div>`;
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
};


// Llama a la función para mostrar el carrito al inicio
mostrarCart()