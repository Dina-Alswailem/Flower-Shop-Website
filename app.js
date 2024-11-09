class Cart {
    constructor(storageKey = 'cartItems') {
        this.storageKey = storageKey;
        this.cartItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    // Add product to cart
    addToCart(product) {
        const existingItem = this.cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({ ...product, quantity: 1 });
        }
        this.saveCart();
    }

    // Update the quantity of a cart item
    changeQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            this.cartItems.splice(index, 1);
        } else {
            this.cartItems[index].quantity = newQuantity;
        }
        this.saveCart();
    }

    // Save cart items to localStorage
    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    }

    // Load cart items from localStorage
    loadCart() {
        this.cartItems = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    // Get total quantity and price
    getCartTotals() {
        return this.cartItems.reduce((totals, item) => {
            totals.quantity += item.quantity;
            totals.price += item.price * item.quantity;
            return totals;
        }, { quantity: 0, price: 0 });
    }
}

// Product data
const products = [
    { id: 1, name: 'Mother\'s Day Product 1', image: 'b.png', price: 180 },
    { id: 2, name: 'Mother\'s Day Product 2', image: 'b2.png', price: 220 },
    { id: 3, name: 'Mother\'s Day Product 3', image: 'b3.jpg', price: 260 },
    { id: 4, name: 'Mother\'s Day Product 4', image: 'b4.jpg', price: 300 },
    { id: 5, name: 'Mother\'s Day Product 5', image: 'b5.jpg', price: 240 },
    { id: 6, name: 'Mother\'s Day Product 6', image: 'b6.jpg', price: 280 },
    { id: 7, name: 'Newborn Product 1', image: 'b.png', price: 180 },
    { id: 8, name: 'Newborn Product 2', image: 'b2.png', price: 220 },
    { id: 9, name: 'Newborn Product 3', image: 'b3.jpg', price: 260 },
    { id: 10, name: 'Newborn Product 4', image: 'b4.jpg', price: 300 },
    { id: 11, name: 'Newborn Product 5', image: 'b5.jpg', price: 240 },
    { id: 12, name: 'Newborn Product 6', image: 'b6.jpg', price: 280 },
    { id: 13, name: 'Graduation Product 1', image: 'g.jpg', price: 180 },
    { id: 14, name: 'Graduation Product 2', image: 'g2.jpg', price: 220 },
    { id: 15, name: 'Graduation Product 3', image: 'g3.jpg', price: 260 },
    { id: 16, name: 'Graduation Product 4', image: 'g4.jpg', price: 300 },
    { id: 17, name: 'Graduation Product 5', image: 'g5.jpg', price: 240 },
    { id: 18, name: 'Graduation Product 6', image: 'g6.jpg', price: 280 }
];

const cart = new Cart();
const list = document.querySelector('.list');
const listCard = document.querySelector('#contentthecart');
const total = document.querySelector('#totalinCart');
const quantity = document.querySelector('.quantity');

// Initialize the app
function initApp() {
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('item');
        productDiv.innerHTML = `
            <img src="image/${product.image}" alt="${product.name}">
            <div class="title">${product.name}</div>
            <div class="price">${product.price.toLocaleString()}</div>
            <button data-index="${index}" class="add-to-cart">Add To Cart</button>`;
        list.appendChild(productDiv);
    });

    list.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const index = event.target.getAttribute('data-index');
            cart.addToCart(products[index]);
            updateCartDisplay();
        }
    });

    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    console.log("Updating cart...");
    cart.loadCart();

    listCard.innerHTML = '';
    const { quantity: totalQuantity, price: totalPrice } = cart.getCartTotals();

    cart.cartItems.forEach((item, index) => {
        console.log(`Adding item to cart display:`, item);

        const cartItemDiv = document.createElement('li');
        cartItemDiv.innerHTML = `
            <div><img src="image/${item.image}" alt="${item.name}" /></div>
            <div>${item.name}</div>
            <div>${item.price.toLocaleString()}</div>
            <div>
                <button data-index="${index}" data-quantity="${item.quantity - 1}" class="quantity-change">-</button>
                <div class="count">${item.quantity}</div>
                <button data-index="${index}" data-quantity="${item.quantity + 1}" class="quantity-change">+</button>
            </div>`;
        
        listCard.appendChild(cartItemDiv);
    });

    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = totalQuantity;

    document.querySelectorAll('.quantity-change').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            const newQuantity = parseInt(event.target.getAttribute('data-quantity'));
            cart.changeQuantity(index, newQuantity);
            updateCartDisplay();
        });
    });
}

// Open cart modal and load items
document.querySelector('.shopping').addEventListener('click', () => {
    cart.loadCart();
    updateCartDisplay();
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});

initApp();