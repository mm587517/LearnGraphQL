import React, { useState } from 'react';

import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { ApolloProvider, useLazyQuery } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
});

const GetInfo = gql`
  {
    launchesPast {
      id
      mission_name
      links {
        flickr_images
        mission_patch_small
      }
      rocket {
        rocket_name
      }
      launch_date_utc
    }
  }
`;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },

  title: {
    fontSize: 25,
  },
  pos: {
    marginBottom: 12,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    width: 500,
    height: 250,
  },
});

function Missions() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([false]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { loading, error, data } = useQuery(GetInfo);

  if (loading) return 'Loading...';
  if (error) return `Error...${error.message}`;

  return (
    <div>
      {' '}
      {data.launchesPast.map((mis) => (
        <Card className={classes.root}>
          <CardContent>
            <Typography
              className={classes.title}
              color='textSecondary'
              gutterBottom
            >
              {mis.mission_name}
            </Typography>

            <Typography className={classes.pos} color='textSecondary'>
              {`Mission ID: ${mis.id}`}
            </Typography>

            <CardMedia
              className={classes.media}
              image={mis.links.flickr_images[0]}
              title={mis.mission_name}
              style={{ height: 300, width: 300 }}
            />
            <Typography variant='body2' component='p'>
              {mis.rocket.rocket_name}
              <br />
              {mis.launch_date_utc}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardContent>
              <GridList className={classes.gridList} cols={2.5}>
                {mis.links.flickr_images.map((tile) => (
                  <GridListTile>
                    <img src={tile} />
                  </GridListTile>
                ))}
              </GridList>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </div>
  );
}

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
