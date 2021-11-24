import * as React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '@/router/index';

class Custon extends React.Component {
  render(){
    return (
      <Router>
        <Routes></Routes>
      </Router>
    )
  }
};

export default Custon;
