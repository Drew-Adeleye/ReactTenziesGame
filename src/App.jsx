import React from "react";
import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState({
    currentRolls: 0,
    bestRollScore: localStorage.getItem("bestRoll-data") || 0,
  });

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    const numberObjects = {
      1: <i className="fa-solid fa-dice-one"></i>,
      2: <i className="fa-solid fa-dice-two"></i>,
      3: <i className="fa-solid fa-dice-three"></i>,
      4: <i className="fa-solid fa-dice-four"></i>,
      5: <i className="fa-solid fa-dice-five"></i>,
      6: <i className="fa-solid fa-dice-six"></i>,
    };

    let icon;
    const randomNumber = Math.ceil(Math.random() * 6);
    for (let i = 0; i < 6; i++) {
      if (randomNumber == i + 1) {
        icon = numberObjects[i + 1];
      }
    }

    return {
      value: randomNumber,
      isHeld: false,
      icon: icon,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setRolls((prevRolls) => ({
        ...prevRolls,
        currentRolls: prevRolls.currentRolls + 1,
      }));

      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      resetGame();
    }
  }

  function resetGame() {
    setTenzies(false);
    setDice(allNewDice());
    setRolls((prevRolls) => ({
      ...prevRolls,
      currentRolls: 0,
    }));
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  // set best rolls to lowest amount of rolls
  if (tenzies) {
    if (rolls.currentRolls < rolls.bestRollScore) {
      setRolls((prevRolls) => ({
        ...prevRolls,
        bestRollScore: rolls.currentRolls,
      }));
      localStorage.setItem("bestRoll-data", rolls.currentRolls);
    }
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      icon={die.icon}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <button className="reset-game" onClick={resetGame}>
        <i class="fa-solid fa-rotate-right"></i>
      </button>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="rolls-container">
        <h2 className="rolls--h2">Rolls: {rolls.currentRolls}</h2>
        <h2 className="rolls--h2">Best: {rolls.bestRollScore}</h2>
      </div>
    </main>
  );
}
