import React from 'react';

import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardHeader,
  Fab,
  Collapse
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';
import Duration from './Duration';
import CriticalHit from './assets/critical-hit.png';
import Dogde from './assets/dodge.png';
import Hammer from './assets/hammer.png';
import Shield from './assets/shield.png';
import Sword from './assets/sword.png';

const styles = (theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(3),
      maxWidth: `calc(100hw - ${theme.spacing(6)}px)`
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    toolbar: theme.mixins.toolbar,
    button: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    subHeader: {
      fontStyle: 'italic'
    },
    duration: {
      fontStyle: 'italic',
      marginTop: theme.spacing(2),
      color: theme.palette.secondary.main
    }
  });

type hazard = {
  id: number;
  title: string;
  flavour: string;
  effect: string;
  duration: Duration;
};

interface IHazardsProps extends WithStyles<typeof styles> {
  hazards: hazard[];
  nextTurn: () => void;
  hasNextTurn: boolean;
  turn: number;
  incrementalHazards: boolean;
}

type stateHazard = hazard & {
  completed: boolean;
  drawnIn: number;
  open: boolean;
};

interface IHazardsState {
  activeHazards: stateHazard[];
}

class Hazards extends React.Component<IHazardsProps, IHazardsState> {
  constructor(props: IHazardsProps) {
    super(props);
    const hazards = [this.props.hazards[Math.floor(Math.random() * this.props.hazards.length)]];
    this.state = {
      activeHazards: hazards.map(h =>
        Object.assign({}, h, {
          completed: false,
          drawnIn: props.turn,
          open: true
        })
      )
    };
  }

  public componentWillUpdate(props: IHazardsProps) {
    if (props.turn > this.props.turn) {
      const availableHazards = this.props.hazards.filter(h =>
        this.state.activeHazards.every(a => a.id !== h.id)
      );
      const newHazards = this.state.activeHazards.map(h => {
        const turnDiff = props.turn - h.drawnIn;
        const shouldComplete = h.duration === Duration.ThisTurn || turnDiff === h.duration;
        if (!h.completed && shouldComplete) {
          return Object.assign({}, h, {
            completed: true,
            open: false
          });
        }
        return h;
      });
      const hazardCount = this.props.incrementalHazards ? this.props.turn + 1 : 1;
      for (let i = 0; i < hazardCount; i++) {
        const hazard = availableHazards
          .splice(Math.floor(Math.random() * availableHazards.length), 1)
          .shift()!;
        newHazards.push(
          Object.assign(hazard, {
            completed: false,
            drawnIn: props.turn,
            open: true
          })
        );
      }
      this.setState({
        activeHazards: newHazards
      });
    }
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.toolbar} />
        {this.state.activeHazards.map((h, i) => (
          <Card key={h.id} className={classes.card}>
            <CardHeader
              onClick={() => this.toggleHazard(i)}
              classes={{ subheader: classes.subHeader }}
              title={h.title}
              subheader={h.flavour}
              avatar={!h.completed ? null : <CheckIcon />}
            />
            <Collapse in={h.open}>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {this.getEffect(h)}
                </Typography>
                {this.getDuration(h.duration)}
              </CardContent>
              {!h.completed &&
              [Duration.ThisTurn, Duration.EntireGameOrComplete].includes(h.duration) ? (
                <CardActions>
                  <Button
                    className={classes.button}
                    size="small"
                    variant="outlined"
                    onClick={() => this.complete(i)}>
                    Complete
                  </Button>
                </CardActions>
              ) : null}
            </Collapse>
          </Card>
        ))}

        {this.props.hasNextTurn ? (
          <Fab className={classes.fab} onClick={() => this.props.nextTurn()}>
            <ArrowRightIcon />
          </Fab>
        ) : null}
      </div>
    );
  }

  private getDuration(duration: Duration): JSX.Element | null {
    const durationText = this.getDurationText(duration);

    return !duration ? null : (
      <Typography variant="body2" className={this.props.classes.duration} align="center">
        {durationText}
      </Typography>
    );
  }

  private getDurationText(duration: Duration): string {
    switch (duration) {
      case Duration.EntireGame:
        return 'The effect of this hazard card lasts until the end of the game.';
      case Duration.EndOfNextPhase:
        return 'The effect of this hazard card lasts untill the end of the next hazard phase.';
      case Duration.StartOfNextPhase:
        return 'The effect of this hazard card lasts untill the start of the next hazard phase.';
      default:
        return '';
    }
  }

  private complete(index: number): void {
    this.setState({
      activeHazards: this.state.activeHazards.map((h, i) => {
        if (i === index) {
          return Object.assign({}, h, {
            completed: true,
            open: false
          });
        }
        return h;
      })
    });
  }

  private toggleHazard(index: number): void {
    this.setState({
      activeHazards: this.state.activeHazards.map((h, i) => {
        if (i === index) {
          return Object.assign({}, h, {
            open: h.completed ? !h.open : true
          });
        }
        return h;
      })
    });
  }

  private getEffect(hazard: stateHazard): (string | JSX.Element)[] {
    const imgMap = {
      crit: CriticalHit,
      dodge: Dogde,
      hammer: Hammer,
      shield: Shield,
      sword: Sword
    } as { [key: string]: any };
    const result = [] as (string | JSX.Element)[];
    let id = 0;
    hazard.effect.split('*').forEach((x, i) => {
      if (i % 2 === 0) {
        // eslint-disable-next-line
        x.split('!').map((z, j) => {
          if (j % 2 === 1) {
            result.push(<img key={id++} alt={z} src={imgMap[z]} />);
          } else {
            result.push(z);
          }
        });
      } else {
        result.push(<b key={id++}>{x}</b>);
      }
    });
    return result;
  }
}

export default withStyles(styles)(Hazards);
