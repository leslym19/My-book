const API_URL = 'https://bookstore-api-six.vercel.app/api/books';

const bookList = document.getElementById('bookList');
const searchInput = document.getElementById('searchInput');
const newTitleInput = document.getElementById('newTitle');
const newAuthorInput = document.getElementById('newAuthor');
const addBookBtn = document.getElementById('addBookBtn');

let books = [];

async function fetchBooks() {
  try {
    const res = await fetch(API_URL);
    books = await res.json();
    renderBooks(filteredBooks());
  } catch (err) {
    console.error('Error fetching books:', err);
    alert('Failed to load books from API.');
  }
}

function renderBooks(list) {
  bookList.innerHTML = '';
  if (list.length === 0) {
    bookList.innerHTML = '<li>No books found.</li>';
    return;
  }
  list.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `${book.title} by ${book.author}`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'deleteBtn';
    delBtn.onclick = () => {
      deleteBook(book.id);
    };

    li.appendChild(delBtn);
    bookList.appendChild(li);
  });
}

function filteredBooks() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return books;
  return books.filter(book => book.title.toLowerCase().includes(query));
}

async function addBook() {
  const title = newTitleInput.value.trim();
  const author = newAuthorInput.value.trim();
  if (!title || !author) {
    alert('Please enter both title and author');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, author, isbn: '' })
    });
    const newBook = await res.json();
    books.push(newBook);
    newTitleInput.value = '';
    newAuthorInput.value = '';
    renderBooks(filteredBooks());
  } catch (err) {
    console.error('Error adding book:', err);
    alert('Failed to add book.');
  }
}

async function deleteBook(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    books = books.filter(book => book.id !== id);
    renderBooks(filteredBooks());
  } catch (err) {
    console.error('Error deleting book:', err);
    alert('Failed to delete book.');
  }
}

searchInput.addEventListener('input', () => {
  renderBooks(filteredBooks());
});

addBookBtn.addEventListener('click', addBook);

fetchBooks();
