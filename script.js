const CIRCLE_CLASS = 'circle';
const X_CLASS = 'x';
const message = document.querySelector('.message');
const endScreen = document.querySelector('.game-end');

const gameBoard = (() => {
    let board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const cellElements = document.querySelectorAll('[data-cell]');


    const setBoard = (player, index) => {
        board[index] = player;  
    } 

    const clearBoard = (index) => {
        board[index] = '';
        
    }

    const placeMark = (cell) => {
        const currentTurn = gameController.getCurrentTurn();
        setBoard(currentTurn, cell.getAttribute('data-cell'));
        cell.classList.add(currentTurn);
        checkState();
        gameController.swapTurn();

    }

    const handleClick = (e) => {
        const cell = e.target;
        placeMark(cell);
        gameController.aiMove();
    }

 
    const clearEntireBoard = () => { 
        board = [
        '', '', '',
        '', '', '',
        '', '', ''
        ];
        console.log(cellElements);
        cellElements.forEach(cell => {
            cell.classList.remove(CIRCLE_CLASS)
            cell.classList.remove(X_CLASS)
            cell.removeEventListener('click', handleClick)
            cell.addEventListener('click', handleClick, { once: true })
        })
    }

    const getAvailableCells = () => {
        return board.map((cell, index) => cell == '' ? index : null)
            .filter(index => index !== null);
    }

    const checkWin = (player) => {
        return WINNING_COMBINATIONS.some(combination =>
            combination.every(index => board[index] == player.getSign()));
    }

    const checkDraw = () => {
        return board.every(cell => cell != '');
    }

    return {setBoard, clearBoard, clearEntireBoard, getAvailableCells, checkWin, checkDraw, placeMark};

})();

const Player = (playerSign) => {
    const sign = playerSign;
    const getSign = () => sign;
    
    return { getSign };
};

const gameController = (() => {
    const human = Player(X_CLASS);
    const ai = Player(CIRCLE_CLASS);

    let currentTurn = human
    const getCurrentTurn = () => currentTurn.getSign();

    const swapTurn = () => {
        if (currentTurn == human) {
            currentTurn = ai;
        } else {
            currentTurn = human;
        }
    }

    const setTurn = (player) => {
        currentTurn = player;
    }

    const getHumanPlayer = () => human;
    const getAiPlayer = () => ai;


    const minimax = (player) => {
        const availableCells = gameBoard.getAvailableCells();
        // Check win
        if (gameBoard.checkWin(gameController.getHumanPlayer())) {
            return { score : 10};
        } else if (gameBoard.checkWin(gameController.getAiPlayer())) {

            return { score : -10};
        } else if (gameBoard.checkDraw()){

            return { score : 0 };
        }
    
        let moves = [];
    
        for (let cell of availableCells) {
            let move = {}; // object required to store score AND moves
            move.index = cell;
            gameBoard.setBoard(player.getSign(), cell);
    
            if (player == gameController.getHumanPlayer()) {
                let result = minimax(gameController.getAiPlayer());
                move.score = result.score;
            } else {
                let result = minimax(gameController.getHumanPlayer());
                move.score = result.score;
            }
    
            // Clear current move before trying next cell
            gameBoard.clearBoard(cell);
    
            moves.push(move);
        }

    
        let bestMove;
    
        // maximise score for humans
        if (player == gameController.getHumanPlayer()) {
            let bestScore = -Infinity;
            for (let move of moves) {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
                // introduce variability
                if (move.score == bestScore) {
                    if (Math.random() > 0.7) {
                        bestMove = move;
                    }
                }
            }
        }
    
        if (player == gameController.getAiPlayer()) {
            let bestScore = Infinity;
            for (let move of moves) {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
    
                if (move.score == bestScore) {
                    if (Math.random() > 0.7) {
                        bestMove = move;
                    }
                }
            }
        }
    
        return bestMove;
    }

    const aiMove = () => {
        const move = minimax(gameController.getAiPlayer());
        const index = move.index;
        const cell = document.querySelector(`[data-cell="${index}"]`);
        gameBoard.placeMark(cell);
    }
    
    return {getHumanPlayer, getAiPlayer, getCurrentTurn, swapTurn, aiMove, setTurn};
    
})();

function setBoardHoverClass() {
    const board = document.querySelector('.board');
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    const currentClass = gameController.getCurrentTurn();
    board.classList.add(currentClass)

}

function checkState() {
    if (gameBoard.checkWin(gameController.getHumanPlayer())) {
        message.textContent = 'X wins!';
        endScreen.classList.add('show');
    } else if (gameBoard.checkWin(gameController.getAiPlayer())) {
        message.textContent = 'O wins!'
        endScreen.classList.add('show');
    } else if (gameBoard.checkDraw()) {
        message.textContent = 'Draw'
        endScreen.classList.add('show');


    }
}

function startGame() {
    gameController.setTurn(gameController.getHumanPlayer());
    console.log('restart')
    endScreen.classList.remove('show')
    gameBoard.clearEntireBoard();
    setBoardHoverClass();

}

document.querySelector('.restart').addEventListener('click' ,() => startGame());

startGame();

