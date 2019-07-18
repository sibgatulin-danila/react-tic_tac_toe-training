import React, {Component} from "react";

let s = require("./style.css");
let CssModules = require('react-css-modules');

function Square(props) {
  return (
    <button 
      className={s.square} 
      onClick={props.onClick}
    >
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
    return (
      <div>
        <div className={s.board_row}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className={s.board_row}>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className={s.board_row}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}
	
	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const new_squares = current.squares.slice();
		if (calculateWinner(new_squares) || new_squares[i]){
			return;
		}
		new_squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
				history: history.concat([{
					squares: new_squares,
				}]),
				stepNumber: history.length,
				xIsNext: !this.state.xIsNext,
			});
	}
	
	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2 === 0),
		});
	}
	
  render() {
		
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		
		const winner = calculateWinner(current.squares);
		
		const moves = history.map((step, move) => {
			const desc = move ? 
				`Go to move #${move}` :
				`Go to start`;
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});
		
    let status;
    if (winner){
    	status = `Winner: ${winner}`;
    }else{
    	status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    };  
  
    return (
      <div className={s.game}>
        <div className={s.game_board}>
          <Board 
          	squares={current.squares}
          	onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className={s.game_info}>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
	const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i=0; i<lines.length; i++){
  	const [a, b, c] = lines[i];
  	if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
  	  return squares[a];
  	}
  }
  return null;
  
}

export default CssModules(Game, s);

