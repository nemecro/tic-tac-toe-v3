let activeGame;

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
    winner = false;
    let player1, player2;
    let activePlayer;

    function initPlayers(p1Input, p2Input){
        [player1, player2] = [p1Input, p2Input];
        activePlayer = player1;
    }

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

    const playRound = function(area){
        let activeSymbol = activePlayer.getSymbol();
        gameboard.update(area, activeSymbol);
        checkVictory(activeSymbol);
        if (winner === activeSymbol){
            // IF THE ACTIVE PLAYER WON THE GAME
            gameboard.clear();
            view.openModal(true, activePlayer);
        }
        // check for active player and change between rounds
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    return {playRound, initPlayers}
};

const view = function(){
    const body = document.querySelector('body');
    const grid = document.createElement('div');

    function createAreaButton(index, value){
        const button = document.createElement('button');
        button.type = 'button';
        grid.appendChild(button);
        button.id = index;
        button.classList.add('areaBtn');
        button.textContent = value;

        button.addEventListener('click', () => {
            activeGame.playRound(button.id);
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

    const modal = document.querySelector('dialog');
    const modalCloseBtn = modal.querySelector('#close-modal');
    const modalSendBtn = modal.querySelector('#submit-modal');
    const modalOpenBtn = document.querySelector('#new-game');
    const modalForm = modal.querySelector('form');

    const winnerDisplay = modal.querySelector('#winner-display');
    const winnerPara = document.createElement('p');

    function closeModal(){
        modal.close();
    }

    function openModal(unclosable, winner = ''){
        modal.showModal();
        if (unclosable === true){
            modalCloseBtn.remove();
        }
        if (winner != ''){
            winnerDisplay.appendChild(winnerPara);
            winnerPara.textContent = `${winner.getName()} has won`;
        }
    }

    // check when changing symbol value
    let selectPlayer1Symbol = document.querySelector('#player1-symbol');
    let selectPlayer2Symbol = document.querySelector('#player2-symbol');

    function changeSymbolValue(e){
        if (e.target === selectPlayer1Symbol){
            selectPlayer2Symbol.value = selectPlayer1Symbol.value === 'X' ? 'O' : 'X';
        } else {
            selectPlayer1Symbol.value = selectPlayer2Symbol.value === 'O' ? 'X' : 'O';
        }
    }

    function sendValues(){
        const player1Name = modal.querySelector('#player1-name').value;
        const player2Name = modal.querySelector('#player2-name').value;
        const player1Symbol = modal.querySelector('#player1-symbol').value;
        const player2Symbol = modal.querySelector('#player2-symbol').value;

        modal.close();
        return {
            player1Name,
            player2Name,
            player1Symbol,
            player2Symbol
        }
    }

    let formValues = {};

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formValues = sendValues();
        gameboard.clear();
        view.refresh();
        activeGame = game();
        activeGame.initPlayers(Player(formValues.player1Name, formValues.player1Symbol), Player(formValues.player2Name, formValues.player2Symbol));
    });

    modalOpenBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);

    selectPlayer1Symbol.addEventListener('change', changeSymbolValue);
    selectPlayer2Symbol.addEventListener('change', changeSymbolValue);


    // for initial display
    body.appendChild(grid);

    return {refresh, openModal}
}();
