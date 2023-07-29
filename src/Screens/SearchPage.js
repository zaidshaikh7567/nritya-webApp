import React, { useState } from 'react';
import { InstantSearch, SearchBox, Hits, Stats } from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import StudioCard from "../Components/StudioCard";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'tRp4jvJoUy1YAjgXNyxTRbe1YQjsXaBg', // Be sure to use a Search API Key
    nodes: [
      {
        host: '2ojni54h1zxeg0dyp-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
        port: '443',
        protocol: 'https',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  // So you can pass any parameters supported by the search endpoint below.
  // queryBy is required.
  additionalSearchParameters: {
    query_by: 'studioName,danceStyles,description',
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;
const SearchPage = () => {
  
  const Hit = ({ hit }) => (
   
   <div>
      <StudioCard studioName={hit.studioName} studioDanceStyles={hit.danceStyles}/>
      <br></br>
      </div>

    
  );

  return (
    <>
    <InstantSearch searchClient={searchClient} indexName="companies">
      <SearchBox autoFocus />
      <Stats />
      <Hits hitComponent={Hit} />
    </InstantSearch>
    </>
  );
};

export default SearchPage;












/*
function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const { entity } = useParams();

  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = event.target.elements.search.value.trim();

    if (searchValue) {
      searchStudios(searchValue)
        .then((results) => {
          setSearchResults(results);
          console.log("Results",results)
          setShowNoResults(results.length === 0);
        })
        .catch((error) => {
          console.error('Error searching studios:', error);
          setSearchResults([]);
          setShowNoResults(true);
        });
    }
  };

  // Function to search for strings across specified fields of studios in Firebase Firestore
  const searchStudios = async (searchQuery) => {
    try {
      // Perform search with Typesense InstantSearch
      const searchResponse = await searchClient.search(searchQuery);
      const results = searchResponse.hits.map((hit) => hit._highlightResult);
      return results;
    } catch (error) {
      console.error('Error searching studios:', error);
      return [];
    }
  };

  return (
    <div>
      <h1>Search {entity}</h1>

      <Form onSubmit={handleSearch}>
        <Form.Group>
          <div className="input-group rounded">
            <Form.Control type="text" name="search" className="rounded" placeholder="Enter your search query" />
            <div className="input-group-append">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </div>
        </Form.Group>
      </Form>

      {showNoResults && <Alert variant="info">No results found.</Alert>}
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results for {entity}</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <Link to={`/studios/${result.id}`}>{result.studioName}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
*/