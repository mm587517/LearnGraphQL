import React from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

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
import Grid from '@material-ui/core/Grid';

const GetInfo = gql`
  {
    launchesPast(limit: 10) {
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

export function Missions() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(undefined);
  const handleExpandClick = (id) => {
    if (id === expanded) setExpanded(undefined);
    else setExpanded(id);
  };

  const { loading, error, data } = useQuery(GetInfo);

  if (loading) return 'Loading...';
  if (error) return `Error...${error.message}`;
  let count = 0;

  return (
    <div>
      <Grid
        container
        direction='row'
        justify='space-evenly'
        alignItems='flex-start'
        color='#4ecca3'
      >
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
                  [classes.expandOpen]: mis.id === expanded,
                })}
                onClick={() => handleExpandClick(mis.id)}
                aria-expanded={expanded}
                aria-label='show more'
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={mis.id === expanded} timeout='auto' unmountOnExit>
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
      </Grid>
    </div>
  );
}
