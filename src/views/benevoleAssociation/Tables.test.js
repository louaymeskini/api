import React from 'react';
import ReactDOM from 'react-dom';
import Tables from './benevoleMembre';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tables />, div);
  ReactDOM.unmountComponentAtNode(div);
});
