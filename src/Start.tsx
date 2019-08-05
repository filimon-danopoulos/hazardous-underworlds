import React from 'react';

import { createStyles, Theme, WithStyles, withStyles, Card, CardContent, Typography, CardActions, Button, CardHeader, FormControlLabel, Switch } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  card: {
    margin: theme.spacing(3),
    maxWidth: `calc(100hw - ${theme.spacing(6)}px)`
  },
  toolbar: theme.mixins.toolbar,
  button: {
    marginLeft: 'auto',
    marginRight: theme.spacing(2)
  }
});

interface IStartProps extends WithStyles<typeof styles> {
  startGame: () => void;
  incrementalHazards: boolean;
  toggleIncrementalHazards: () => void;
}

interface IStartState {
}

class Start extends React.Component<IStartProps, IStartState> {
  public render(): JSX.Element {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.toolbar} />
        <Card className={classes.card}>
          <CardHeader title="Hazerdous Underworlds" />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              This app will allow you to manage hazards for the game Warhammer Underworlds.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Select if you want an incremental amount of hazards or a single hazard per turn and start the game by clicking start!
            </Typography>
          </CardContent>
          <CardActions>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.incrementalHazards}
                  size="small"
                  onChange={() => this.props.toggleIncrementalHazards()}
                  color="primary"
                />
              }
              label="Inc. Hazards"
              labelPlacement="start"
            />
            <Button className={classes.button} size="small" color="secondary" variant="contained" onClick={() => this.props.startGame()}>Start!</Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }

}

export default withStyles(styles)(Start);