import React, { Component } from 'react';
import './App.css';
import Requests from './Requests.js';
import { Container } from 'semantic-ui-react'

class App extends Component {
  render() {
    return(
    	<Container>
    		<Requests />
    	</Container>
    )
  }
}

export default App;
