import React, { useState, useEffect } from 'react';
import './App.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EarthBoom from './assets/earth-boom.jpg';
import Earth from './assets/earth.jpg';

const symbols = [
  { id: 'gorrila', label: '🦍', name: 'Gorrila' },
  { id: 'atom', label: '🧪', name: 'atom' },
  { id: 'beans', label: '🫘', name: 'Beans' },
  { id: 'bob', label: '👨', name: 'Bob' },
];

const correctOrder = ['beans', 'gorrila', 'atom', 'bob'];

const correctInputs = {
  beans: '500000000',
  gorrila: '152',
  bob: '23',
  atom: '6728',
};

function DraggableSymbol({ symbol, index, moveSymbol }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'SYMBOL',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SYMBOL',
    hover: (item) => {
      if (item.index !== index) {
        moveSymbol(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`symbol-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="symbol-emoji">{symbol.label}</div>
      <div className="symbol-name">{symbol.name}</div>
    </div>
  );
}

function SymbolOrderPuzzle() {
  const [input, setInput] = useState(
    Object.keys(correctInputs).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {})
  );

  const [order, setOrder] = useState(symbols);
  const [isCorrect, setIsCorrect] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const moveSymbol = (fromIndex, toIndex) => {
    const updatedOrder = [...order];
    const [moved] = updatedOrder.splice(fromIndex, 1);
    updatedOrder.splice(toIndex, 0, moved);
    setOrder(updatedOrder);
  };

  useEffect(() => {
    const isOrderCorrect = order.every((s, i) => s.id === correctOrder[i]);
    const inputsAreCorrect = Object.entries(correctInputs).every(
      ([key, val]) => input[key].trim() === val
    );
    const solved = isOrderCorrect && inputsAreCorrect;

    setIsCorrect(solved);

    if (solved && !savedAt) {
      const now = new Date();
      setSavedAt(now.toLocaleTimeString());
    }
  }, [order, input]);

  const handleInputChange = (e, key) => {
    setInput((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <div className="main-container earth-bg">
      {!isCorrect ? (
        <img src={EarthBoom} alt="boom" />
      ) : (
        <img src={Earth} alt="no boom" width="600px" />
      )}

      <div className="card">
        <h1 className="title">{isCorrect ? 'Earth cool' : 'Earth Dead'}</h1>
        <p className="description">
          Look to the above! Earth is soon gone. Enter the numbers and put them in the right order or we dead!
        </p>
        <div className="form">
          {symbols.map((s) => (
            <input
              key={s.id}
              className="input"
              type="text"
              placeholder={`${s.name}`}
              value={input[s.id]}
              onChange={(e) => handleInputChange(e, s.id)}
            />
          ))}
        </div>

        <p className="description">Drag and drop the things to restore the natural balance (best to worse):</p>
        <div className="drag-area">
          {order.map((symbol, index) => (
            <DraggableSymbol
              key={symbol.id}
              symbol={symbol}
              index={index}
              moveSymbol={moveSymbol}
            />
          ))}
        </div>

        {isCorrect && (
          <div className="success-msg">
            <h2>🎉 This code can stop the boom!</h2>
            <p>The final code is:</p>
            <p className="final-code"> {correctOrder.map((id) => input[id]).join(' ')} </p>
            <p>Now the world no Dead. Thanks</p>
            {savedAt && (
              <p className="save-time">🌍 Earth was saved at: <strong>{savedAt}</strong></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <SymbolOrderPuzzle />
    </DndProvider>
  );
}
