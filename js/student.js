let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
    { title: "1984", author: "George Orwell", available: true },
    { title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
    { title: "Moby Dick", author: "Herman Melville", available: true }
];

// Placeholder for the currently logged-in user (this would be dynamic in a real app)
const loggedInUsername = JSON.parse(localStorage.getItem('loggedInUser')) || "student";  
const notifications = [];

// Function to handle logout
function logout() {
    localStorage.removeItem('loggedInUser');  // Clear the logged-in user
    window.location.href = 'login.html';      // Redirect to login page
}

// Function to display user-specific notifications
function displayNotifications() {
    const notificationsList = document.getElementById("notificationsList");
    notificationsList.innerHTML = notifications.map(notification => `<li>${notification}</li>`).join('');
}

// Function to display the inventory of the logged-in user only
function showInventory(username) {
    const inventoryList = document.getElementById("inventoryList");
    const userSpecificInventory = JSON.parse(localStorage.getItem(`${username}_inventory`)) || [];  // Fetch user's specific inventory
    inventoryList.innerHTML = userSpecificInventory.map(item => `
        <li>
            ${item.title} - Status: ${item.status} - 
            Date: ${new Date(item.reservedOn || item.borrowedOn).toLocaleDateString()} - 
            ${item.returnDate ? `Return Date: ${new Date(item.returnDate).toLocaleDateString()}` : ''}
        </li>
    `).join('');
}

// Function to reserve a book
function reserveBook(title, username) {
    const book = books.find(b => b.title === title && !b.available);
    if (book) {
        let userSpecificInventory = JSON.parse(localStorage.getItem(`${username}_inventory`)) || [];  // Fetch user's specific inventory
        const alreadyReserved = userSpecificInventory.some(item => item.title === title && item.status === 'Reserved');
        if (alreadyReserved) {
            alert(`You have already reserved "${title}".`);
            return;
        }
        userSpecificInventory.push({
            title,
            reservedOn: new Date(),
            status: 'Reserved'
        });
        localStorage.setItem(`${username}_inventory`, JSON.stringify(userSpecificInventory));  // Save to user-specific inventory
        notifications.push(`You have reserved "${title}".`);
        displayNotifications();
        showInventory(username);
    } else {
        alert(`"${title}" is available. You can borrow it.`);
    }
}

// Function to borrow a book
function borrowBook(title, username) {
    const book = books.find(b => b.title === title && b.available);
    if (book) {
        book.available = false;
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 7);
        let userSpecificInventory = JSON.parse(localStorage.getItem(`${username}_inventory`)) || [];  // Fetch user's specific inventory
        userSpecificInventory.push({
            title,
            borrowedOn: new Date(),
            returnDate,
            status: 'Borrowed'
        });
        localStorage.setItem(`${username}_inventory`, JSON.stringify(userSpecificInventory));  // Save to user-specific inventory
        localStorage.setItem('books', JSON.stringify(books));  // Update books availability
        notifications.push(`You have borrowed "${title}".`);
        displayNotifications();
        showInventory(username);
    } else {
        alert(`"${title}" is currently unavailable.`);
    }
}

// Function to display search results
function displaySearchResults(results) {
    const resultsList = document.getElementById("searchResults");
    resultsList.innerHTML = results.map(book => `
        <li>
            ${book.title} by ${book.author} - ${book.available ? 'Available' : 'Unavailable'}
            ${book.available 
                ? `<button onclick="borrowBook('${book.title}', '${loggedInUsername}')">Borrow</button>` 
                : ''}
        </li>
    `).join('');
}

// Function to show unavailable books for reservation
function showUnavailableBooks() {
    const reserveResultsList = document.getElementById("reserveResults");
    const unavailableBooks = books.filter(book => !book.available);
    reserveResultsList.innerHTML = unavailableBooks.map(book => `
        <li>
            ${book.title} by ${book.author} - Unavailable
            <button onclick="reserveBook('${book.title}', '${loggedInUsername}')">Reserve</button>
        </li>
    `).join('');
}

// Event listener for DOMContentLoaded to initialize the page
document.addEventListener("DOMContentLoaded", () => {
    showInventory(loggedInUsername);
    showUnavailableBooks();
    document.getElementById('logoutButton').addEventListener('click', logout);  // Add logout functionality
});

// Event listener for search functionality
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    const results = aStarSearch(query, books);
    displaySearchResults(results);
});

// A* search function for book search
function aStarSearch(query, books) {
    const openSet = [];
    const closedSet = new Set();
    for (const book of books) {
        if (book.title.toLowerCase().includes(query.toLowerCase())) {
            openSet.push({
                title: book.title,
                cost: 1,
                heuristic: heuristic(book.title, query),
                book: book
            });
        }
    }
    while (openSet.length > 0) {
        openSet.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic));
        const currentNode = openSet.shift();
        if (currentNode.book) {
            return [currentNode.book];
        }
        closedSet.add(currentNode.title);
        for (const book of books) {
            if (!closedSet.has(book.title) && book.title.toLowerCase().includes(query.toLowerCase())) {
                openSet.push({
                    title: book.title,
                    cost: currentNode.cost + 1,
                    heuristic: heuristic(book.title, query),
                    book: book
                });
            }
        }
    }
    return [];
}

// Heuristic function for A* search
function heuristic(bookTitle, query) {
    return Math.abs(bookTitle.length - query.length);
}
