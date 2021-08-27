import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../history';

const POLL_INERVAL_MS = 10000;
const CIRCULATION_LIMIT = 21000000;

class TransactionPool extends Component {
  state = { transactionPoolMap: {}, disabled:'' };

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
    // fetch(`http://localhost:3000/api/transaction-pool-map`)
    
    // fetch(`https://5147f5637edc.ngrok.io/api/transaction-pool-map`)
      .then(response => response.json())
      .then(json => {
        this.setState({ transactionPoolMap: json });
        this.getMindedTokenSums();
      });
  }

  fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`)
    // fetch(`http://localhost:3000/api/mine-transactions`)
      .then(response => {
        if (response.status === 200) {
          alert('success');
          history.push('/blocks');
        } else {
          alert('The mine-transactions block request did not complete.');
        }
      });
  }

  getMindedTokenSums = () => {
    fetch(`${document.location.origin}/api/mined-token-sum`)
    // fetch(`http://localhost:3000/api/mine-transactions`)
    .then(response => response.json())
    .then(json => {
      console.log('mined token sums are ', json);
      if(json>POLL_INERVAL_MS) this.setState({disabled:'disabled'})
    });
  }

  componentDidMount() {
    this.fetchTransactionPoolMap();

    this.fetchPoolMapInterval = setInterval(
      () => this.fetchTransactionPoolMap(),
      POLL_INERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    console.log('here are some transaction Pools :// ', this.state.transactionPoolMap)
    return (
      <div className='TransactionPool'>
        <div><Link to='/'>Home</Link></div>
        <h3>Transaction Pool</h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction => {
            return (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            )
          })
        }
        <hr />
        <Button
          bsStyle="danger"
          onClick={this.fetchMineTransactions}
          disabled = {this.state.disabled}
        >
          Mine the Transactions
        </Button>
        
      </div>
    )
  }
}

export default TransactionPool;