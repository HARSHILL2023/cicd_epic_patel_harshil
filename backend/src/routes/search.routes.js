// src/routes/search.routes.js
import express from 'express';
import {
  globalSearch,
  getAllTags,
  searchByTag,
  getPopularSearches,
  getRecentSearches,
  autocomplete,
  fuzzySearch,
  exactSearch,
  searchByCategory,
  searchByLanguage,
  searchByTool,
  advancedSearch,
  getSuggestions,
  getSearchHistory,
  getTrendingSearches,
  getRecommendedSearches,
  filterSearch,
  searchYaml,
  searchSnippets,
  searchErrors
} from '../controllers/search.controller.js';

const router = express.Router();

// ─── Named static routes BEFORE dynamic param routes ─────────────────────────
router.get('/tags', getAllTags);
router.get('/popular', getPopularSearches);
router.get('/recent', getRecentSearches);
router.get('/autocomplete', autocomplete);
router.get('/fuzzy', fuzzySearch);
router.get('/exact', exactSearch);
router.get('/advanced', advancedSearch);
router.get('/suggestions', getSuggestions);
router.get('/history', getSearchHistory);
router.get('/trending', getTrendingSearches);
router.get('/recommended', getRecommendedSearches);
router.get('/filter', filterSearch);
router.get('/yaml', searchYaml);
router.get('/snippets', searchSnippets);
router.get('/errors', searchErrors);

// ─── Dynamic param routes ─────────────────────────────────────────────────────
router.get('/by-tag/:tag', searchByTag);
router.get('/category/:name', searchByCategory);
router.get('/language/:lang', searchByLanguage);
router.get('/tool/:tool', searchByTool);

// ─── Base search route (handles ?q= query param) ──────────────────────────────
router.get('/', globalSearch);

export default router;
