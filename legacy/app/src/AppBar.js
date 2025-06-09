import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BuildIcon from '@material-ui/icons/Build';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    searchinput: {
        width: "100%",
        flexGrow: 1,
    },
    dp_none: {
        display: "none",
    },
    dp_block: {
        display: "block",
    },
}));



export default function ButtonAppBar({searchInput, handleSearchInput, handleSortInput}) {

    const classes = useStyles();
    const [showSearch, setShowSearch] = useState("dp_none");
    //const [inputRef, setInputFocus] = useFocus()
    //const inputEl = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const searchAvailable = location.pathname === "/" ? "dp_block" : "dp_none";
    console.log("sa", searchAvailable, location);

    const handleSearchClick = (event) => {
        console.log("search click:", event, classes)

        if (showSearch === "dp_none"){
            setShowSearch("dp_block");
            //console.log("inputEl.current", inputEl.current);
            //inputEl.current.focus();
        }else{
            setShowSearch("dp_none");
        }
    };

    const handleSearchCancel = (event) => {
        console.log("cancel search click:", event, classes)

        var newsearch = { target: { value: ""}};
        handleSearchInput(newsearch)
        setShowSearch("dp_none");
    };

   const handleSearchCheck = (event) => {
        console.log("check search click:", event, classes)
        setShowSearch("dp_none");
    };

    const handleLang  = (event) => {
        i18n.changeLanguage(event.currentTarget.dataset.lng);
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = (event) => {
        console.log("mclose", event.currentTarget.dataset.sort);
        setAnchorEl(null);
        handleSortInput(event.currentTarget.dataset.sort);
    };

    const searchButton = location.pathname === "/" ? (
        <IconButton onClick={handleSearchClick} edge="start" className={classes.menuButton + " " + searchAvailable} color="inherit" aria-label="menu">
        <SearchIcon />
        </IconButton>
    ) : (<span></span>);

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title }>{t('AppTitle')}</Typography>

                    {searchButton}

                    <IconButton onClick={handleClick} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <BuildIcon />
                    </IconButton>



                    <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} >
                        <MenuItem data-sort="SORT_DIST" onClick={handleClose}>{t("Sortiere nach Dischtanz")}</MenuItem>
                        <MenuItem data-sort="SORT_DATE" onClick={handleClose}>{t("Sortiere nach Datum")}</MenuItem>
                        <hr/>
                        <MenuItem data-lng="chBE" onClick={handleLang}>Sproch Bärndütsch</MenuItem>
                        <MenuItem data-lng="de" onClick={handleLang}>Sprache Deutsch</MenuItem>
                    </Menu>
                </Toolbar>

                <form className={classes.searchinput + " " + showSearch} noValidate autoComplete="off">

                    <TextField inputRef={input => input && input.focus()} /*ref={inputEl}*/  className={showSearch} autoFocus spellCheck="false" 
                        id="outlined-basic" label={t("Sueche...")} 
                        variant="outlined" value={searchInput} onChange={handleSearchInput} />

                    <IconButton onClick={handleSearchCancel} edge="start" 
                        className={classes.menuButton + " " + showSearch} color="inherit" aria-label="menu">
                        <CancelIcon />
                    </IconButton>

                    <IconButton onClick={handleSearchCheck} edge="start" 
                        className={classes.menuButton + " " + showSearch} color="inherit" aria-label="menu">
                        <CheckCircleIcon />
                    </IconButton>
                </form>
            </AppBar>
        </div>
        );
    }
    