import * as model from './model.js'; // Remark: Importing all from model and stored in model object
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime'; // Remark: Polyfilling async - await
import 'core-js/stable'; // Remark: Polyfilling advanced features and everything else and parcel is used for transpiling
// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpinner();

		// Key: Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());
		bookmarksView.update(model.state.bookmarks);

		// Key: Loading recipe
		await model.loadRecipe(id);

		// Key: Rendering recipe
		recipeView.render(model.state.recipe);

		// Key: Load search results for existing query
		if (model.state.search.query !== ``) {
			await model.loadSearchResults(model.state.search.query);

			// Key: Render search results for existing query
			resultsView.render(model.getSearchResultsPage(1));

			// Key: Render initial pagination button
			paginationView.render(model.state.search);
		}
	} catch {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		// Key: Get search query
		const query = searchView.getQuery();
		if (!query) return;

		resultsView.renderSpinner();

		// Key: Loading search result
		await model.loadSearchResults(query);

		// Key: Store query into local storage
		model.storeQuery();

		// Key: Render search result
		resultsView.render(model.getSearchResultsPage(1));

		// Key: Render initial pagination button
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

const controlPagination = function (goToPage) {
	// Key: Render new results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// Key: Render new pagination button
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Key: Update recipe servings (in state)
	model.updateServings(newServings);
	// Key: Update the recipe view
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// Key: Add/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// Key: Update the modified recipe to DOM
	recipeView.update(model.state.recipe);

	// Key: Render list of bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		// Key: Show loading spinner
		addRecipeView.renderSpinner();

		// Key: Upload new recipe data
		await model.uploadRecipe(newRecipe);

		// Key: Render recipe
		recipeView.render(model.state.recipe);

		// Key: Render recipe in bookmarks
		bookmarksView.render(model.state.bookmarks);

		// Key: Success message
		addRecipeView.renderMessage();

		// Key: Change ID in URL
		window.history.pushState(null, ``, `#${model.state.recipe.id}`); // Remark: (state, title, url)
		// window.history.back() // Remark: Going back to last page
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

const controlGenerateUploadRecipe = function () {
	// Key: Close window
	addRecipeView.toggleWindow();

	// Key: Regenerate the upload recipe form
	if (addRecipeView.formChanged())
		setTimeout(() => addRecipeView.render(true), 500);
};

const init = function () {
	// Point: Implementing Publisher-Subscriber pattern
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	searchView.addHandlerSearch(controlSearchResults);
	recipeView.addHandlerUpdateServing(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
	addRecipeView.addHandlerHideWindow(controlGenerateUploadRecipe);
	// controlServings(); // Important: Pitfall of using Async function
};
init();
