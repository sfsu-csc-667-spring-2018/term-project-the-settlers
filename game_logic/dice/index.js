module.exports = db => {
    const diceFunctions = {};

    diceFunctions.rollDice = (gameId) => {
      const diceRoll = Math.ceil(Math.random() * 12);
      return db.games.rollDice(gameId,diceRoll);
    };

    return diceFunctions;
}
