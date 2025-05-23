import React, { useEffect, useState } from 'react';

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4);
    const [cards, setCards] = useState([]);
    const [flipper, setFlipper] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);
    const [moves, setMoves] = useState(0); 
    const [maxMoves, setMaxMoves] = useState(20); 

    const handleGridSizeChange = (e) => {
    const value = e.target.value;
    const size = parseInt(value, 10);

    if (!isNaN(size) && size >= 2 && size <= 10 && size % 2 === 0) {
        setGridSize(size);
    } else {
        console.warn('Please select an even number between 2 and 10.');
    }
};
    const handleMaxMovesChange = (e) => {
        const moves = parseInt(e.target.value);
        if (moves > 0) setMaxMoves(moves);
    };

    const checkMatch = (secondId) => {
        const [firstId] = flipper;
        if (cards[firstId].number === cards[secondId].number) {
            setSolved([...solved, firstId, secondId]);
            setFlipper([]);
            setDisabled(false);
        } else {
          
            setMoves(moves + 1);
            setTimeout(() => {
                setFlipper([]);
                setDisabled(false);
            }, 1000);
        }
    };

    const initializeGame = () => {
        const totalCards = gridSize * gridSize;
        const pairCount = Math.round(totalCards / 2);
        const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
        const shuffledCards = [...numbers, ...numbers]
            .sort(() => Math.random() - 0.5)
            .slice(0, totalCards)
            .map((number, index) => ({ id: index, number }));
        
        setCards(shuffledCards);
        setFlipper([]);
        setSolved([]);
        setWon(false);
        setMoves(0);
    };

    useEffect(() => {
        initializeGame();
    }, [gridSize]);

    const handleClick = (id) => {
        if (disabled || won || moves >= maxMoves || flipper.includes(id)) return;

        if (flipper.length === 0) {
            setFlipper([id]);
            return;
        }

        if (flipper.length === 1) {
            setDisabled(true);
            setFlipper([...flipper, id]);
            checkMatch(id);
        }
    };

    const isFlipper = (id) => flipper.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);
        }
    }, [solved, cards]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

            <div className="mb-4">
                <label htmlFor="gridSize" className="mr-2">Grid Size (max 10): </label>
                <input 
                    type="number" 
                    id="gridSize" 
                    min="2" 
                    max="10" 
                    value={gridSize} 
                    onChange={handleGridSizeChange} 
                    className="border-2"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="maxMoves" className="mr-2">Max Moves: </label>
                <input 
                    type="number" 
                    id="maxMoves" 
                    min="1" 
                    value={maxMoves} 
                    onChange={handleMaxMovesChange} 
                    className="border-2"
                />
            </div>

            {/* Display current moves */}
            <div className="text-lg font-semibold mb-4">
                Moves: {moves} / {maxMoves}
            </div>

            <div 
                className={`grid gap-2 mb-4`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`
                }}
            >
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleClick(card.id)}
                        className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 
                            ${isFlipper(card.id)
                                ? isSolved(card.id)
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-500 text-white'
                                : 'bg-gray-500 text-gray-500'
                            }`
                        }
                    >
                        {isFlipper(card.id) ? card.number : '?'}
                    </div>
                ))}
            </div>

            {/* Display result */}
            {won && (
                <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
                    You Won!
                </div>
            )}
            {!won && moves >= maxMoves && (
                <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">
                    Game Over!
                </div>
            )}

            {/* Reset/Play Again Button */}
            <button
                onClick={initializeGame}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
            >
                {won || moves >= maxMoves ? "Play Again" : "Reset"}
            </button>
        </div>
    );
};

export default MemoryGame;
