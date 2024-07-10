const gameBoard = (() => {
    const board = [
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

    const setBoard = (player, index) => {
        board[index] = player.getSign();
    } 

    const clearBoard = (index) => {
        board[index] = '';
    }
 
    const clearEntireBoard = () => { 
        board = [
        '', '', '',
        '', '', '',
        '', '', ''
        ];
    }

    const getAvailableCells = () => {
        return board.map((cell, index) => cell == '' ? index : null)
            .filter(index => index !== null);
    }

    const checkWin = (player) => {
        return WINNING_COMBINATIONS.some(combination =>
            combination.every(index => gameBoard[index] == player.getSign()));
    }

    const checkDraw = () => {
        return board.every(cell => cell != '');
    }

    return {setBoard, clearBoard, clearEntireBoard, getAvailableCells, checkWin};

})

const Player = (playerSign) => {
    const sign = playerSign;
    const getSign = () => sign;
    
    return {getSign};
}

const gameController = (() => {
    const human = Player("X");
    const ai = Player("O");

    const getHumanPlayer = () => human;
    const getAiPlayer = () => ai;
    
    return {getHumanPlayer, getAiPlayer};
    
})();


function minimax(player) {
    const availableCells = gameBoard.getAvailableCells();

    // Check win
    if (gameBoard.checkWin(gameController.getHumanPlayer())) {
        return { score : 1};
    } else if (gameBoard.checkWin(gameController.getAiPlayer())) {
        return { score : -1};
    } else if (checkDraw()){
        return { score : 0 };
    }

    let moves = [];

    for (let cell of availableCells) {
        let move = {}; // object required to store score AND moves
        move.index = cell;

        gameBoard.setBoard(player, cell);

        if (player == gameController.getHumanPlayer()) {
            let result = gameController.getAiPlayer();
            move.score = result.score;
        } else {
            let result = gameController.getHumanPlayer();
            move.score = result.score;
        }

        // Clear current move before trying next cell
        gameBoard.clearBoard(cell);

        moves.push(move);
    }

    let BestMove;

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

