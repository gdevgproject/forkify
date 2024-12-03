import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerValidateInputs();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerValidateInputs() {
    this._parentElement.addEventListener('input', e => {
      const input = e.target;

      // Remove existing error message if any
      const existingError = input.parentElement.querySelector('.error-message');
      if (existingError) existingError.remove();

      // Skip empty fields (except required ones)
      if (!input.value.trim() && !input.required) return;

      let errorMessage = '';

      // Validate based on input name
      switch (input.name) {
        case 'title':
          if (input.value.trim().length < 3) {
            errorMessage = 'Title must be at least 3 characters long';
          }
          break;

        case 'publisher':
          if (!input.value.trim()) {
            errorMessage = 'Publisher is required';
          }
          break;

        case 'cookingTime':
          if (!input.value || input.value < 1) {
            errorMessage = 'Preparation time must be at least 1 minute';
          }
          break;

        case 'servings':
          if (!input.value || input.value < 1) {
            errorMessage = 'Servings must be at least 1';
          }
          break;

        default:
          // Validate ingredients
          if (input.name?.startsWith('ingredient-')) {
            const inputValue = input.value.trim();
            if (!inputValue) return;

            const ingArr = inputValue.split(',').map(el => el.trim());

            if (ingArr.length !== 3) {
              errorMessage =
                'Wrong format! Please use: "Quantity,Unit,Description"';
            } else {
              const [quantity] = ingArr;
              if (quantity && isNaN(quantity)) {
                errorMessage = 'Quantity must be a number!';
              }
            }
          }
      }

      // Add error message if validation failed
      if (errorMessage) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        input.parentElement.appendChild(errorElement);
      }
    });

    // Validate at least one ingredient on form submit
    this._parentElement.addEventListener('submit', e => {
      const ingredients = Array.from(
        this._parentElement.querySelectorAll('[name^="ingredient-"]')
      ).filter(input => input.value.trim());

      if (ingredients.length === 0) {
        e.preventDefault();
        const firstIngInput = this._parentElement.querySelector(
          '[name="ingredient-1"]'
        );
        const existingError =
          firstIngInput.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'At least one ingredient is required';
        firstIngInput.parentElement.appendChild(errorElement);
      }
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
