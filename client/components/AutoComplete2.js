import React, { useState, useEffect } from "react";
import airport from "../../airports.json";
import Fuse from "fuse.js";

export default function AutoComplete(props) {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     activeIndex: 0,
  //     matches: [],
  //     query: "",
  //     airportObj: {},
  //     selected: false,
  //   };
  const [state, setState] = useState({
    activeIndex: 0,
    matches: [],
    query: "",
    airportObj: {},
    selected: false,
  });

  // this.handleSelection = this.handleSelection.bind(this);
  // this.updateQuery = this.updateQuery.bind(this);
  // this.fuzzyMatch = this.fuzzyMatch.bind(this);
  // }

  const fuzzyMatch = (query) => {
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
    setState({
      ...state,
      matches,
    });
    // this.setState({ matches });
  };

  const handleSelection = (event, selection) => {
    event.preventDefault();

    // this.setState({
    //   activeIndex: 0,
    //   query: selection.item.city,
    //   matches: [],
    //   airportObj: selection,
    //   selected: true,
    // });

    // setState({
    //   ...state,
    //   activeIndex: 0,
    //   query: selection.item.city,
    //   matches: [],
    //   airportObj: selection,
    //   selected: true,
    // });

    const { code, lon, lat } = selection.item;
    // const { firstFlight, location } = this.props;
    const { firstFlight, location, setTripAirportCode } = props;
    const trip = {
      firstFlight,
      location,
      code,
      lon,
      lat,
    };
    // this.props.setTripAirportCode(trip);
    setTripAirportCode(trip);
  };

  useEffect(() => {
    function updateQuery (e) {
      console.log(e.target);
      const query = e.target.value;
      setState({
        ...state,
        query: e.target.value,
      });
      // this.setState({ query });
      // this.fuzzyMatch(query);
      fuzzyMatch(query);
    };
  })

  // const updateQuery = (e) => {
  //   console.log(e.target);
  //   const query = e.target.value;
  //   setState({
  //     ...state,
  //     query: e.target.value,
  //   });
  //   // this.setState({ query });
  //   // this.fuzzyMatch(query);
  //   fuzzyMatch(query);
  // };

  // render() {
  // const { name, placeholder } = this.props;
  // const { activeIndex, matches, query } = this.state;

  const { name, placeholder } = props;
  const { activeIndex, matches, query } = state;

  return (
    <div className="field">
      <div className="control">
        <div className={`dropdown ${matches.length > 0 ? "is-active" : ""}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              className="input"
              name={name}
              value={query}
              // onChange={this.updateQuery}
              onChange={updateQuery}
              placeholder="Begin typing in your airport"
            />
          </div>
          <div className="dropdown-menu">
            {matches.length > 0 && (
              <div className="dropdown-content">
                {matches.map((match, index) => (
                  <a
                    className={`dropdown-item has-text-black ${
                      index === activeIndex ? "is-active" : ""
                    }`}
                    href="/"
                    key={index}
                    // onClick={(event) => this.handleSelection(event, match)}
                    onClick={(event) => handleSelection(event, match)}
                  >
                    {match.item.city}, {match.item.state}, {match.item.country},{" "}
                    {match.item.code}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  // }
}

// export default Autocomplete;
