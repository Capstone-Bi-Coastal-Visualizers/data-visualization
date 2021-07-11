import React, { useState, useEffect } from "react";
import airport from "../../airports.json";
import Fuse from "fuse.js";

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      matches: [],
      query: "",
      airportObj: {},
      selected: false,
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.fuzzyMatch = this.fuzzyMatch.bind(this);
  }

  fuzzyMatch(query) {
    const options = {
      isCaseSensitive: false,
      includeScore: true,
      shouldSort: true,
      minMatchCharLength: 3,
      location: 0,
      threshold: 0.1,
      keys: ["code", "city", "state", "country"],
    };

    const fuse = new Fuse(airport, options);
    const matches = fuse.search(query);

    this.setState({ matches });
  }

  handleSelection(event, selection) {
    event.preventDefault();

    this.setState({
      activeIndex: 0,
      query: selection.item.city,
      matches: [],
      airportObj: selection,
      selected: true,
    });

    const { code, lon, lat } = selection.item;
    const { firstFlight, location } = this.props;
    const trip = {
      firstFlight,
      location,
      code,
      lon,
      lat,
    };
    this.props.setTripAirportCode(trip);
  }

  updateQuery(e) {
    const query = e.target.value;

    this.setState({ query });
    this.fuzzyMatch(query);
  }

  render() {
    const { name, placeholder } = this.props;
    const { activeIndex, matches, query } = this.state;

    return (
      <div className="field">
        <div className="control">
          <div className={`dropdown ${matches.length > 0 ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
              <input
                type="text"
                className="input is-shadowless"
                name={name}
                value={query}
                onChange={this.updateQuery}
                placeholder={placeholder}
              />
            </div>
            <div className="dropdown-menu">
              {matches.length > 0 && (
                <div className="dropdown-content">
                  {matches.map((match, index) => (
                    <a
                      className={`dropdown-item has-text-black is-clickable ${
                        index === activeIndex ? "is-active" : ""
                      }`}
                      href="/"
                      key={index}
                      onClick={(event) => this.handleSelection(event, match)}
                    >
                      {match.item.city}, {match.item.state},{" "}
                      {match.item.country}, {match.item.code}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AutoComplete;
