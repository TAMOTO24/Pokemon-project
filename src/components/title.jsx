import React, { useEffect, useRef, useState } from "react";
import styles from './assets/pokeTitle.module.css';
import { useData } from "./common/dataContext";

const Table = (prop) => {

    const title = useRef();
    const itemsOnPage = useData();
    const [activeTags, changeActiveTag] = useState([]);
    const searchContent = useRef();

    const changeItemsOnPage = (newValue) => {
        itemsOnPage.updateItemsValue(newValue);
    }

    const changeTags = (newValue) => {
        itemsOnPage.updatePokeTags(newValue);
    }

    const searchButtonClick = () => {
        itemsOnPage.updateSearchContent(searchContent.current.value.toLowerCase());
    }

    const setActiveTag = (event) => {
        if (event.target.style.backgroundColor != 'rgb(0, 97, 98)') {
            event.target.style.backgroundColor = 'rgb(0, 97, 98)';
            event.target.style.color = 'rgb(240, 249, 248';
        } else {
            event.target.style.backgroundColor = 'rgb(240, 249, 248)';
            event.target.style.color = 'rgb(0, 0, 0)';
        }
        let index = activeTags.indexOf(event.target.textContent);
        if (index !== -1) {
            activeTags.splice(index, 1);
        } else {
            activeTags.push(event.target.textContent.toLowerCase());
        }
        changeTags(activeTags);
    }

    return (
        <div className={styles.pokeArea}>
            <div className={styles.pokePlaceTitle} ref={title} >
                <div className={styles.searchArea}>
                <input onChange={searchButtonClick} ref={searchContent} className={styles.searcher}></input>
                </div>
                <div className={styles.pokePlaceTags}>
                <span color="purple" className={styles.tags}>Tags:</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Normal</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Fire</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Water</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Grass</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Electric</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Ice</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Fighting</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Poison</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Ground</span>
                    <span onClick={setActiveTag} className={styles.pokeTags}>Flying</span>
                </div>
                <div className={styles.itemsPlaceNumber}>
                    <div className={styles.placeNumber}>
                    <span color="purple">Count on Page:</span>
                        <button onClick={() => {changeItemsOnPage(10)}} className={styles.buttonItemsNumber}><span>1O</span></button>
                        <button onClick={() => {changeItemsOnPage(20)}} className={styles.buttonItemsNumber}><span>2O</span></button>
                        <button onClick={() => {changeItemsOnPage(50)}} className={styles.buttonItemsNumber}><span>5O</span></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;