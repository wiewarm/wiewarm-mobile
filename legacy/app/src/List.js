/* eslint-disable react-hooks/exhaustive-deps */ 

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BadCard from "./BadCard.js";
import haversine from 'haversine-distance'
import { geolocated } from "react-geolocated";
import { shortenPos, geoOpts } from './index.js'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    root: {
        //minWidth: 275,
        paddingTop: "2em",
    },
});

function List(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [nrenders, setNrenders] = useState(0);
  const [shortLat, setShortLat] = useState(0);

  const classes = useStyles();
  const { t } = useTranslation();

  var itemMatchesSearchInput = function(item){
      var str = props.searchInput?.toLowerCase();

      var itemstr = item.bad + item.becken + item.ort + item.plz;
      itemstr = itemstr.toLowerCase();

      if(str === "" || !str){
          return true;
      }else{
          return itemstr.includes(str);
      }
  };

  var sortList = function(newItems){

      if (props.sortBy === "SORT_DATE"){
        newItems.sort((a, b) => {                
          if (a.date < b.date) { return 1; }
          if (a.date > b.date) { return -1; }
          return 0;
        });

      }else if (props.sortBy === "SORT_DIST"){
        newItems.sort((a, b) => {                
          if (a.dist > b.dist) { return 1; }
          if (a.dist < b.dist) { return -1; }
          if (a.dist === b.dist){
              if (a.date < b.date) { return 1; }
              if (a.date > b.date) { return -1; }
          }
          return 0;
        });
      }
  };

  useEffect(() => {
      //console.log("geolocated update useEffect", props?.coords?.latitude, props?.coords?.longitude)

      var newShortLat = shortenPos(props?.coords?.latitude);
      if (newShortLat !== shortLat){
        console.log("loc change: list update", shortLat, "->", newShortLat);
        setShortLat(newShortLat);
      }else{
        //console.log("loc minor change: ignored")
      }

      if (! props?.coords?.latitude){
          return;
      }

      var newItems = JSON.parse(JSON.stringify(items));

      newItems.map(item => {
        //console.log("geolocated recalc", item.badid_text)
        var userpos = {'latitude': props.coords.latitude, 'longitude': props.coords.longitude};
        var badpos = {'latitude': item.ortlat, 'longitude': item.ortlong} ;
        //item.dist = haversine(userpos, badpos) + Math.floor(Math.random() * 1300);
        item.dist = haversine(userpos, badpos);
        return item;
      });

      sortList(newItems);
      setItems(newItems);

  }, [props]);
  //}, [props]);

  useEffect(() => {
      console.log("search filter: ", props.searchInput)
      var str = props.searchInput?.toLowerCase();

      if (!items || items.length === 0){
          return;
      }

      var newItems = JSON.parse(JSON.stringify(items));

      //const filteredItems = items.filter(item => {
      newItems.map(item => {
        var itemstr = item.bad + item.becken + item.ort + item.plz;
        itemstr = itemstr.toLowerCase();

        if(str === "" || !str){
            item.searchInputMatch =  true;
        }else{
            item.searchInputMatch =  itemstr.includes(str);
        }
        return item;
      });

      sortList(newItems);
      setItems(newItems);

  }, [props.searchInput]);

  useEffect(() => {
    fetch("https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0")
    .then(res => res.json())
    .then(
      (result) => {
        console.log("reloaded list from Ajax useEffect");
        setIsLoaded(true);
        setNrenders(nrenders + 1);
        result = result.filter(item => item.ortlat);

        if (props.isGeolocationEnabled && ! props.coords){
          setShortLat(46.94);
        }

        if (props.isGeolocationEnabled && props.coords){
          var userpos = {'latitude': props.coords.latitude, 'longitude': props.coords.longitude};
          setShortLat(shortenPos(props.coords.latitude));
          result = result.map(item => {
            var badpos = {'latitude': item.ortlat, 'longitude': item.ortlong} 
            item.dist = haversine(userpos, badpos);
            return item;
          });
        }

        result = result.map(item => {
          item.searchInputMatch = itemMatchesSearchInput(item);
          return item;
        })

        sortList(result);
        setItems(result);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
      )
    }, [
      props.sortBy 
    ]); // fetch useEffect

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div className={classes.root}>itz nid jufle...</div>;
    } else {
      return (
        <div className={classes.root}>
        {items.filter(item => item.searchInputMatch).map(item => {
          return <BadCard bad={item} dist={item.dist} key={item.badid_text + '.' + item.beckenid} sm={item.searchInputMatch} />;
        })}
        </div>
        );
      } 
    }
    
    export default geolocated(geoOpts())(List) 
    