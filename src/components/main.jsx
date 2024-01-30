import React, { useEffect, useState } from "react";
import styles from './assets/pokeTable.module.css';
import ReactPaginate from "react-paginate";
import NextButton from './common/nextButton';
import PrevButton from './common/prevButon';

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0'
};

const PokemonTable = () => {
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      const data = await response.json();

      const pokemonData = await Promise.all(data.results.map(async (pokemon) => {
        const detailedResponse = await fetch(pokemon.url);
        return await detailedResponse.json();
      }));

      setPokemonList(pokemonData);
      setPageCount(Math.ceil(pokemonData.length / itemsPerPage));
    } catch (error) {
      console.error(`ERROR: ${error}`);
    }
  };

  const handleCardClick = (pokemon) => {
    if (isModalOpen && selectedPokemon && pokemon.id === selectedPokemon.id) {
      setIsModalOpen(false);
      setSelectedPokemon(null);
    } else {
      setSelectedPokemon(pokemon);
      setIsModalOpen(true);
    }
  };

  const handlePageChange = ({ selected }) => {
    setSelectedPokemon(null);
    setCurrentPage(selected);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setSelectedPokemon(null);
    setCurrentPage(0);
  };

  const handleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((selectedType) => selectedType !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    setSelectedPokemon(null);
    setCurrentPage(0);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPageCount(Math.ceil(filteredPokemonList.length / newItemsPerPage));
    setCurrentPage(0);
  };

  const filteredPokemonList = pokemonList
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter((pokemon) => selectedTypes.length === 0 || pokemon.types.some((type) => selectedTypes.includes(type.type.name)));

  const visiblePokemonList = filteredPokemonList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isModalOpen && e.target.classList.contains(styles.detailsOverlay)) {
        setIsModalOpen(false);
        setSelectedPokemon(null);
      }
    };
  
    document.addEventListener("click", handleOutsideClick);
  
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);
  

  return (
    <div className={styles.pokemonTableContainer}>
      <div className={styles.listContainer}>
        <div className={styles.navigationList}>
          <label>Items per page: </label>
          <div>
            <button
              className={`${styles.navigationBtn} ${itemsPerPage === 10 && styles.activeButton}`}
              onClick={() => handleItemsPerPageChange(10)}
            >10</button>
            <button
              className={`${styles.navigationBtn} ${itemsPerPage === 20 && styles.activeButton}`}
              onClick={() => handleItemsPerPageChange(20)}
            >20</button>
            <button
              className={`${styles.navigationBtn} ${itemsPerPage === 50 && styles.activeButton}`}
              onClick={() => handleItemsPerPageChange(50)}
            >50</button>
          </div>
        </div><br></br>
        <div className={styles.searchBlock}>
          <input
            type="text"
            placeholder="Search Pokemon"
            value={searchText}
            className={styles.search}
            onChange={handleSearch}
          />
        </div>
        
        <div className={styles.searchFilter}>
          
          <div className={styles.typeFilter}>
            {Object.keys(typeColors).map((type) => (
              <div
                key={type}
                className={`${styles.typeTag} ${selectedTypes.includes(type) && styles.selected}`}
                style={{ backgroundColor: typeColors[type] }}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.pokemonList}>
          {visiblePokemonList.map((pokemon) => (
            <div
              key={pokemon.id}
              className={`${styles.pokemonCard} ${styles[pokemon.types[0].type.name]}`}
              onClick={() => handleCardClick(pokemon)}
            >
              <img className={styles.pokemonImage} src={pokemon.sprites.front_default} alt={pokemon.name} />
              <span className={`${styles.pokemonName} ${styles[pokemon.types[0].type.name]}`}>{pokemon.name}</span>
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className={`${styles.typeName} ${styles[type.type.name]}`}
                  style={{ color: typeColors[type.type.name] }}
                >
                  <span className={styles.upperCase}>{type.type.name}</span><br></br>
                </span>
              ))}
            </div>
          ))}
        </div >
        <ReactPaginate
          previousLabel={<PrevButton />}
          nextLabel={<NextButton />}
          breakLabel={''}
          pageCount={pageCount}
          forcePage={currentPage}
          onPageChange={handlePageChange}
          activeClassName={styles.activePage}
          pageClassName={styles.pages}
          previousClassName={styles.prev}
          nextClassName={styles.next}
          style={styles.navigation}
        />
      </div>

      {isModalOpen && selectedPokemon &&(
        <div className={`${styles.detailsOverlay} ${styles.detailsContainer}`}>
          <div className={styles.detailsCard}>
            <span
              style={{ fontFamily: 'Cursive', textShadow: "2px 2px 4px #000", color: typeColors[selectedPokemon.types[0].type.name], fontWeight: 'bolder', fontSize: '40px' }}>
              {selectedPokemon.name.toUpperCase()}
            </span>
            <img className={styles.pokemonImage} src={selectedPokemon.sprites.other.showdown.front_default} alt={selectedPokemon.name} />
            <div className={styles.detailsInfo}>
              <span><span style={{ color: '#a1a1a1' }}>Type:</span> {selectedPokemon.types.map((type) => type.type.name).join(', ')}<br /><br /></span>
              <span><span style={{ color: '#a1a1a1' }}>Height:</span> {selectedPokemon.height}<br /><br /></span>
              <span><span style={{ color: '#a1a1a1' }}>Weight:</span> {selectedPokemon.weight}<br /><br /></span>
              <span><span style={{ color: '#a1a1a1' }}>Base Experience:</span> {selectedPokemon.base_experience}<br /><br /></span>
              <span><span style={{ color: '#a1a1a1' }}>Abilities:</span> {selectedPokemon.abilities.map((ability) => ability.ability.name).join(', ')}<br /><br /></span>
              <span>Stats:<br />
                {selectedPokemon.stats.map((stat) => (
                  <span><span style={{ color: '#a1a1a1' }}>{stat.stat.name}:</span> {stat.base_stat}<br /></span>
                ))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonTable;
