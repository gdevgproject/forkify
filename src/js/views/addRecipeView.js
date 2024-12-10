import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Công thức đã được tải lên thành công :)';

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

    // Kiểm tra nếu form đang được đóng (overlay hidden)
    if (this._overlay.classList.contains('hidden')) {
      this._clearForm(); // Reset form
      this._removeMessage(); // Xóa thông báo (nếu có)
    }
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerValidateInputs() {
    this._parentElement.addEventListener(
      'blur',
      e => {
        const input = e.target;
        if (!input.closest('.upload__column')) return;
        this._validateInput(input);
      },
      true
    );

    this._parentElement.addEventListener('submit', e => {
      let isValid = true;

      const inputs = Array.from(this._parentElement.querySelectorAll('input'));
      inputs.forEach(input => {
        if (!this._validateInput(input)) isValid = false;
      });

      const ingredients = Array.from(
        this._parentElement.querySelectorAll('[name^="ingredient-"]')
      ).filter(input => input.value.trim());

      if (ingredients.length === 0) {
        isValid = false;
        const firstIngInput = this._parentElement.querySelector(
          '[name="ingredient-1"]'
        );
        this._displayError(firstIngInput, 'Cần ít nhất một nguyên liệu');
        firstIngInput.focus();
      }

      if (!isValid) e.preventDefault();
    });
  }

  _validateInput(input) {
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    if (!input.value.trim() && !input.required) return true;

    let errorMessage = '';

    switch (input.name) {
      case 'title':
        if (input.value.trim().length < 3) {
          errorMessage = 'Tiêu đề phải dài ít nhất 3 ký tự';
        }
        break;

      case 'publisher':
        if (!input.value.trim()) {
          errorMessage = 'Nhà xuất bản là bắt buộc';
        }
        break;

      case 'cookingTime':
        if (!input.value || isNaN(input.value) || input.value <= 0) {
          errorMessage = 'Thời gian nấu phải là số lớn hơn 0';
        }
        break;

      case 'servings':
        if (!input.value || isNaN(input.value) || input.value <= 0) {
          errorMessage = 'Số khẩu phần phải là số lớn hơn 0';
        }
        break;

      default:
        if (input.name?.startsWith('ingredient-')) {
          const inputValue = input.value.trim();
          if (!inputValue) break;

          const ingArr = inputValue.split(',').map(el => el.trim());

          if (ingArr.length !== 3) {
            errorMessage =
              'Sai định dạng! Vui lòng sử dụng: "Số lượng,Đơn vị,Mô tả"';
          } else {
            const [quantity, unit, description] = ingArr;
            if (quantity && isNaN(quantity)) {
              errorMessage = 'Số lượng phải là một số!';
            }
            if (quantity && Number(quantity) < 0) {
              errorMessage = 'Số lượng không được âm!';
            }
            if (!unit) {
              errorMessage = 'Đơn vị không được để trống!';
            }
            if (!description) {
              errorMessage = 'Mô tả không được để trống!';
            }
          }
        }
    }

    if (errorMessage) {
      this._displayError(input, errorMessage);
      return false;
    }

    return true;
  }

  _displayError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _clearForm() {
    const inputs = Array.from(this._parentElement.querySelectorAll('input'));
    inputs.forEach(input => {
      input.value = '';
      const error = input.parentElement.querySelector('.error-message');
      if (error) error.remove();
    });
  }

  _removeMessage() {
    const messageEl = this._parentElement.querySelector('.message');
    if (messageEl) messageEl.remove();
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
