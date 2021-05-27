export const state = {
	recipe: {},
	search: {
		query: ``,
		first: true,
		results: [],
		resultsPerPage: RES_PER_PAGE,
		page: 1
	},
	bookmarks: []
};
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

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
		...(recipe.key && { key: recipe.key }) // Remark: Trick to conditionally add propery into an object!
	};
};

export const loadRecipe = async function (id) {
	try {
		const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

		state.recipe = createRecipeObject(data);

		if (state.bookmarks.some((bookmark) => bookmark.id === id))
			state.recipe.bookmarked = true;
		else state.recipe.bookmarked = false;
	} catch (err) {
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;
		const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key })
			};
		});
	} catch (err) {
		throw err;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;

	const start = (page - 1) * state.search.resultsPerPage; // 0;
	const end = page * state.search.resultsPerPage; // 9

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});
	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};

export const storeQuery = function () {
	localStorage.setItem(`query`, JSON.stringify(state.search.query));
};

export const addBookmark = function (recipe) {
	// Key: Add bookmark
	state.bookmarks.push(recipe);

	// Key: Mark current recipe as bookmarked in DOM
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

	persistBookmarks();
};

export const deleteBookmark = function (id) {
	// Key: Delete bookmark
	const index = state.bookmarks.findIndex((el) => el.id === id);
	state.bookmarks.splice(index, 1);

	// Key: Mark current recipe as not bookmarked in DOM
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	persistBookmarks();
};

const init = function () {
	const storage = localStorage.getItem(`bookmarks`);
	if (storage) state.bookmarks = JSON.parse(storage);
	const qStorage = localStorage.getItem(`query`);
	if (qStorage) state.search.query = JSON.parse(qStorage);
};
init();

const clearBookmarks = function () {
	localStorage.clear(`bookmarks`);
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(
				(entry) => entry[0].startsWith(`ingredient`) && entry[1] !== ``
			)
			.map((ing) => {
				const ingArr = ing[1].trim().split(`,`);
				// const ingArr = ing[1].split(`,`).map(el=>el.trim());

				if (ingArr.length !== 3)
					throw new Error(`Wrong ingredient format!`);

				const [quantity, unit, description] = ingArr;
				return {
					quantity: quantity ? +quantity : null,
					unit,
					description
				};
			});
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients
		};
		const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
};
