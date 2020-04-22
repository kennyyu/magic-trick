import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

// Fisher-Yates Shuffle
function shuffle(deck) {
  let counter = deck.length;
  while (counter) {
    const i = Math.floor(Math.random() * counter-- );
    const t = deck[counter];
    deck[counter] = deck[i];
    deck[i] = t;
  }
}

function getCards() {
  const ranks = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K'
  ];
  const suits = ["♠︎", "♥︎", "♣︎", "♦︎"];
  let cards = [];
  for (const rank of ranks) {
    for (const suit of suits) {
      cards.push({
        rank: rank,
        suit: suit,
      });
    }
  }
  shuffle(cards);
  return cards.slice(0, 21);
}

function selectCardPile(cards, pile) {
  let newCards = cards.slice(0);
  // Move the selected pile into the middle of the deck
  for (let i = 0; i < 7; i++) {
    const middleCard = 7 + i;
    const selectedPileCard = pile * 7 + i;
    const temp = newCards[middleCard];
    newCards[middleCard] = newCards[selectedPileCard];
    newCards[selectedPileCard] = temp;
  }
  return newCards;
}

function dealCards(cards) {
  // deal out the cards to each pile, alternating piles
  let piles = [[], [], []];
  for (let i = 0; i < cards.length; i++) {
    const pile = i % 3;
    piles[pile].push(cards[i]);
  }
  return [].concat(piles[0]).concat(piles[1]).concat(piles[2]);
}

class MagicCardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: getCards(),
      stage: "select_pile_1",
    };
  }

  restartTrick() {
    this.setState({
      cards: getCards(),
      stage: "select_pile_1",
    });
  }

  getNextStage() {
    switch (this.state.stage) {
      case "select_pile_1":
        return "select_pile_2";
      case "select_pile_2":
        return "select_pile_3";
      case "select_pile_3":
        return "reveal";
      case "reveal":
        return "reveal";
      default:
        return "";
    }
  }

  getInstructions() {
    switch (this.state.stage) {
      case "select_pile_1":
        return "Please select the pile containing your card (3 more times)";
      case "select_pile_2":
        return "Please select the pile containing your card (2 more times)";
      case "select_pile_3":
        return "Please select the pile containing your card (last time!)";
      case "reveal":
        return "Is this your card?";
      default:
        return "";
    }
  }

  setNextState(pile) {
    const nextStage = this.getNextStage();
    switch (this.state.stage) {
      case "select_pile_1":
      case "select_pile_2":
      case "select_pile_3": {
        this.setState({
          cards: dealCards(selectCardPile(this.state.cards, pile)),
          stage: nextStage,
        });
        break;
      }
      case "reveal":
        // do nothing
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <MagicCardPile
              cards={this.state.cards.slice(0, 7)}
              onClick={() => { this.setNextState(0); }}
              stage={this.state.stage}
            />
          </Grid>
          <Grid item xs={3}>
            <MagicCardPile
              cards={this.state.cards.slice(7, 14)}
              onClick={() => { this.setNextState(1); }}
              stage={this.state.stage}
            />
          </Grid>
          <Grid item xs={3}>
            <MagicCardPile
              cards={this.state.cards.slice(14, 21)}
              onClick={() => { this.setNextState(2); }}
              stage={this.state.stage}
            />
          </Grid>
          <Grid item xs={3}>
            <center>
              <div className="instructions">
                <Typography variant="subtitle2">
                  {this.getInstructions()}
                </Typography>
                {this.state.stage === "reveal"
                  ? <CardTile
                      value={this.state.cards[10].rank}
                      suit={this.state.cards[10].suit}
                    />
                  : null
                }
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.restartTrick.bind(this)}
                >
                  Restart Magic Trick
                </Button>
              </div>
            </center>
          </Grid>
        </Grid>
      </Container>
    );
  }
};

// From: https://codepen.io/ursooperduper/pen/EXWxdW
const CardTile = (props) => {
  if (props.suit === "♣︎" || props.suit === "♠︎") {
    return (
      <div className="card card-black">
        <div className="card-tl">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{props.suit}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{props.suit}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card card-red">
        <div className="card-tl">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{props.suit}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{props.suit}</div>
        </div>
      </div>
    );
  }
};

class MagicCardPile extends React.Component {
  render() {
    return (
      <Grid container spacing={0}>
        {this.props.cards.map(item => (
          <Grid item xs={12} key={item.rank + "-" + item.suit}>
            <center>
              <CardTile value={item.rank} suit={item.suit} />
            </center>
          </Grid>
        ))}
        <Grid item xs={12}>
          <center>
            {this.props.stage !== "reveal"
              ? <Button
                  variant="contained"
                  color="primary"
                  onClick={this.props.onClick}
                >
                  My card is in this pile
                </Button>
              : null
            }
          </center>
        </Grid>
      </Grid>
    )
  }
}

export default MagicCardApp;
