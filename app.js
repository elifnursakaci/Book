let bookList = [];
let basketList = [];

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

const toggleModal = () => {
  const basketModalEl = document.querySelector(".basket__modal");
  basketModalEl.classList.toggle("active");
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => {
      bookList = books;
      createBookItemsHtml(); // Kitaplar yüklendikten sonra oluşturulmalı
    });
};

getBooks();

const createBooksStras = (starRate) => {
  let starRateHtml = "";
  for (let i = 0; i < 5; i++) {
    if (Math.round(starRate) >= i)
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    else starRateHtml += `<i class="bi-star-fill"></i>`;
  }
  return starRateHtml;
};

const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book__list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    bookListHtml += `<div class="col-5 ${
      index % 2 === 0 ? "offset-2" : ""
    } mb-5">
    <div class="row book__card">
      <div class="col-6">
        <img
          class="img-fluid shadow"
          src="${book.imgSource}"
          alt="Nutuk Mustafa Kemal Atatürk"
          height="400"
          width="258"
        />
      </div>

      <div class="col-6 d-flex flex-column justify-content-between">
        <div class="book_detail">
          <span class="fos gray fs-5">${book.author}</span><br />
          <span class="fs-4 fw_bold">${book.name}</span><br />
          <span class="book__star-rate">
            ${createBooksStras(book.starRate)}
            <span class="gray">${book.reviewCount} reviews </span>
          </span>
        </div>
        <p class="book__description fos gray fs-4">
          ${book.description}
        </p>
        <div>
          <span class="black fw-bold fs-4 me-2">${book.price}$</span>
          
          ${
            book.oldPrice
              ? `<span class="gray fs-4 old__price">${book.oldPrice}$</span>`
              : ""
          } 
        </div>
        <button class="btn__purple" oclick="addBookToBasket(${
          book.id
        })">Add Basket</button>
      </div>
    </div>
  </div>`;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  FINANCE: "Finans",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  SCIENCE: "Bilim",
  HISTORY: "Tarih",
};

const createBookTypeHtml = () => {
  const filterEl = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];

  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1)
      filterTypes.push(book.type);
  });

  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="" onclick="filterBooks(this)" data-type="${type}">
        ${BOOK_TYPES[type] || type}
      </li>`;
  });

  filterEl.innerHTML = filterHtml;
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket__list");
  const totalPriceEl = document.querySelector(".total__basket");

  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    totalPrice += item.price;
    basketListHtml += `<li class="basket_item">
        <img
          src="${item.product.imgSource}"
          width="120"
          height="100"
        />
        <div class="basket_item-info">
          <h3 class="book_name">${item.product.name}</h3>
          <span class="book_price">${item.product.price}$</span><br />
          <span class="book_remove" onclick="totalItemToBasket(${item.product.id})">remove</span>
        </div>
        <div class="book_count">
          <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})">-</span>
          <span class="my-5">${item.quantity}</span>
          <span class="increase onclick="increaseItemToBasket(${item.product.id})">+</span>
        </div>
      </li>`;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket__item">No items to By again.</li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Total : " + totalPrice.toFixed(2) + "$" : null;
  return basketListHtml;
};

const decreaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity > 1) {
      basketList[findedIndex].quantity--;
    } else {
      removeItemToBasket(bookId);
    }
  }
};

const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (
      basketList[findedIndex].quantity != basketList[findedIndex].product.stock
    )
      basketList[findedIndex].quantity += 1;
    else removeItemToBasket(bookId);
  }
};

const removeItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    basketList.splice(findedIndex, 1);
  }
  listBasketItems();
};

// Kitabı sepete ekleme fonksiyonu
const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);
  const basketCountEl = document.querySelector(".basket__count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  if (findedBook) {
    const basketIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketIndex == -1) {
      let addedItem = { quantity: 1, product: findedBook };
      basketList.push(addedItem);
      console.log("Ürün sepete eklendi:", basketList);
    } else {
      basketList[basketIndex].quantity += 1;
      console.log("Ürün miktarı arttırıldı:", basketList);
    }
    listBasketItems();
  }
};

// Fonksiyonun çağrılması
addBookToBasket();

setTimeout(() => {
  createBookItemsHtml();
});

function filterBooks(filterEl) {
  let bookType = filterEl.dataset.type;
  getBooks();
  if (bookType != "ALL");
  bookList = bookList.filter((book) => book.type == bookType);
  createBookItemsHtml();
}
toastr.info("Welcome To My Web Site");
