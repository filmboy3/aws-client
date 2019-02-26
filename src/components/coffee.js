import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
      }
    })

class Coffee extends Component {
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value
        });
      };
   render() {
       return (
        <form noValidate autoComplete="off">
            <TextField
                id="restaurant"
                label="Favorite Spot"
                onChange={this.handleChange('restaurant')}
                marin="normal"
                placeholder="La Colombe on Lafayette near E 4th"
                variant="filled"
            />
            <TextField
                id="order"
                label="Go-To Order"
                onChange={this.handleChange('restaurant')}
                marin="normal"
                placeholder="Pure Black"
                variant="filled"
            />
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </form>
       )
    }
}

export default withStyles(styles)(Coffee);