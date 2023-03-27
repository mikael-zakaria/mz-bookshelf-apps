document.addEventListener('DOMContentLoaded', function() {

    const books = [];
    const RENDER_EVENT = 'render-book';
    const submitForm = document.getElementById('inputBook');


    function generateID() {
        return +new Date();
    }    


    function generateBookshelfObject(id, title, author, year, isComplete){
        return {
            id,
            title,
            author,
            year,
            isComplete
          }
    }


    function addBook () {

        const inputBookTitle        = document.getElementById('inputBookTitle').value;
        const inputBookAuthor       = document.getElementById('inputBookAuthor').value;
        const inputBookYear         = document.getElementById('inputBookYear').value;
        const inputBookIsComplete   = document.getElementById('inputBookIsComplete').checked;
        const generateId            = generateID();

        const bookShelfObject = generateBookshelfObject(generateId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

        books.push(bookShelfObject);

        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();

    }


    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });


    function makeBook (bookObject) {

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = bookObject.title;

        const author = document.createElement('p');
        author.innerText = "Penulis : " + bookObject.author;

        const year = document.createElement('p');
        year.innerText = "Tahun : " + bookObject.year;

        const article = document.createElement('article');
        article.classList.add('book_item');
        article.append(bookTitle, author, year);

        if (bookObject.isComplete) {
            
            const btnUnread = document.createElement('button');
            btnUnread.classList.add('green');
            btnUnread.innerText = 'Belum Selesai Dibaca';

            btnUnread.addEventListener('click', function() {
                addAlreadyRead(bookObject.id);
            });


            const btnDelete = document.createElement('button');
            btnDelete.classList.add('red');
            btnDelete.innerText = 'Hapus Buku';

            btnDelete.addEventListener('click', function(){
                if (confirm('Apakah Anda Yakin Menghapus Data Berikut?')) {
                    removeBook(bookObject.id);
                } else {
                
                }
            });


            const btnGroup = document.createElement('div');
            btnGroup.classList.add('action');
            btnGroup.append(btnUnread, btnDelete);

            article.append(btnGroup);

        } else {

            const btnAlreadyRead = document.createElement('button');
            btnAlreadyRead.classList.add('green');
            btnAlreadyRead.innerText = 'Selesai Dibaca';

            btnAlreadyRead.addEventListener('click', function(){
                addUnread(bookObject.id);
            });


            const btnDelete = document.createElement('button');
            btnDelete.classList.add('red');
            btnDelete.innerText = 'Hapus Buku';

            btnDelete.addEventListener('click', function(){
                if (confirm('Apakah Anda Yakin Menghapus Data Berikut?')) {
                    removeBook(bookObject.id);
                } else {
                
                }
            });


            const btnGroup = document.createElement('div');
            btnGroup.classList.add('action');
            btnGroup.append(btnAlreadyRead, btnDelete);

            article.append(btnGroup);

        }
        return article;
    }

    

    const btnSearch = document.getElementById('searchSubmit');
    const bookField = document.getElementById('searchBookTitle');
    btnSearch.addEventListener('click', searchBook);
    function searchBook(event) {
        event.preventDefault();

        const title = bookField.value;
        
        if(title === ''){
            document.dispatchEvent(new Event(RENDER_EVENT));
        } else {
            findBookObjectTitle(title);
        }
        
    }
    function findBookObjectTitle (bookTitle) {

        const alreadyRead     = document.getElementById('completeBookshelfList'); 
        alreadyRead.innerHTML = '';

        const unread          = document.getElementById('incompleteBookshelfList');
        unread.innerHTML      = '';

        for (const book of books) {

            const bookElement = makeBook(book);

            if(book.isComplete) {
                if(book.title.toLowerCase().match(bookTitle.toLowerCase())){
                    alreadyRead.append(bookElement);
                }
            } else {
                if(book.title.toLowerCase().match(bookTitle.toLowerCase())){
                    unread.append(bookElement);
                }
            }
        }
    }


    function addAlreadyRead (bookId) {
        const bookIdTarget = findBookObjectId(bookId);
    
        if (bookIdTarget == null) return;

        bookIdTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }

    function addUnread (bookId) {
        const bookIdTarget = findBookObjectId(bookId);
    
        if (bookIdTarget == null) return;

        bookIdTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }

    function findBookObjectId (bookId) {

        for (const book of books) {

            if(book.id === bookId){
                return book;
            }
        }
        return null;
    }


    function removeBook (bookId) {
        const bookIdTarget = findBookId(bookId);

        if (bookIdTarget === -1) return;

        books.splice(bookIdTarget, 1);

        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();

    }

    function findBookId(bookId){

        for (const index in books) {

            if(books[index].id === bookId){
                return index;
            }

        }
        return -1;
    }


    document.addEventListener(RENDER_EVENT, function() {

        const alreadyRead     = document.getElementById('completeBookshelfList'); 
        alreadyRead.innerHTML = '';

        const unread          = document.getElementById('incompleteBookshelfList');
        unread.innerHTML      = '';

        for (const book of books) {

            const bookElement = makeBook(book);

            if(book.isComplete) {
                alreadyRead.append(bookElement);
            } else {
                unread.append(bookElement);
            }

        }

    });


    
    const SAVED_EVENT = 'saved-books';
    const STORAGE_KEY = 'BOOKSHELF_APPS';
      
      function isStorageExist() /* boolean */ {
        if (typeof (Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage');
          return false;
        }
        return true;
      }

      function saveData() {

        // Cek apakah browser support storage
        // Di sini, kita menggunakan fungsi pembantu isStorageExist() yang mengembalikan 
        // nilai boolean untuk menentukan apakah memang benar didukung atau tidak.
        if (isStorageExist()) {
          const parsed = JSON.stringify(books);
          localStorage.setItem(STORAGE_KEY, parsed);
          document.dispatchEvent(new Event(SAVED_EVENT));
        }
      }

      // Digunakan untuk me load data dari localStorage
      function loadDataFromStorage() {

        const serializedData = localStorage.getItem(STORAGE_KEY);
        
        // Ubah data string json ke data array sesungguhnya
        let data = JSON.parse(serializedData);
       
        if (data !== null) {
          for (const book of data) {
            books.push(book);
          }
        }
       
        // Digunakan untuk memanggil/mentrigger event ini
        document.dispatchEvent(new Event(RENDER_EVENT));
      }

      // document.addEventListener(SAVED_EVENT, function () {
      //   console.log(localStorage.getItem(STORAGE_KEY));
      // });

    // Digunakan unutk menjalankan fungsi saat localstorage tersedia
    if (isStorageExist()) {
        loadDataFromStorage();
    }








});