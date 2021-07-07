import React from "react";
import airport from "../../airports.json";
import Fuse from "fuse.js";

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      matches: [],
      query: "",
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
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 3,
      location: 0,
      threshold: 0.1,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      keys: ["code", "city"],
    };

    const fuse = new Fuse(airport, options);
    console.log(query);
    console.log(fuse.search(query));
  }

  handleSelection(event, selection) {
    event.preventDefault();

    this.setState({
      activeIndex: 0,
      query: selection,
      matches: [],
      selected: true,
    });
  }

  updateQuery(e) {
    const { data } = this.props;
    const query = e.target.value;
    if (!this.state.selected) {
      this.setState({
        matches:
          query.length >= 2
            ? data.filter(
                (item) => item.toUpperCase().indexOf(query.toUpperCase()) >= 0
              )
            : [],
        query,
      });
    } else {
      if (e.nativeEvent.inputType === "deleteContentBackward") {
        this.setState({
          matches: [],
          query: "",
          selected: false,
        });
      }
    }
    this.fuzzyMatch(query);
  }

  render() {
    const { label, name, placeholder } = this.props;
    const { activeIndex, matches, query } = this.state;

    return (
      <div className="field">
        {label && <label className="label">{label}</label>}
        <div className="control">
          <div className={`dropdown ${matches.length > 0 ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
              <input
                type="text"
                className="input"
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
                      className={`dropdown-item ${
                        index === activeIndex ? "is-active" : ""
                      }`}
                      href="/"
                      key={match}
                      onClick={(event) => this.handleSelection(event, match)}
                    >
                      {match}
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

export default Autocomplete;
