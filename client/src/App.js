import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Header from './components/Header';
import Sales from './components/Sales';
import Overview from './components/Overview';

class App extends Component {
  // Initialize state
  constructor() {
    super();
    this.state = {
      monthLables: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      yearColors: [
        'rgba(93,138,168,1)',
        'rgba(93,168,123,0.3)',
        'rgba(168,93,138,0.3)',
        'rgba(255,128,150,0.3)',
        'rgba(93,101,168,0.3)',
      ],
      orders: null,
      inventories: null,
      items: null,
      inventory_costs: null,
      dataLoaded: false,
      currentDate: null,
      years: [],
      currentMonth: null,
      currentYear: null,
      lineChartData: null,
      barChartData: null,
      salesYearToView: 1,
      salesModal: false,
      salesStatus: '',
    };
    this.getOrders = this.getOrders.bind(this);
    this.getInventories = this.getInventories.bind(this);
    this.getItems = this.getItems.bind(this);
    this.getInventoryCosts = this.getInventoryCosts.bind(this);
    this.salesCreate = this.salesCreate.bind(this);
    this.getYears = this.getYears.bind(this);
    this.findKeyInObject = this.findKeyInObject.bind(this);
    this.getLineChartData = this.getLineChartData.bind(this);
    this.getBarChartData = this.getBarChartData.bind(this);
    this.handleSelectYearCall = this.handleSelectYearCall.bind(this);
    this.getCurrentMonth = this.getCurrentMonth.bind(this);
    this.getCurrentYear = this.getCurrentYear.bind(this);
    this.salesCreatedToggle = this.salesCreatedToggle.bind(this);
    this.handleYearsView = this.handleYearsView.bind(this);
  }

  componentDidMount() {
    this.getOrders();
    this.getItems();
    this.getInventories();
    this.getInventoryCosts();
    this.getCurrentDate();
    this.getInventories();
    this.getCurrentMonth();
    this.getCurrentYear();

  }

//get current month so we can compare with database month. and render specific month user choses on selector.
  getCurrentMonth() {
    const current = new Date().getMonth();
    console.log(current, 'this is currentMonth')
    let newCurrent = current + 1
    if (newCurrent < 10) {
      newCurrent = '0' + newCurrent;
    }
    this.setState({
      currentMonth: newCurrent
    });
  }

  getCurrentYear(){
    const currYear = new Date().getFullYear().toString();
    console.log(currYear, 'this is the current year')
    this.setState({
      currentYear: currYear
    })
  }

  lineChartDataHelper(year) {
    // create array with length of 12, fill each with 0
    const data = Array(12).fill(0);
    this.state.orders.map((order, i) => {
      const orderYear = order.order_date.split('-')[0]
      const orderMonth = Number(order.order_date.split('-')[1])
      if (orderYear === year) {
        data[orderMonth-1] += 1
      }
    })
    return data;
  }

  handleYearsView(e) {
    this.setState({
      salesYearToView: e,
    }, () => {
      this.getLineChartData();
    });
  }

  getLineChartData() {
    const yearsView = Number(this.state.salesYearToView);
    const yearColors = this.state.yearColors;
    const datasets = [];

    [...Array(yearsView)].map((e, i) => {
      if (this.state.years[i] === undefined) {
        return
      } else {
        datasets.push({
          label: this.state.years[i],
          fill: false,
          lineTension: 0,
          borderColor: yearColors[i],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.lineChartDataHelper(this.state.years[i]),
        });
      }
    });
    this.setState({
      lineChartData: {
        labels: this.state.monthLables,
        datasets,
      },
    });
  }

  getBarChartData() {
    this.setState({
      barChartData: {
        labels: this.state.monthLables,
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40],
          },
        ],
      },
    });
  }

  getCurrentDate() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    const year = today.getFullYear();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    today = year + '-' + month + '-' + day;

    this.setState({
      currentDate: today,
    });
  }

  getOrders() {
    // get order data and save to state
    axios.get('/api/orders')
      .then(res => (
        this.setState({
          orders: res.data.orders,
        })
      ))
      .catch(err => console.log(err));
  }

  getItems() {
    axios.get('/api/items')
      .then(res => (
        this.setState({
          items: res.data.items,
        })
      ))
      .catch(err => console.log(err));
  }

  getInventories() {
    // get inventory data and save to state
    axios.get('/api/inventories')
      .then(res => (
        this.setState({
          inventories: res.data.inventories,
        })
      ))
      .catch(err => console.log(err));
  }

  getInventoryCosts() {
    axios.get('/api/inventorycosts')
      .then((res) => {
        // run filter through respond data to find all years.
        this.getYears(res.data.inventory_costs);
        this.getLineChartData();
        this.getBarChartData();
        this.setState({
          inventory_costs: res.data.inventory_costs,
          dataLoaded: true,
        });
      });
  }


  /* take in two parameters an array and a value
  and return with a .some method where if element equals value we return. */
  checkIfExist(array, value) {
    return array.some((element) => {
      return element === value
    })
  }

  /* iterate through a single keyvalue in a collection of objects
  and locate a keyvalue pair with a key that has _date with a .search method. */
  findKeyInObject(date) {
    console.log(date, 'this is dates findKeyInObject')
    for (let key in date) {
      if (key.search('_date') !== -1) {

        return key
      }
    }
  }

// we then use date[dateKey] to explicitly use the dateKey variable and location the date produced by forEach method and slice out the year portion with slice(0,4). thus getting current year. everything else is self explanatory.
  getYears(dates) {
    const year_array = [];
    dates.forEach((date) => {
      const dateKey = this.findKeyInObject(date);
      let curr_year = date[dateKey].slice(0, 4);
      if (year_array.length === 0) {
        year_array.push(curr_year);
      } else if (!this.checkIfExist(year_array, curr_year)) {
        year_array.push(curr_year);
      }
    });
    this.setState({
      years: year_array,
    });
  }

  // trigger modal pop up to
  salesCreatedToggle(message) {
    this.setState({
      salesModal: !this.state.salesModal,
      salesStatus: message,
    });
  }

  // create new order and get that order id
  salesCreate(event, data) {
    event.preventDefault();
    axios.post('/api/orders', data)
      .then((res) => {
        if (res.status === 200) {
        // add newest order id as new key/value into data
          data.latestOrderId = res.data.last_order.order_id;

          // trigger modal pop up to notify that sales has created
          this.salesCreatedToggle('success');

          // axios call to update useditem table and in inventory table in database
          axios.post('/api/useditems', data);
        } else {
          this.salesCreatedToggle('failed');
        }
      });
  }

  handleSelectYearCall(value) {
    this.setState({
      currentYear: value
    });
  }

  render() {
    // console.log(this.state.inventory_costs, 'this is inventory costs');
    return (
      <div className="App">
        <Header />
        <Sidebar />
        <div className="body-container">

          {this.state.dataLoaded === true ? (
            <Switch>
              <Route
                exact
                path="/"
                render={props => (<Sales
                  {...props}
                  salesCreate={this.salesCreate}
                  currentDate={this.state.currentDate}
                  items={this.state.items}
                  orders={this.state.orders}
                  salesModal={this.state.salesModal}
                  salesCreatedToggle={this.salesCreatedToggle}
                  salesStatus={this.state.salesStatus}

                />)}
              />
              <Route
                path="/dashboard"
                render={props => (<Dashboard
                  {...props}
                  inventories={this.state.inventories}
                  orders={this.state.orders}
                  inventory_costs={this.state.inventory_costs}
                  items={this.state.items}
                  dataLoaded={this.state.dataLoaded}
                  getInventories={this.getInventories}
                  getInventoryCosts={this.getInventoryCosts}
                  getYears={this.getYears}
                  currentYear={this.state.currentYear}
                  years={this.state.years}
                  handleSelectYearCall={this.handleSelectYearCall}

                />)}
              />

              <Route
                exact
                path="/overview"
                render={props => (<Overview
                  {...props}
                  lineChartData={this.state.lineChartData}
                  barChartData={this.state.barChartData}
                  handleYearsView={this.handleYearsView}
                  years={this.state.years}
                />)}
              />

            </Switch>
          ) : (
            <p> Loading.... </p>
          )}

        </div>
        <Footer />
      </div>

    );
  }
}

export default App;
