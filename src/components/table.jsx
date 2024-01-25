import React, { useEffect, useState } from "react";
import styles from './assets/pokeTable.module.css';
import ReactPaginate from "react-paginate";
import NextButton from './common/nextButton';
import PrevButton from './common/prevButon';
import { useData } from "./common/dataContext";


const typeColors = {
  normal: 'gray',
  fire: 'red',
  water: 'blue',
  grass: 'green',
  electric: 'yellow',
  ice: 'lightblue',
  fighting: 'orange',
  poison: 'purple',
  ground: 'brown',
  flying: 'skyblue'
};

const Table = (prop) => {
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [currentPokemonsByTags, setCurrentPokemonsByTags] = useState([]);
    const [currentTags, setCurrentTags] = useState([]);
  
    const itemsOnPage = useData();

    const fetchDataWithoutTags = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsOnPage.itemsValue}&offset=${currentPage * itemsOnPage.itemsValue}`);
      const data = await response.json();

      const pokemonData = data.results.map(async (pokemon) => {
        let detailedResponse = await fetch(pokemon.url);
        let detailedData = await detailedResponse.json();
        return detailedData;
      })
      let pokemonDetailsData = await Promise.all(pokemonData);

      setPokemonDetails(pokemonDetailsData);
      setPageCount(Math.ceil(data.count / itemsOnPage.itemsValue));
    };

    const fetchDataWithTags = async () => {
      let allPokemonDetailsData = [];
    
      for (const tags of itemsOnPage.pokeTags) {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${tags}`);
        const data = await response.json();
    
        const pokemonData = data.pokemon.map(async (pokemon) => {
          let detailedResponse = await fetch(pokemon.pokemon.url);
          let detailedData = await detailedResponse.json();
          
          return detailedData;
        });
    
        let pokemonDetailsData = await Promise.all(pokemonData);
        allPokemonDetailsData = allPokemonDetailsData.concat(pokemonDetailsData);
      }
    
      const uniquePokemonDetailsData = Array.from(new Set(allPokemonDetailsData.map(JSON.stringify)))
        .map(JSON.parse);

      setCurrentPokemonsByTags(uniquePokemonDetailsData);
      if (typeof itemsOnPage.itemsValue !== 'number') {
        setPokemonDetails(currentPokemonsByTags.slice(currentPage * 10, (currentPage + 1) * 10));
      } else {
        setPokemonDetails(currentPokemonsByTags.slice(currentPage * itemsOnPage.itemsValue, (currentPage + 1) * itemsOnPage.itemsValue));
      }
      setPageCount(Math.ceil(uniquePokemonDetailsData.length / itemsOnPage.itemsValue));
      setCurrentTags(itemsOnPage.pokeTags);
    };

    const fetchDataByName = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${itemsOnPage.searchContent}`);

      const data = await response.json();
      setPokemonDetails([data]);
      setPageCount(Math.ceil(data.count / itemsOnPage.itemsValue));
    }

    useEffect(() => {
      try {
        if (itemsOnPage.pokeTags.length > 0) {
          fetchDataWithTags();
        } else if (itemsOnPage.pokeTags.length === 0 && itemsOnPage.searchContent == undefined || itemsOnPage.searchContent == '') {
          fetchDataWithoutTags();
        } else {
          fetchDataByName();
        }
      } catch (error) {
        console.error(`ERROR: ${error}`);
      }
    }, [currentPage, itemsOnPage.itemsValue, itemsOnPage.pokeTags, currentTags, itemsOnPage.searchContent]);
    
      const changePage = ({ selected }) => {
        setCurrentPage(selected);
      };
    
      return (
        <div className={styles.pokeArea}>
            <ReactPaginate
                className={styles.pokePaginate}
                previousLabel={<PrevButton/>}
                nextLabel={<NextButton/>}
                breakLabel={''}
                pageCount={pageCount}
                forcePage={currentPage}
                onPageChange={changePage}
                activeClassName={styles.activePage}
                pageClassName={styles.pages}
                previousClassName={styles.prev}
                nextClassName={styles.next}
            />
            <div className={styles.pokeList} style={{ gridTemplateRows: `repeat(${itemsOnPage.itemsValue / 5}, 1fr)` }}>
                {pokemonDetails.map((pokemon) => (
                  <div className={`${styles.pokeCard} ${styles[pokemon.types[0].type.name]}`}>
                    <span 
                    className={`${styles.upperCase} ${styles.titleName}`} 
                    style={{ fontFamily: 'Cursive',textShadow: "2px 2px 4px #000", color: typeColors[pokemon.types[0].type.name], fontWeight: '0' }}>
                      {pokemon.name}
                    </span>
                    
                    {<img className={styles.imgContent} src={pokemon.sprites.front_default}/>}
                    {pokemon.types.map((type, index) => (
                      <span
                        key={index}
                        className={`${styles.typeName} ${styles[type.type.name]}`}
                        style={{ color: typeColors[type.type.name], textShadow: "2px 2px 2px #000"}}
                      >
                        <span className={styles.upperCase}>{type.type.name}</span>
                      </span>
                    ))}
                    <span style={{color: "pink"}} className={styles.statTitle}>Stats:</span>
                    <span className={styles.statInfo}>HP: <span style={{color:'white'}}>{pokemon.stats[0].base_stat}</span></span>
                    <span className={styles.statInfo}>Attack: <span style={{color:'white'}}>{pokemon.stats[1].base_stat}</span></span>
                    <span className={styles.statInfo}>Defense: <span style={{color:'white'}}>{pokemon.stats[2].base_stat}</span></span>
                    <span className={styles.statInfo}>Speed: <span style={{color:'white'}}>{pokemon.stats[5].base_stat}</span></span>
                  </div>
                ))}
            </div>
        </div>
    );
};

export default Table;