import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
//import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    root: {
        //minWidth: 275,
        marginBottom: "1em",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 2,
    },
    media: {
        height: "100%",
    },
    button: {
        display: "block",
        marginTop: "1em",
        marginBottom: "1em",
        marginLeft: "auto",
        marginRight: "auto",
    },
    jufle: {
        paddingTop: "2em",
    }
});

function BadDetail(props) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [bad, setBad] = useState({});
    const [error, setError] = useState(null);
    let { badidText } = useParams();
    let url = "https://beta.wiewarm.ch/api/v1/bad/" + badidText;
    // const history = useHistory();
    const classes = useStyles();
    const { t } = useTranslation();



    const beckenDetail = ((b) => {

        if (!b ){ return; }
        var becken = [ ];

        var bjsx = Object.getOwnPropertyNames(b).sort().map((k) => (
            
            <Card key={b[k].beckenid} variant="outlined" className={classes.root}>
                
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Typography variant="h5">
                            {b[k].beckenname}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h5">
                            {b[k].temp}&deg;
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="textSecondary">
                            {b[k].typ}, {b[k].status}, {t("aktualisiert")} {b[k].date_pretty} 
                        </Typography>
                    </Grid>

                </Grid>
            </CardContent>
            </Card>
        
        ));
        becken.push(bjsx);

        return becken;

    });

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setBad(result);
                },
                (error) => {
                    console.log("error", error)
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [url]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div className={classes.jufle}>itz nid jufle...</div>
    } else {
        return (
            <Grid container spacing={1} alignItems="center" justify="center">
                <Grid item xs={12}>
                    <h1> {bad.badname}, {bad.plz} {bad.ort} </h1>


                    {beckenDetail(bad.becken)}

                    {/*
                    <Button className={classes.button} onClick={() => { history.push("/"); }} variant="contained" size="large" color="primary">
                        Zrügg zur Lischte
                    </Button>
                    */}
                </Grid>

            <Card key="bad" variant="outlined" className={classes.root}>
                
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography color="textSecondary">{t("Details zur Badi")}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="h5">
                        {bad.badname}, {bad.plz} {bad.ort}<br/>
                    </Typography>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                        {bad.adresse1}<br/>
                        {bad.adresse2}<br/>
                        {bad.telefon}<br/>
                        {bad.email}<br/>
                        {bad.www}
                    </Typography>
                    </Grid>

                    <Grid item xs={4}>
                    <Typography variant="body2" color="textSecondary">{t("Zyte")}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                    <Typography variant="body2" color="textPrimary">{bad.zeiten}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                    <Typography variant="body2" color="textSecondary">{t("Prise")}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                    <Typography variant="body2" color="textPrimary">{bad.preise}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                    <Typography variant="body2" color="textSecondary">{t("Infos")}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                    <Typography dangerouslySetInnerHTML={{ __html: bad.info }} variant="body2" color="textPrimary"/>
                    </Grid>

                </Grid>
            </CardContent>
            </Card>
            </Grid>


        );
    }
}

export default BadDetail;
