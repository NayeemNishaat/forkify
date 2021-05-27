import View from './view.js';
import previewView from './previewView.js';

class BookmarksView extends View {
	_parentElement = document.querySelector(`.bookmarks__list`);
	_errorMessage = `No bookmarks yet!`;
	_message = ``;

	addHandlerRender(handler) {
		window.addEventListener(`load`, handler);
	}

	_generateMarkup() {
		return this._data
			.map((bookmark) => previewView.render(bookmark, false))
			.join(``);
	}

	addHandlerHome(handler) {
		document
			.querySelector(`.header__logo`)
			.addEventListener(`click`, handler);
	}
}
export default new BookmarksView();
