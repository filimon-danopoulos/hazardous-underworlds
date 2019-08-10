import React from 'react';
import { MuiThemeProvider, CssBaseline, Typography, AppBar, Toolbar } from '@material-ui/core';
import theme from './theme';
import data from './hazards.json';
import Hazards from './Hazards';
import Start from './Start';

interface IAppProps {}

interface IAppState {
  turn: number;
  incrementalHazards: boolean;
  maxTurns: number;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      turn: 0,
      incrementalHazards: true,
      maxTurns: 4
    };
  }

  public render(): JSX.Element {
    const t = theme();
    return (
      <div className="App">
        <MuiThemeProvider theme={t}>
          <CssBaseline />
          <div className="App-content">
            <AppBar position="fixed">
              <Toolbar>
                <Typography variant="h6">Hazard Phase {this.state.turn}</Typography>
              </Toolbar>
            </AppBar>
            {this.state.turn === 0 ? (
              <Start
                startGame={() => this.setState({ turn: this.state.turn + 1 })}
                incrementalHazards={this.state.incrementalHazards}
                toggleIncrementalHazards={(value: boolean) =>
                  this.setState({ incrementalHazards: value })
                }
              />
            ) : (
              <Hazards
                hazards={data.hazards}
                nextTurn={() => this.setState({ turn: this.state.turn + 1 })}
                hasNextTurn={this.state.turn < this.state.maxTurns}
                {...this.state}
              />
            )}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
