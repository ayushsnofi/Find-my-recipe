import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import RecipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import BookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// Polifying everthing else
import 'core-js/stable';
// Polifying async/await
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import recipeview from './views/recipeview.js';
import bookmarksView from './views/bookmarksView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    RecipeView.renderSpinner();

    // 0. Update Result View to mark selected Result
    resultsView.update(model.getSearchResultPage());

    // 1) Updating bookmarksView
    BookmarksView.update(model.state.bookmarks);

    // console.log(model.state.recipe);
    await model.loadRecipe(id);

    // 2. Rendering Recipe
    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError(console.log(err));
  }
};
// controlRecipe();
// window.addEventListener('hashchange', controlRecipe());
// console.log(controlRecipe());
const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    // 1)Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2)Laod search results
    await model.loadSearchResult(query);
    // 3) Render Results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4) Rendering initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(`${err}@@@@`);
    throw err;
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultPage(gotoPage));

  // 4) Rendering initial Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // Update the recipe servings (in state)
  model.updateServings(newServing);
  // Update the recipe view
  // recipeview.render(model.state.recipe);
  recipeview.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or Remove Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeview.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Loading Spinner
    addRecipeView.renderSpinner();
    // Upload the new Recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeview.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render BookmakrView
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWndow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`@@@ ${err}`);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipe);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
// console.log(model.state.bookmarks);
// console.log('hey');
const clearBookmark = function () {
  localStorage.clear('bookmarks');
};
// clearBookmark();
