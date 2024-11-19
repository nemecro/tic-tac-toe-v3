const gameboard = (function(){
    board = [];
    for (let i = 0; i < 9; i++){
        board.push('');
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

