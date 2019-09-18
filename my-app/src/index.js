import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const items = [];
        let count = 0;

        for (let i = 0; i < 3; i++) {

            items.push(
                <div key={i} className="board-row">
                    {this.renderSquare(i + count)}
                    {this.renderSquare(i + count + 1)}
                    {this.renderSquare(i + count + 2)}
                </div>
            )

            count = count + 3;

        }

        return (
            <div>
                {items}
            </div>

        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isAsc: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }



    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        debugger
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        const movesOrder = this.state.isAsc ? 
            moves.reverse() : moves

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                    <p>Orden: {this.state.isAsc ? 'Ascendente' : 'Descendente'}</p>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{movesOrder}</ol>
                </div>

                <Switch onClick={(isActive) => {
                    this.setState({
                        isAsc: isActive
                    })
                }} />
            </div>
        );
    }
}

class Switch extends React.Component {

    state = {
        isActive: false,
    }

    handleClick = () => {
        this.setState((prevState) => {
            return {
                isActive: !prevState.isActive,
            }
        }, () => {
            if (this.props.onClick) this.props.onClick(this.state.isActive)
        })
    }

    render() {
        return (
            <button onClick={this.handleClick}>{this.state.isActive ? 'activo' : 'inactivo'}</button>
        )
    }
}



// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
