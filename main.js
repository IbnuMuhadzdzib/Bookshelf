document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const searchForm = document.getElementById('searchBook');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const errorContainer = document.getElementById('errorContainer');

    let books = JSON.parse(localStorage.getItem('books')) || [];
    updateBookLists();

    bookForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('bookFormTitle').value.trim();
        const author = document.getElementById('bookFormAuthor').value.trim();
        const year = Number(document.getElementById('bookFormYear').value.trim());
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        if (!title || !author || !year || isNaN(year) || year < 1000 || year > 9999) {
            showError("Tolong Diisi dengan Benar");
            return;
        }
        showError('');

        const book = { title, author, year, isComplete, id: Date.now() };
        books.push(book);
        updateBookLists();
        bookForm.reset();
    });

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = message ? 'block' : 'none';
    }

    function updateLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function updateBookLists() {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        books.forEach(book => {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
        updateLocalStorage();
    }

    function createBookItem({ title, author, year, isComplete, id }) {
        const bookItem = document.createElement('div');
        bookItem.setAttribute('data-bookid', id);
        bookItem.setAttribute('data-testid', 'bookItem');

        bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${author}</p>
            <p data-testid="bookItemYear">Tahun: ${year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton" class="toggle-complete">${isComplete ? 'Belum Selesai dibaca' : 'Selesai dibaca'}</button>
                <button data-testid="bookItemDeleteButton" class="delete">Hapus Buku</button>
                <button data-testid="bookItemEditButton" class="edit">Edit Buku</button>
            </div>
        `;

        bookItem.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
            if (confirm("Yakin Mau Hapus Bukunya?")) {
                books = books.filter(book => book.id !== id);
                updateBookLists();
            }
        });

        bookItem.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
            editBookItem({ title, author, year, isComplete, id });
        });

        bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
            toggleCompletion({ title, author, year, isComplete, id });
        });

        return bookItem;
    }

    function toggleCompletion(book) {
        const bookIndex = books.findIndex(b => b.id === book.id);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            updateBookLists();
        }
    }

    function editBookItem(book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;

        books = books.filter(b => b.id !== book.id);
        updateLocalStorage();
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchQuery = document.getElementById('searchBookTitle').value.trim().toLowerCase();

        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery));
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        filteredBooks.forEach(book => {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    });
});
