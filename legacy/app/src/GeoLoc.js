import React from "react";
import { geolocated } from "react-geolocated";
import { shortenPos, geoOpts } from './index.js'


class GeoLoc extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {
        console.log(e.target.name, e.target.value)
        this.props.onSortByChange(e);
    };

    render() {
        var sel = (
            <select value={this.props.sortBy} name="sortBySelect" onChange={this.handleChange}>
                <option value="SORT_DATE">nach Datum</option>
                <option value="SORT_DIST">nach Dischtanz</option>
            </select>
        );

        if (!this.props.isGeolocationAvailable) {
            return (
                <p>
                    Dä Browser cha ke Geolocation<br />
                    {sel}
                </p>
            )

        } else if (!this.props.isGeolocationEnabled) {
            this.props.onSortByChange({ "target": { "value": "SORT_DATE" } });
            return (
                <p>
                    Geolocation isch usgschautet <br />
                    {sel}
                </p>
            )

        } else if (!this.props.coords) {
            return (
                <p>
                    Warte uf dini Position..
                    {sel}
                </p>
            )


        } else {
            return (
                <p>
                Dini Position: {shortenPos(this.props?.coords?.latitude)}, {shortenPos(this.props.coords.longitude)}&nbsp;
                mitGeo={this.props.isGeolocationEnabled ? 'jo' : 'nei'} chaGeo={this.props.isGeolocationAvailable ? 'jo' : 'nei'}
                    <br/>
                    {sel}
                </p>
            );
        }
    }
}

export default geolocated(geoOpts())(GeoLoc);
