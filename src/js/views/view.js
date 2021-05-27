import icons from 'url:../../img/icons.svg';

export default class View {
	_data;

	// Remark: Documentation JSDoc
	/**
	 * Render the received object to the DOM
	 * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
	 * @param {boolean} [render = true] If false create markup string insted of rendering to the DOM
	 * @returns {undefined | string} A markup string is returned if render = false
	 * @this {Object} View instance
	 * @author Nayeem Nishaat
	 * @todo  Finish implementation
	 */
	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();

		if (!render) return markup;

		this._clear();
		this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
	}

	update(data) {
		this._data = data;
		const newMarkup = this._generateMarkup();

		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll(`*`));
		const curElements = Array.from(
			this._parentElement.querySelectorAll(`*`)
		);

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i];
			// Important: Point: Text content is the textual content that exists inside an element. i.e: <p>text content</p>

			// if (!curEl.isEqualNode(newEl)) // Important: Remark: Not enough because when a parent's child element is changed then it means the entire parent is changed!

			// Key: Updates changed text
			if (
				!curEl.isEqualNode(newEl) &&
				curEl.firstChild?.nodeValue?.trim() !== `` &&
				curEl.firstChild?.nodeValue?.trim() !== undefined
			)
				curEl.textContent = newEl.textContent;

			// Key: Updates changed data and class attributes
			if (!curEl.isEqualNode(newEl))
				Array.from(newEl.attributes).forEach((newAttr) =>
					curEl.setAttribute(newAttr.name, newAttr.value)
				);
		});
	}

	_clear() {
		this._parentElement.innerHTML = ``;
	}

	renderSpinner() {
		const markup = `
			<div class="spinner">
			  <svg>
				<use href="${icons}#icon-loader"></use>
			  </svg>
			</div>
		`;
		this._parentElement.innerHTML = ``;
		this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `
	<div class="error">
		<div>
			<svg>
				<use
					href="${icons}#icon-alert-triangle"
				></use>
			</svg>
		</div>
		<p>${message}</p>
	</div>
		`;
		this._clear();
		this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
	}

	renderMessage(message = this._message) {
		const markup = `
	<div class="message">
		<div>
			<svg>
				<use
					href="${icons}#icon-smile"
				></use>
			</svg>
		</div>
		<p>${message}</p>
	</div>
		`;
		this._clear();
		this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
	}
}
