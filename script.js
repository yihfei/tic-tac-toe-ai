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
 
    const clearBoard = () => { 
        board = [
        '', '', '',
        '', '', '',
        '', '', ''
        ];
    }

    const checkWin = (player) => {
        return WINNING_COMBINATIONS.some(combination =>
            combination.every(index => gameBoard[index] == player.getSign()));
    }

    return {setBoard, clearBoard, checkWin};

})

const Player = (sign) => {
    const sign = sign;
    const getSign = () => sign;
    
    return {getSign};
}

const gameController = (() => {
    const human = Player("X");
    const ai = Player("O");

})();

