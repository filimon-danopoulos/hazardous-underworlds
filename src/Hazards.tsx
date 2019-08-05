import React from 'react';

import { createStyles, Theme, WithStyles, withStyles, Card, CardContent, Typography, CardActions, Button, CardHeader, Fab } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const styles = (theme: Theme) => createStyles({
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
  }
});

type hazard = {
  title: string,
  flavour: string,
  effect: string,
  duration: string
}

interface IHazardsProps extends WithStyles<typeof styles> {
  hazards: hazard[];
  nextTurn: () => void;
  hasNextTurn: boolean;
  turn: number;
  incrementalHazards: boolean;
}

interface IHazardsState {
  activeHazards: hazard[];
}

class Hazards extends React.Component<IHazardsProps, IHazardsState> {
  constructor(props: IHazardsProps) {
    super(props);
    this.state = {
      activeHazards: [this.props.hazards[Math.floor(Math.random() * this.props.hazards.length)]]
    }
  }

  public componentWillUpdate(props: IHazardsProps) {
    if (props.turn > this.props.turn) {
      const availableHazards = this.props.hazards.filter(h => !this.state.activeHazards.includes(h))
      const newHazards = [...this.state.activeHazards]
      for (let i = 0; i < (this.props.incrementalHazards ? this.props.turn + 1 : 1); i++) {
        newHazards.push(availableHazards.splice(Math.floor(Math.random() * availableHazards.length), 1).shift()!)
      }
      this.setState({
        activeHazards: newHazards
      })
    }
  }

  public render(): JSX.Element {
    const { classes } = this.props
    return (
      <div>
        <div className={classes.toolbar} />
        {this.state.activeHazards.map((h, i) => (
          <Card key={h.title} className={classes.card}>
            <CardHeader
              classes={{ subheader: classes.subHeader }}
              title={h.title}
              subheader={h.flavour}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom dangerouslySetInnerHTML={{
                __html: h.effect.replace(/\*(.*?)\*/g, '<b>$1</b>')
              }} />
              <Typography variant="body1" dangerouslySetInnerHTML={{
                __html: h.duration.replace(/\*(.*?)\*/g, '<b>$1</b>')
              }} />
            </CardContent>
            <CardActions>
              <Button
                className={classes.button}
                size="small"
                variant="outlined"
                onClick={() => this.setState({ activeHazards: this.state.activeHazards.filter((x, j) => j !== i) })}>
                Remove
              </Button>
            </CardActions>
          </Card>

        ))}

        {this.props.hasNextTurn ?
          <Fab className={classes.fab} onClick={() => this.props.nextTurn()}>
            <ChevronRightIcon />
          </Fab> :
          null
        }
      </div >
    );
  }

}

export default withStyles(styles)(Hazards);