import React, { useState } from 'react';

import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { ApolloProvider } from '@apollo/react-hooks';

import { Missions } from './components/Mission';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
});

function App() {
  return (
    <div className='App'>
      <ApolloProvider client={client}>
        <div>
          <Missions></Missions>
        </div>
      </ApolloProvider>
    </div>
  );
}

export default App;
