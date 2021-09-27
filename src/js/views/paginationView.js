import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      //   console.log(gotoPage);
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerpage
    );
    // console.log(numPages);
    // Page 1 and ohter pages
    if (curPage === 1 && numPages) {
      return `
     <button data-goto=" ${
       curPage + 1
     }" class="btn--inline pagination__btn--next">
     <span>Page ${curPage + 1}</span>
     <svg class="search__icon">
       <use href="${icons}#icon-arrow-right"></use>
     </svg>
   </button>
     `;
    }
    // Page 1 and no other pages
    // page last
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto=" ${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>

        
        `;
    }
    // other pages
    if (curPage < numPages) {
      return `
    <button data-goto=" ${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>

    <button data-goto=" ${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>  
      `;
    }

    return '';
  }
}

export default new PaginationView();
