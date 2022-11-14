
// CSS
import './App.css';

// React
import {useCallback, useEffect, useState} from "react";

// components
import 
StartScreen from "./components/StartScreen"

import Game from './components/Game';

import GameOver from './components/GameOver';


// data
import {wordsList} from "./data/words"

const stages = [
  {id: 1, name :'start'},
  {id: 2, name :'game'},
  {id: 3, name :'end'},
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);
  
  const pickedWordAndCategory = useCallback(() => {
    // pick a randon category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]


    // pick a randon word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    
    return {word, category}
  }, [words]);
  
  const clearStages = () => {
    setGameStage(stages[0].name);
  }
  
  // starts secret word game
  const startGame = useCallback(() => {
    // clear all letters
     clearLetterStates();
     clearStages();
     
     // pick word and pick category
     const {category, word} = pickedWordAndCategory();
     
     // create an array of letter
     let wordLetters = word.split("");
     
     wordLetters = wordLetters.map((l) => l.toLowerCase());
     
     
     // fill states
     setPickedCategory(category);
     setPickedWord(word);
     setLetters(wordLetters);
     
     
     setGameStage(stages[1].name);
    
  }, [pickedWordAndCategory]); 

  
  // process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();
    
    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    } 

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
    
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  
  // check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      // reset all states
      clearLetterStates()
      
      setGameStage(stages[2].name)
    }
  }, [guesses]);
  
  // check win condition
  useEffect(() =>{
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new random word
      startGame();
    }
    
  }, [guessedLetters, letters, startGame]);
  
  // restart game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    
    setGameStage(stages[0].name)
  }
  
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} /> }
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord = {pickedWord} pickedCategory = {pickedCategory} letters = {letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses = {guesses} score = {score} />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
