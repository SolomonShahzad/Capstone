import React, {Component} from 'react';
// import logo from './logo.svg';
import {HashRouter, Route, Link, Redirect} from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register'
import {firebaseApp} from './Firebase';
import Dashboard from './components/Dashboard'

var items = [];
var itemPrices = [];
var a = 0;
var taxRate = 0;
var total = 0;

function addItem(){
  var itemName = document.getElementById("itemID").value;
  var itemPrice = document.getElementById("priceID").value;
    a++;
  items.push(a + ": " + itemName + " - " + itemPrice);
  itemPrices.push(parseFloat(itemPrice));
  alert(itemName + " - " + itemPrice + " was added to your cart");
}

// function updateItem(){
//     var originalItemIndex = document.getElementById("originalItemID").value;
//     var newItemName = document.getElementById("NewItemID").value;
//     var newItemPrice = document.getElementById("NewItemPriceID").value;
    
//     items.splice(originalItemIndex - 1, 1, originalItemIndex + ": " + newItemName + " - " + newItemPrice);
//   }

function deleteItem(){
    var itemIndex = document.getElementById("DeleteItemID").value;
    items.splice(itemIndex - 1, 1);
    itemPrices.splice(itemIndex - 1, 1);
    document.getElementById("viewAllItemsID").innerHTML = items;
    // total = 0;
}

function viewAllItems(){
    for (var i = 0; i < itemPrices.length; i++) {
        total += itemPrices[i];
}   
    
    var salesTax = total * (taxRate / 100);
    total = total + salesTax;

    alert("Total - $" + total);

    document.getElementById("itemsTotalID").innerHTML = total;
    document.getElementById("viewAllItemsID").innerHTML = items;

    total = 0;
}

function addTaxRate() {
    taxRate = parseFloat(document.getElementById("taxRateID").value);
    document.getElementById("viewTaxRateID").innerHTML = taxRate;
}

class App extends Component {

    constructor() {
        super();
        this.state = {
            authed: false,
            userid: null,
            email: null
        }
    }


    componentDidMount() {
        this.removeFirebaseEvent = firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({authed: true, userid: user.uid, email: user.email})


            } else {
                this.setState({
                    authed: false,
                })
            }
        })

    }


    logout = ()=> {
        firebaseApp.auth().signOut();
    }

    componentWillUnmount() {
        this.removeFirebaseEvent()
    }

    render() {
        return (
            <HashRouter>
                <div className="App">
                    <div className="App-header">
                        {/* <img src={logo} className="App-logo" alt="logo"/> */}
                        <h2>POCKET CASHIER </h2>
                    </div>

                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="container">
                            
                            <ul className="nav navbar-nav pull-right">

                                <li>
                                    <Link to="/dashboard" className="navbar-brand">Dashboard</Link>
                                </li>
                                <li>
                                    {this.state.authed
                                        ? <button
                                        style={{border: 'none', background: 'transparent'}}
                                        className="navbar-brand" onClick={this.logout}>Logout</button>
                                        : <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                        <Link to="/register" className="navbar-brand">Register</Link>
                      </span>}
                                </li>
                            </ul>
                        </div>
                    </nav>
                    {!this.state.authed ? <div className="container"><h3>Please login to access your wishlist if you are an existing user.</h3>
                        <hr/>
                        <h3> Please register to access your wishlist</h3>
                    </div> : ''}
                    <div>
                        <Route path='/' render={()=>this.state.authed ? <Redirect to='/dashboard'/> : <div></div>}/>
                        <Route path='/login' render={()=>this.state.authed ? <Redirect to='/dashboard'/> : <Login/>}/>
                        <Route path='/dashboard'
                               render={()=>this.state.authed ?
                                   <Dashboard userid={this.state.userid} email={this.state.email}/> :
                                   <Redirect to='/login'/>}/>
                        <Route path='/register' component={Register}/>
                    </div>

                    <div>
                        <input type="text" placeholder="6% - just add Num." id="taxRateID"></input> 
                        <br></br> 
                        <button type="button" onClick={addTaxRate}>Add Tax Rate</button>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                <div></div>
                        
                    <div>
                        <input type="text" placeholder="item" id="itemID"></input> 
                        <input type="text" placeholder="price" id="priceID"></input>
                        <br></br> 
                        <button type="button" onClick={addItem}>Add Item</button>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                {/* <div>
                    <label>replace</label>
                    <input type="text" placeholder="original item number" id="originalItemID"></input> 
                    <br></br> 
                    <label>with</label> 
                    <input type="text" placeholder="new item name" id="NewItemID"></input> 
                    <input type="text" placeholder="new item price" id="NewItemPriceID"></input>
                    <br></br>  
                    <button type="button" onClick={updateItem}>Update Item</button>
                </div>
                    <br></br>
                    <br></br>
                    <br></br> */}

                    {/* <label>Delete</label> */}
                    <input type="text" placeholder="Enter item number" id="DeleteItemID"></input>
                    <br></br> 
                    <button type="button" onClick={deleteItem}>Delete Item</button>

                    <br></br>
                    <br></br>
                    <br></br>

                    <button type="button" onClick={viewAllItems}>View All Items</button>

                    <br></br>
                    <br></br>
                    <br></br>

                    <p><span id="viewAllItemsID"></span> - All items will display here</p>
                    <p><span id="itemsTotalID"></span> - Total</p>
                    <p><span id="viewTaxRateID"></span>% - Tax Rate</p>
                    <br></br>
                    <br></br>
                    <br></br>

                </div>
            </HashRouter>
        );
    }
}

export default App;
