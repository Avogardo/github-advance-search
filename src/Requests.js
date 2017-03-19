import React, { Component } from 'react';
import { Debounce } from 'react-throttle';

class Requests extends Component {

  constructor (props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      results2: [],
      results: []
    };
  }

  onSubmit (e) {
    e.preventDefault();
    const issue = e.target.value;
    //const realIssue = 'bug label:bug || label:issue dupsko';

    if(issue === "") {
      console.log("nic tu nie ma");
    } else {
        const lowtext = issue.toLowerCase();

        const arrtext = lowtext.split(' ');
        const indexOR = this.findLabels(arrtext);

        if(Number.isInteger(indexOR)) {
          this.twoLabels(issue, indexOR);
        } else {
          this.oneLabel(issue);
        }
      }
  }

  twoLabels(issue, indexOR) {

	let issue1 = issue.split(" ");
  let issue2 = issue.split(" ");

  issue1.splice(indexOR, 2);

        fetch("https://api.github.com/search/issues?q="+issue1.join("+")).then(function(response) {
        return response.json();
    }).then((data) => {

        let result = [];
        for(let i = 0; i < 30; i++) {
            result[i] = data.items[i].html_url;
        }

        this.setState({
          results: result
        });

    }).catch(function() {
      console.log("error");
    });


    issue2.splice(indexOR-1, 2);

        fetch("https://api.github.com/search/issues?q="+issue2.join("+")).then(function(response) {
        return response.json();
    }).then((data) => {

        let result = [];
        for(let i = 0; i < 30; i++) {
            result[i] = data.items[i].html_url;
        }

        this.setState({
          results2: result
        });

    }).catch(function() {
      console.log("error");
    });
  }

  oneLabel(issue) {
        fetch("https://api.github.com/search/issues?q="+issue).then(function(response) {
        return response.json();
    }).then((data) => {


        let result = [];
        for(let i = 0; i < 30; i++) {
            result[i] = data.items[i].html_url;
        }

        this.setState({
          results: result
        });

    }).catch(function() {
      console.log("error");
    });
  }

//Sprawdza, czy wystepuje or i zwraca jego pozycje
  findLabels(arr) {
    if(arr.some((x) => x === '||')) {
      return arr.indexOf("||");
    } else {
      return arr
    }
  }

//Drukuje wyniki
  print() {
    if(this.state.results2.length === 1) {
      return this.state.results.map(function(z, i) {
        return <div key={i}>
            <a href={z}>{z}</a>
          </div>
      });
    } else {
      const uniq = this.uniq(this.state.results.concat(this.state.results2));

      return uniq.map(function(z, i) {
        return <div key={i}>
            <a href={z}>{z}</a>
          </div>
      });
    }
  }

//Usuwa te same wyniki
  uniq(a) {
     return Array.from(new Set(a));
  }

  render() {
    return (
            <div>
                <h2>Szukaj</h2>
                <Debounce time="1000" handler="onChange">
                    <input type="text" onChange={this.onSubmit}/>
                </Debounce>
                <h2>Wyniki:</h2>
                <div>{this.print()}</div>
            </div>
    )
  }
}

export default Requests;