import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const resultsStart = (curPage - 1) * this._data.resultsPerPage + 1;
    const resultsEnd = Math.min(
      curPage * this._data.resultsPerPage,
      this._data.results.length
    );

    // Tạo các nút first và last
    const firstBtn = `
        <button data-goto="1" class="btn--inline pagination__btn--first">
            <span>Trang đầu</span>
        </button>
    `;

    const lastBtn =
      numPages > 1
        ? `
        <button data-goto="${numPages}" class="btn--inline pagination__btn--last">
            <span>Trang cuối</span>
        </button>
    `
        : '';

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        ${lastBtn}
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Trang ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        <span class="pagination__pages">Hiển thị ${resultsStart}-${resultsEnd} / ${
        this._data.results.length
      }</span>
      `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        ${firstBtn}
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Trang ${curPage - 1}</span>
        </button>
        <span class="pagination__pages">Hiển thị ${resultsStart}-${resultsEnd} / ${
        this._data.results.length
      }</span>
      `;
    }

    // Other page
    if (curPage < numPages) {
      return `
        ${firstBtn}
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Trang ${curPage - 1}</span>
        </button>
        
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Trang ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        ${lastBtn}
        <span class="pagination__pages">Hiển thị ${resultsStart}-${resultsEnd} / ${
        this._data.results.length
      }</span>
      `;
    }

    // Page 1, and there are NO other pages
    return `<span class="pagination__pages">Hiển thị ${resultsStart}-${resultsEnd} / ${this._data.results.length}</span>`;
  }
}

export default new PaginationView();
