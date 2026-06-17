import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import WorkflowCard from '../components/WorkflowCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  const fetchResults = async (searchQuery, pageNum) => {
    if (!searchQuery) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/search', { params: { q: searchQuery, page: pageNum, limit: 12 } });
      setResults(res.data.data.items || []);
      setTotalPages(res.data.data.totalPages || 1);
      setTotalHits(res.data.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery, page);
    }
  }, [initialQuery, page]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="page-container">
      <div className="search-header-large">
        <h1 className="page-title text-center">Global Exploration</h1>
        <p className="page-subtitle text-center mb-4">Search across all workflows, templates, and documentation.</p>
        <SearchBar onSearch={handleSearch} initialValue={query} placeholder="e.g., 'docker compose setup', 'k8s ingress'" />
      </div>

      {query && (
        <div className="search-results-meta">
          Showing {totalHits} results for "<strong>{query}</strong>"
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="workflow-grid">
            {results.length > 0 ? (
              results.map(item => (
                <WorkflowCard key={item._id} workflow={item} />
              ))
            ) : query && !isLoading ? (
              <div className="empty-state">No matches found. Try adjusting your keywords.</div>
            ) : null}
          </div>

          {results.length > 0 && (
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
