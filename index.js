const url = 'https://fakestoreapi.com/products'; // URL de la API
const productContainer = document.querySelector(".carta-compra"); // Contenedor para las cartas de productos
const cart = []; // Array para almacenar los productos en el carrito
let allProducts = []; // Array para almacenar todos los productos obtenidos
let currentProducts = []; // Array para almacenar los productos mostrados actualmente

// Función para cargar categorías únicas en el filtro de categorías
const loadCategories = (products) => {
  const categoryFilter = document.getElementById('filtro-categoria');
  const uniqueCategories = [...new Set(products.map(product => product.category))]; // Obtener categorías únicas

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalizar nombres de categorías
    categoryFilter.appendChild(option); // Agregar opciones al filtro
  });
};

// Evento para filtrar los productos cuando se selecciona una categoría
const categoryFilter = document.getElementById('filtro-categoria');
categoryFilter.addEventListener('change', (event) => {
  filterByCategory(event.target.value);
});

// Función para filtrar productos por categoría seleccionada
const filterByCategory = (category) => {
  if (category === 'all') {
    currentProducts = allProducts; // Si se selecciona "all", muestra todos los productos
  } else {
    currentProducts = allProducts.filter(product => product.category === category); // Filtrar por categoría
  }
  renderProducts(currentProducts); // Renderizar productos filtrados
};

// Función para renderizar los productos en la página
const renderProducts = (products) => {
  productContainer.innerHTML = ''; // Limpiar los productos anteriores
  products.forEach(product => {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
      <div class="productos-uno">
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>${product.category}</p>
        <p>${product.description}</p>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Añadir al carrito</button>
      </div>
    `;
    productContainer.appendChild(newDiv); // Añadir cada producto al contenedor
  });
};

// Función para obtener los productos desde la API
const getProducts = () => {
  fetch(url)
    .then(response => response.json())
    .then(products => {
      allProducts = products; // Almacenar los productos obtenidos
      currentProducts = products; // Inicialmente todos los productos
      renderProducts(products); // Renderizar todos los productos inicialmente
      loadCategories(products); // Cargar las categorías en el filtro
    });
};

// Función para añadir productos al carrito
const addToCart = (productId) => {
  const product = allProducts.find(prod => prod.id === productId); // Buscar el producto por su ID
  const productInCart = cart.find(item => item.id === productId); // Verificar si ya está en el carrito

  if (productInCart) {
    productInCart.quantity += 1; // Aumentar la cantidad si ya está en el carrito
  } else {
    cart.push({ ...product, quantity: 1 }); // Agregar nuevo producto al carrito con cantidad 1
  }

  renderCart(); // Actualizar el carrito visualmente
};

// Función para renderizar el carrito
const renderCart = () => {
  const cartContainer = document.querySelector('.cart-items'); // Contenedor del carrito
  cartContainer.innerHTML = ''; // Limpiar los elementos del carrito

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.innerHTML = `
      <div class="cart-item">
        <h3>${item.title}</h3>
        <p>Cantidad: ${item.quantity}</p>
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <button onclick="removeFromCart(${item.id})">Eliminar</button>
      </div>
    `;
    cartContainer.appendChild(cartItem); // Agregar el producto al carrito visual
  });

  // Mostrar resumen de la compra
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalContainer = document.querySelector('.cart-total');
  totalContainer.textContent = `Total: $${totalAmount.toFixed(2)}`;
};

// Función para aumentar la cantidad
const increaseQuantity = (productId) => {
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart) {
    productInCart.quantity += 1;
    renderCart(); // Actualizar el carrito
  }
};

// Función para disminuir la cantidad
const decreaseQuantity = (productId) => {
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart && productInCart.quantity > 1) {
    productInCart.quantity -= 1;
    renderCart(); // Actualizar el carrito
  } else {
    removeFromCart(productId); // Si la cantidad llega a 0, eliminar el producto
  }
};

// Función para eliminar un producto del carrito
const removeFromCart = (productId) => {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1); // Eliminar producto del carrito
    renderCart(); // Actualizar el carrito
  }
};

// Función para ordenar los productos
const sortProducts = (order) => {
  let sortedProducts = [...currentProducts]; // Copiar los productos actuales

  if (order === 'asc') {
    sortedProducts.sort((a, b) => a.price - b.price); // Orden ascendente por precio
  } else if (order === 'desc') {
    sortedProducts.sort((a, b) => b.price - a.price); // Orden descendente por precio
  }

  renderProducts(sortedProducts); // Volver a renderizar los productos ordenados
};

// Evento para ordenar los productos cuando se selecciona una opción de orden
const sortSelect = document.getElementById('filtro-orden');
sortSelect.addEventListener('change', (event) => {
  sortProducts(event.target.value);
});

// Seleccionamos el botón del carrito y el contenedor del carrito
const btnCart = document.querySelector('.carrito-compras');
const containerCarrito = document.querySelector('.cart');

// Mostrar/ocultar carrito al hacer clic en el botón del carrito
btnCart.addEventListener('click', () => {
  containerCarrito.classList.toggle('contenido-carrito');
  containerCarrito.classList.add('cart', 'contenido-carrito-none');
});

// Llamar a la función para obtener y mostrar los productos al cargar la página
getProducts();

