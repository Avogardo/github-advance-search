import React, { Component } from 'react';
import { Debounce } from 'react-throttle';
import './Requests.css';
import { Button } from 'semantic-ui-react'

class Requests extends Component {

  constructor (props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      results2: [],
      results: [],
      page: 0,
      issueState: '',
      indexORState: 0,
    };
  }

  onSubmit (e) {
    e.preventDefault();
    const issue = e.target.value;

    if(issue === "") {
      console.log("nic tu nie ma");
    } else {
        const lowtext = issue.toLowerCase();

        const arrtext = lowtext.split(' ');
        const indexOR = this.findLabels(arrtext);

        if(Number.isInteger(indexOR)) {
          this.setState({
            issueState: issue,
            indexORState: indexOR
          })
          this.twoLabels(issue, indexOR);
        } else {
          this.setState({
            issueState: issue
          });
          this.oneLabel(issue);
        }
      }
  }

  twoLabels(issue, indexOR) {
  console.log(issue);
  console.log(indexOR);
	let issue1 = issue.split(" ");
  let issue2 = issue.split(" ");

  issue1.splice(indexOR, 2);

  let currentPage = this.state.page;



        fetch("https://api.github.com/search/issues?q="+issue1.join("+")+"?page="+currentPage).then(function(response) {
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

        fetch("https://api.github.com/search/issues?q="+issue2.join("+")+"?page="+currentPage).then(function(response) {
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
  console.log(issue);

  let currentPage = this.state.page;


    fetch("https://api.github.com/search/issues?q="+issue+"?page="+currentPage).then(function(response) {
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

  findLabels(arr) {
    if(arr.some((x) => x === '||')) {
      return arr.indexOf("||");
    } else {
      return arr
    }
  }

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

  uniq(a) {
     return Array.from(new Set(a));
  }

  nextPage(e) {
    e.preventDefault();
    const issue = this.state.issueState;
    const index = this.state.indexORState;

    let currentPage = this.state.page;
    currentPage++;

    this.setState({
      page: currentPage
    });

    if(index) {
      this.twoLabels(issue, index);
    } else {
      this.oneLabel(issue);
    }

  }

  render() {
    return (
            <div className="resoults">
                <h2>Szukaj</h2>
                <Debounce time="1000" handler="onChange">
                    <input type="text" onChange={this.onSubmit}/>
                </Debounce>
                <h3>Wyniki:</h3>
                <div>{this.print()}</div>
                {this.state.issueState? <Button primary onClick={(e) => this.nextPage(e)}>
                  Next
                </Button> : '' }
            </div>
    )
  }
}

export default Requests;