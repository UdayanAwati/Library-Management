// Initialize books from localStorage or with default values
let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
    { title: "1984", author: "George Orwell", available: true },
    { title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
    { title: "Moby Dick", author: "Herman Melville", available: true }
];

// Function to display the book catalog
function displayCatalog() {
    const catalogList = document.getElementById("catalogList");
    catalogList.innerHTML = '';
    books.forEach((book, index) => {
        catalogList.innerHTML += `
            <li>
                ${book.title} by ${book.author} - ${book.available ? 'Available' : 'Unavailable'}
                <button onclick="removeBook(${index})">Remove</button>
            </li>
        `;
    });
}

// Function to display all borrowed books in admin dashboard
function displayAllBorrowedBooks() {
    const adminBorrowedList = document.getElementById("adminBorrowedList");
    adminBorrowedList.innerHTML = ''; // Clear previous entries

    // Retrieve all keys from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.endsWith('_inventory')) {  // Filter for user inventories
            const inventory = JSON.parse(localStorage.getItem(key)) || [];
            const username = key.split('_')[0];  // Extract username from key
            
            console.log(`Username: ${username}, Inventory:`, inventory); // Debug line
            
            inventory.forEach(item => {
                if (item.status === 'Borrowed') {
                    adminBorrowedList.innerHTML += `
                        <li>
                            ${item.title} - Borrowed by: ${username} - Borrowed on: ${new Date(item.borrowedOn).toLocaleDateString()} - 
                            Return Date: ${new Date(item.returnDate).toLocaleDateString()}
                        </li>
                    `;
                }
            });
        }
    });

    if (adminBorrowedList.innerHTML === '') {
        adminBorrowedList.innerHTML = '<li>No borrowed books.</li>'; // Handle case where no books are borrowed
    }
}

// Function to remove a book from the catalog
function removeBook(index) {
    const removedBook = books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    alert(`"${removedBook[0].title}" has been removed.`);
    displayCatalog();
}

// Function to add a new book
document.getElementById("addBookForm").addEventListener("submit", addBook);
function addBook(event) {
    event.preventDefault();
    const titleInput = document.getElementById("bookTitle").value.trim();
    const authorInput = document.getElementById("bookAuthor").value.trim();
    if (!titleInput || !authorInput) {
        alert("Both title and author fields are required.");
        return;
    }
    books.push({ title: titleInput, author: authorInput, available: true });
    localStorage.setItem('books', JSON.stringify(books));
    document.getElementById("bookTitle").value = '';
    document.getElementById("bookAuthor").value = '';
    alert(`${titleInput} by ${authorInput} has been added.`);
    displayCatalog();
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Event listeners for DOM content loaded and logout button
document.addEventListener("DOMContentLoaded", () => {
    displayCatalog();
    displayAllBorrowedBooks(); // Call to display borrowed books
});
document.getElementById("logoutButton").addEventListener("click", logout);
