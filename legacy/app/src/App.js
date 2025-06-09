import React, { useState } from 'react';
import List from "./List.js";
import './App.css';
//import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
//import Typography from "@material-ui/core/Typography";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import GeoLoc from "./GeoLoc.js";
import BadDetail from "./BadDetail.js";
import AppBar from "./AppBar.js";
import { HashRouter as Router, Switch, Route} from "react-router-dom";

function App() {


    const [sortBy, setSortBy] = useState("SORT_DIST");
    const [searchInput, setSearchInput] = useState("");

    /*
    const onSortByChange = event => {
        console.log("sort changeFromBelow: ", event.target.value);
        setSortBy(event.target.value);
    };
    */

    const handleSortInput = order => {
        console.log("sort changeFromBelow: ", order);
        setSortBy(order);
    };

    const handleSearchInput  = event => {
        console.log("search changeFromBelow: ", event.target.value);
        setSearchInput(event.target.value);
    };

    //https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=FDD835&secondary.color=C62828
    const themeInstance = createMuiTheme({
        palette: {
            primary: {
                main: '#fdd835',
            },
            secondary: {
                main: '#c62828',
            },
            background: {
                default: "#ffffff"
            }
        },
    });

    return (
        <React.Fragment>
            <CssBaseline />
            <ThemeProvider theme={themeInstance}>
                <Router>
                <AppBar position="sticky" searchInput={searchInput} handleSearchInput={handleSearchInput} handleSortInput={handleSortInput}/>
                <Container maxwidth="sm" color="primary.main">
                <Switch>

                    <Route path="/badi/:badidText">
                        <BadDetail />
                    </Route>

                    <Route path="/">
                        { /* <GeoLoc sortBy={sortBy} onSortByChange={onSortByChange} /> */}
                        <List maxitems="10" sortBy={sortBy} searchInput={searchInput}/>
                    </Route>

                </Switch>
                </Container>
                </Router>
            </ThemeProvider>
        </React.Fragment>
    );

}

export default App;
