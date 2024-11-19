const gameboard = (function(){
    board = [];
    for (let i = 0; i < 9; i++){
        // E stand for empty
        board.push('E');
    }

    const get = () => board;

    const update = function(index, value){
        board[index] = value;
    }

    const print = function(){
        console.log(board[0], board[1], board[2]);
        console.log(board[3], board[4], board[5]);
        console.log(board[6], board[7], board[8]);
    }

    return {get, update, print}
})();

const Player = function(name, symbol){
    const getName = () => name;
    const getSymbol = () => symbol;
    return {getName, getSymbol};
}

const game = function(player1, player2){
    let winner = false;

    const checkVictory = function(symbol){
        const boardCopy = gameboard.get();
        const victoryCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];
        victoryCombinations.forEach(victoryCondition => {
            if (
                boardCopy[victoryCondition[0]] === symbol && boardCopy[victoryCondition[1]] === symbol && boardCopy[victoryCondition[2]] === symbol
            ){
                winner = symbol;
            }
        })
    }

    let activePlayer = player1;
    const playRound = function(area){
        let activeSymbol = activePlayer.getSymbol();
        gameboard.update(area, activeSymbol);
        checkVictory(activeSymbol);
        if (winner === activeSymbol){
            // DO SOMETHING
            console.log('won');
        }
        // check for active player and change between rounds
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    return {playRound}
};

const newGame = game(Player('Roland', 'X'), Player('Olga', 'O'));
newGame.playRound(0);
newGame.playRound(3);
newGame.playRound(4);
newGame.playRound(5);
newGame.playRound(8);
newGame.playRound(2);
gameboard.print();
