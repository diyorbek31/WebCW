document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.querySelector('.books');

    // Event Delegation for Edit & Save Buttons
    booksContainer.addEventListener('click', (event) => {
        const button = event.target;
        const bookItem = button.closest('.single_book');

        if (button.classList.contains('edit-button')) {
            handleEdit(bookItem, button);
        } else if (button.classList.contains('save-button')) {
            handleSave(bookItem, button);
        } else if (button.classList.contains('delete-button')) {
            handleDelete(bookItem);
        }
    });

    function handleEdit(bookItem, editButton) {
        const titleP = bookItem.querySelector('.book-title p');
        const titleInput = bookItem.querySelector('.book-title input');
        const authorP = bookItem.querySelector('.book-author p');
        const authorInput = bookItem.querySelector('.book-author input');
        const genreP = bookItem.querySelector('.book-genre p');
        const genreInput = bookItem.querySelector('.book-genre input');
        const saveButton = bookItem.querySelector('.save-button');

        // Show input fields, hide text
        titleP.style.display = 'none';
        titleInput.style.display = 'inline-block';
        authorP.style.display = 'none';
        authorInput.style.display = 'inline-block';
        genreP.style.display = 'none';
        genreInput.style.display = 'inline-block';

        editButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
    }

    function handleSave(bookItem, saveButton) {
        const id = bookItem.getAttribute('data-book-id');
        const titleP = bookItem.querySelector('.book-title p');
        const titleInput = bookItem.querySelector('.book-title input');
        const authorP = bookItem.querySelector('.book-author p');
        const authorInput = bookItem.querySelector('.book-author input');
        const genreP = bookItem.querySelector('.book-genre p');
        const genreInput = bookItem.querySelector('.book-genre input');
        const editButton = bookItem.querySelector('.edit-button');

        const book_title = titleInput.value.trim();
        const book_author = authorInput.value.trim();
        const book_genre = genreInput.value.trim();

        // Check if inputs are empty
        if (!book_title || !book_author || !book_genre) {
            alert("Fields cannot be empty!");
            return;
        }

        fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_title, book_author, book_genre })
        })
        .then(response => response.json())
        .then(data => {
            // Update UI
            titleP.textContent = book_title;
            authorP.textContent = book_author;
            genreP.textContent = book_genre;

            titleP.style.display = 'inline-block';
            titleInput.style.display = 'none';
            authorP.style.display = 'inline-block';
            authorInput.style.display = 'none';
            genreP.style.display = 'inline-block';
            genreInput.style.display = 'none';

            editButton.style.display = 'inline-block';
            saveButton.style.display = 'none';
        })
        .catch(error => console.error("Error updating book:", error));
    }

    function handleDelete(bookItem) {
        const id = bookItem.getAttribute('data-book-id');

        if (!confirm("Are you sure you want to delete this book?")) return;

        fetch(`/api/books/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                bookItem.remove();
            } else {
                console.error("Failed to delete book.");
            }
        })
        .catch(error => console.error("Error deleting book:", error));
    }
});
