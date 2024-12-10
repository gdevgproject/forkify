import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Xử lý trường hợp AJAX trả về null do lỗi
    if (!data) {
      throw new Error('Không thể tải công thức. Vui lòng thử lại!');
    }
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Xử lý lỗi và hiển thị cho người dùng
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // Xử lý trường hợp AJAX trả về null do lỗi
    if (!data) {
      throw new Error('Không thể tải kết quả tìm kiếm. Vui lòng thử lại!');
    }
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    // Xử lý lỗi và hiển thị cho người dùng
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Thêm đánh dấu
  state.bookmarks.push(recipe);

  // Đánh dấu công thức hiện tại là đã đánh dấu
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Xóa đánh dấu
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Đánh dấu công thức hiện tại là chưa đánh dấu
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const invalidIngredients = [];
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          invalidIngredients.push(ing[1]);
          return null; // Bỏ qua nguyên liệu không hợp lệ
        }

        const [quantity, unit, description] = ingArr;

        // Kiểm tra kiểu dữ liệu và giá trị hợp lệ của quantity
        const parsedQuantity = quantity ? +quantity : null;
        if (parsedQuantity === null) {
          invalidIngredients.push(ing[1]);
          return null;
        }

        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
          invalidIngredients.push(ing[1]);
          return null;
        }

        return { quantity: parsedQuantity, unit, description };
      })
      .filter(ing => ing !== null); // Lọc bỏ các nguyên liệu null (không hợp lệ)

    if (invalidIngredients.length > 0) {
      console.warn('Các nguyên liệu không hợp lệ:', invalidIngredients);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây
    }

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    if (!data) {
      throw new Error('Không thể tải lên công thức. Vui lòng thử lại!');
    }
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
