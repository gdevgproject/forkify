import * as model from './model.js';
import recipeView from './views/recipeView.js';
const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    // 1. Loading Recipe
    recipeView.renderSpinner(recipeContainer);
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(` ${err.message}`);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
