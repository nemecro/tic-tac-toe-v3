let newGame;

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

    const clear = function(){
        for (let i = 0; i < 9; i++){
            // E stand for empty
            board[i] = 'E';
        }
    }

    const print = function(){
        console.log(board[0], board[1], board[2]);
        console.log(board[3], board[4], board[5]);
        console.log(board[6], board[7], board[8]);
    }

    return {get, update, clear, print}
})();

const Player = function(name, symbol){
    const getName = () => name;
    const getSymbol = () => symbol;
    return {getName, getSymbol};
}

const game = function(){
    let player1;
    let player2;
    let winner;
    let boardCopy;
    let activePlayer;

    function init(p1Input, p2Input){
        winner = false;
        player1 = p1Input;
        player2 = p2Input;
        boardCopy = gameboard.get();
        activePlayer = player1;
    }

    init();

    const checkVictory = function(symbol){
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

    const playRound = function(area){
        let activeSymbol = activePlayer.getSymbol();
        gameboard.update(area, activeSymbol);
        checkVictory(activeSymbol);
        if (winner === activeSymbol){
            // IF THE ACTIVE PLAYER WON THE GAME
            gameboard.clear();
            gameboard.print();
            view.refresh();
            newGame = game(Player('Roland', 'X'), Player('Olga', 'O'));
        }
        // check for active player and change between rounds
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    return {playRound}
};

newGame = game(Player('Roland', 'X'), Player('Olga', 'O'));

const view = function(){
    const body = document.querySelector('body');
    const grid = document.createElement('div');
    

    function createAreaButton(index, value){
        const button = document.createElement('button');
        grid.appendChild(button);
        button.id = index;
        button.classList.add('areaBtn');
        button.textContent = value;

        button.addEventListener('click', () => {
            newGame.playRound(button.id);
            refresh();
        })
    }

    function refresh(){
        const boardCopy = gameboard.get();
        const areaBtns = [...document.querySelectorAll('.areaBtn')];
        areaBtns.forEach(btn => btn.remove());
        for (let i = 0; i < boardCopy.length; i++){
            createAreaButton(i, boardCopy[i]);
        }
    }

    refresh();

    body.appendChild(grid);

    return {refresh}
}();
