import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

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

      // Xóa thông báo lỗi hiện có nếu có
      const existingError = input.parentElement.querySelector('.error-message');
      if (existingError) existingError.remove();

      // Bỏ qua các trường trống (ngoại trừ các trường bắt buộc)
      if (!input.value.trim() && !input.required) return;

      let errorMessage = '';

      // Xác thực dựa trên tên đầu vào
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
          if (!input.value || input.value < 1) {
            errorMessage = 'Thời gian chuẩn bị phải ít nhất 1 phút';
          }
          break;

        case 'servings':
          if (!input.value || input.value < 1) {
            errorMessage = 'Số khẩu phần phải ít nhất là 1';
          }
          break;

        default:
          // Xác thực nguyên liệu
          if (input.name?.startsWith('ingredient-')) {
            const inputValue = input.value.trim();
            if (!inputValue) return;

            const ingArr = inputValue.split(',').map(el => el.trim());

            if (ingArr.length !== 3) {
              errorMessage =
                'Sai định dạng! Vui lòng sử dụng: "Số lượng,Đơn vị,Mô tả"';
            } else {
              const [quantity] = ingArr;
              if (quantity && isNaN(quantity)) {
                errorMessage = 'Số lượng phải là một số!';
              }
            }
          }
      }

      // Thêm thông báo lỗi nếu xác thực không thành công
      if (errorMessage) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        input.parentElement.appendChild(errorElement);
      }
    });

    // Xác thực ít nhất một nguyên liệu khi gửi biểu mẫu
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
        errorElement.textContent = 'Cần ít nhất một nguyên liệu';
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