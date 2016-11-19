import React, { Component } from 'react';
//import fetch from 'fetch';

class Requests extends Component {

  constructor (props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      query: '',
      results: []
    };
  }



  onSubmit (e) {
    e.preventDefault();
    const issue = e.target.value;
console.log(issue);
    fetch("https://api.github.com/search/issues?q="+issue).then(function(response) {
        return response.json();
    }).then((data) => {

        let result = "";
        for(let i = 0; i < 30; i++) {
            result += data.items[i].html_url + "  ";
        }

        this.setState({
          results: result
        });

    }).catch(function() {
      console.log("error");
    });
  }

  render() {

    return (
            <div>
                <h2>Szukaj</h2>

                  <input type="text" onChange={this.onSubmit}/>


                <h2>Wyniki:</h2>
                <p>{this.state.results}</p>
            </div>
    )
  }
}
//{this.state.results.map((item, i) => <Issue key={i} item={item} />)}

export default Requests;
