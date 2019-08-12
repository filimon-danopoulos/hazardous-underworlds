import React from 'react';

import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Card,
  CardContent,
  Typography,
  CardHeader,
  FormControlLabel,
  Fab,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowForward';

const styles = (theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(3),
      maxWidth: `calc(100hw - ${theme.spacing(6)}px)`
    },
    toolbar: theme.mixins.toolbar,
    button: {
      marginLeft: 'auto',
      marginRight: theme.spacing(2)
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(3)
    },
    group: {
      margin: theme.spacing(1, 0)
    }
  });

interface IStartProps extends WithStyles<typeof styles> {
  startGame: () => void;
  incrementalHazards: boolean;
  toggleIncrementalHazards: (value: boolean) => void;
}

interface IStartState {
  modalOpen: boolean;
}

class Start extends React.Component<IStartProps, IStartState> {
  constructor(props: IStartProps) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }
  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.toolbar} />
        <Card className={classes.card}>
          <CardHeader title="Hazardous Underworlds" />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              You have not started a game yet. When the boards are set up, click the arrow to go to
              the first phase.
            </Typography>
          </CardContent>
        </Card>
        <Dialog open={this.state.modalOpen} onClose={() => this.handleClose()}>
          <DialogTitle>New Game</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Incremental hazards means you will get one hazard round one, two new hazards on round
              two etc, instead of getting a single hazard per turn.
            </DialogContentText>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Hazards per turn</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                className={classes.group}
                value={this.props.incrementalHazards ? 'incremental' : 'single'}
                onChange={e =>
                  this.props.toggleIncrementalHazards(
                    (e.target as HTMLInputElement).value === 'incremental'
                  )
                }>
                <FormControlLabel value="incremental" control={<Radio />} label="Incremental" />
                <FormControlLabel value="single" control={<Radio />} label="Single" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => this.props.startGame()} color="primary">
              Start
            </Button>
          </DialogActions>
        </Dialog>
        <Fab className={classes.fab} onClick={() => this.openModal()}>
          <ArrowRightIcon />
        </Fab>
      </React.Fragment>
    );
  }
  private handleClose(): void {
    this.setState({
      modalOpen: false
    });
  }

  private openModal(): void {
    this.setState({
      modalOpen: true
    });
  }
}

export default withStyles(styles)(Start);
