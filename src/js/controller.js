import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 1. Loading Recipe
    recipeView.renderSpinner(recipeContainer);
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(` ${err.message}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search
    await model.loadSearchResults(query);

    // 3. Render results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
