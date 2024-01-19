let cartItems = [];
let exchangeRate = 1; // 1 USD to ₦1 (since we are dealing with Naira only)

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Load cart from local storage on page load
    displayFeaturedProducts();
    displayOtherProducts();
    updateCartNotification();
});

document.addEventListener('DOMContentLoaded', function () {
    // Sample array of products with image filenames
    const products = [
        { name: 'iphone 15', image: 'iphone 15 slideshow.jpg' },
        { name: 'iphone 15 pro', image: 'iphone 15 pro slideshow.jpg' },
        { name: 'iphone 15 pro max', image: 'iphone 15 pro max slideshow.jpg' },
        { name: 'BRAND NEW SAMSUNG GALAXY FOLD 5', image: 'SAMSUNG GALAXY FOLD 5.webp' },
        { name: 'iphone 13', image: 'IPHONE 13.jpg' },
        { name: 'iphone 11 black_red', image: 'iphone_11_black_red.jpg' },
        { name: 'iphone 11 pro max', image: 'iphone_11_pro_max.jpg' },
        { name: 'hp laptop', image: 'HP 1030 G3.jpg' },
      

        // Add more products as needed
    ];

    let currentSlideIndex = 0;
    const featuredImage = document.getElementById('featured-img-tag');

    // Function to change the slide
    function changeSlide(direction) {
        currentSlideIndex += direction;

        // Handle boundary conditions
        if (currentSlideIndex < 0) {
            currentSlideIndex = products.length - 1;
        } else if (currentSlideIndex >= products.length) {
            currentSlideIndex = 0;
        }

        // Update the featured image
        const imagePath = `holexpicture/${products[currentSlideIndex].image}`;
        featuredImage.src = imagePath;
        featuredImage.alt = products[currentSlideIndex].name;
    }

    // Function to create the slideshow
    function createSlideshow() {
        // Use setInterval to automatically change slides
        setInterval(() => {
            changeSlide(1); // Change to the next slide every few seconds (adjust as needed)
        }, 5000); // Change slides every 5 seconds (adjust as needed)
    }

    // Initial display
    createSlideshow();
});


// Function to create an "Add to Cart" button
function createAddToCartButton(productName, productPrice) {
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.classList.add('add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(productName, productPrice));
    return addToCartBtn;
}

// Function to create a product div
function createProductDiv(img, productName, productPrice, productDetails, addToCartBtn) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('product-details');

    const namePara = document.createElement('p');
    namePara.textContent = productName;

    const pricePara = document.createElement('p');
    pricePara.textContent = `₦${(productPrice * exchangeRate).toFixed(2)}`;

    const detailsPara = document.createElement('p');
    detailsPara.textContent = productDetails;

    detailsDiv.appendChild(namePara);
    detailsDiv.appendChild(pricePara);
    detailsDiv.appendChild(detailsPara);

    productDiv.appendChild(img);
    productDiv.appendChild(detailsDiv);
    productDiv.appendChild(addToCartBtn);

    // Add event listener to open modal on product click
    productDiv.addEventListener('click', () => openModal(createProductModal(productName, productPrice, productDetails, img.src)));

    return productDiv;
}

// Function to display products
function displayProducts(listId, products) {
    const productList = document.getElementById(listId);
    products.forEach(product => {
        const img = document.createElement('img');
        img.src = `holexpicture/${product.image}`;
        img.alt = product.name;

        const addToCartBtn = createAddToCartButton(product.name, product.price);
        const productDiv = createProductDiv(img, product.name, product.price, product.details, addToCartBtn);
        productList.appendChild(productDiv);
    });
}

function displayFeaturedProducts() {
    const featuredProducts = [
        { name: 'BRAND NEW SAMSUNG GALAXY FOLD 5', price: 1420000, image: 'SAMSUNG GALAXY FOLD 5.webp', details: '12GB RAM 256GB | DUAL SIM (WITH ONE YEAR SAMSUNG WARRANTY) |  (BLACK & ICY BLUE)' },
        { name: 'HP 1030 G3', price: 390000, image: 'HP 1030 G3.jpg', details: 'x360 Convertible | Intel Core i5  | 8th Gen | 13" FHD |  8GB Ram 512GB SSD | Keyboard Light | Touchscreen |' },
        { name: 'IPHONE 13', price: 575000, image: 'IPHONE 13.jpg', details: 'FACTORY UNLOCKED  | (MIXED COLORS)' },
    ];
    displayProducts('featured-list', featuredProducts);
}

function displayOtherProducts() {
    const otherProducts = [
        { name: 'Smart Home Hub', price: 30000, image: 'smart-home.jpg', details: 'Transform your home into a smart oasis.' },
        { name: 'Gaming Console', price: 35000, image: 'gaming-console.jpg', details: 'Next-level gaming with our advanced console.' },
        { name: 'UltraBook', price: 60000, image: 'ultrabook.jpg', details: 'Ultra-slim and powerful laptop for professionals.' },
    ];
    displayProducts('other-list', otherProducts);
}

// Function to update the cart notification
function updateCartNotification() {
    const cartNotification = document.getElementById('cart-notification');
    const cartCount = cartItems.length;
    cartNotification.textContent = cartCount > 0 ? `Cart: ${cartCount} items` : 'Cart is empty';
}

// Function to add a product to the cart
function addToCart(productName, productPrice) {
    cartItems.push({ name: productName, price: productPrice });
    saveCart(); // Save the updated cart to local storage
    updateCartNotification(); // Update the cart notification
}



function viewCart() {
    // Open the cart modal
    openCartModal();

    // Display cart items and total in the modal
    const cartContentDiv = document.getElementById('cart-content');
    cartContentDiv.innerHTML = ''; // Clear previous content

    if (cartItems.length > 0) {
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<span>${item.name} - ₦${(item.price * exchangeRate).toFixed(2)}</span> 
                                 <button onclick="removeCartItem(${index})">Remove</button>`;
            cartContentDiv.appendChild(itemDiv);
        });

        // Display total in the modal
        const totalDiv = document.createElement('div');
        const totalInNaira = cartItems.reduce((total, item) => total + item.price, 0) * exchangeRate;
        totalDiv.innerHTML = `<strong>Total:</strong> ₦${totalInNaira.toFixed(2)}`;
        cartContentDiv.appendChild(totalDiv);

        // Display remove all button
        const removeAllBtn = document.createElement('button');
        removeAllBtn.textContent = 'Remove All';
        removeAllBtn.onclick = removeAllCartItems;
        cartContentDiv.appendChild(removeAllBtn);
    } else {
        // Display a message if the cart is empty
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Your cart is empty.';
        cartContentDiv.appendChild(emptyCartMessage);
    }
}






// Function to remove all items from the cart
function removeAllCartItems() {
    cartItems = [];
    saveCart(); // Save the updated cart to local storage
    viewCart(); // Refresh the cart view
    updateCartNotification(); // Update the cart notification
}

// Function to remove a cart item by index
function removeCartItem(index) {
    cartItems.splice(index, 1); // Remove the item at the specified index
    saveCart(); // Save the updated cart to local storage
    viewCart(); // Refresh the cart view
    updateCartNotification(); // Update the cart notification
}



// Function to open the cart modal
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    openModal(cartModal);
}

// Function to close the cart modal
function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    closeModal(cartModal);
}

function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}





// Function to save the cart to local storage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to load the cart from local storage
function loadCart() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
    }
}

function checkout() {
    // Implement your logic for the checkout process
    // e.g., redirect to a WhatsApp direct message link with cart details
    const checkoutDetails = getCheckoutDetails();
    const whatsappLink = generateWhatsAppLink(checkoutDetails);
    window.open(whatsappLink, '_blank');
}



// Function to get checkout details
function getCheckoutDetails() {
    // Implement your logic to gather and format checkout details
    return cartItems;
}



// ... (rest of the code remains unchanged)

// Function to generate a WhatsApp direct message link
function generateWhatsAppLink(checkoutDetails) {
    // Implement your logic to generate a WhatsApp link with the checkout details
    // Example: 'https://wa.me/2348101140818?text=Order%20Details:%0A-Smartphone%20XYZ%20₦25000%0A-Laptop%20Pro%20₦70000'
    const phoneNumber = '2349032896201'; // Replace with your WhatsApp business number
    const message = generateCheckoutMessage(checkoutDetails);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

function generateCheckoutMessage(checkoutDetails) {
    // Calculate the total in Naira
    const totalInNaira = checkoutDetails.reduce((total, item) => total + item.price, 0) * exchangeRate;

    // Format individual items with Naira and join them with line breaks
    const formattedDetails = checkoutDetails.map(item => `${item.name}: ₦${(item.price * exchangeRate).toFixed(2)}`).join('\n');

    // Include the total in Naira in the message
    const totalMessage = `Total: ₦${totalInNaira.toFixed(2)}`;

    // Return the final formatted message
    return `Order Details:\n${formattedDetails}\n${totalMessage}`;
}



// Add this to your script.js file

function toggleReadMore(link) {
    // Toggle the visibility of additional content
    const additionalContent = link.previousElementSibling;
    additionalContent.classList.toggle('show');

    // Change the "Read More" text based on visibility
    if (additionalContent.classList.contains('show')) {
        link.textContent = 'Read Less';
    } else {
        link.textContent = 'Read More';
    }

    // Prevent the default action (preventing the page from scrolling to the top)
    link.addEventListener('click', function (e) {
        e.preventDefault();
    });
}



