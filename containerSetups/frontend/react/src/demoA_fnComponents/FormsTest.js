//import logo from './logo.svg';
import '../App.css';
import React from 'react';
//import ReactDOM from 'react-dom';

class FormsTest extends React.Component {
	// constructor(props) {
	//     super(props);
	// }

	state = {  flavor: 'shrimp', color: 'orange', loadMsg: 'not loaded' };

	componentDidMount() {
		setTimeout(() => {
		this.setState(() => ({ loadMsg: 'is loaded'}));
		}, 800);
	}

	getData3(jsonStuff) {
		console.log("getData3 named fcn " + jsonStuff.data.memes[5].name);
	}
	
	// handleClick2(e)  {
	// handleClick2(e)  { // normal notation .. REQUIRES BIND()
	handleClick2 = (e) => {  
		// NOTE: ARROW NOTATION MAKES BIND() UNNECESSARY IN CONSTRUCTOR!
		// it takes "this" from context so bind is not necessary.
		console.log("this.state.flavor: " + this.state.flavor);
		let bob = a => a + 100; // confusing shortand for function def'n'
		this.setState(() =>  ({  stateVariableA: bob(44), flavor: 'marshmallows'  }) )
		console.log('state: ' + this.state.stateVariableA);
	}
	
	DemoComponentWithProps = (props) => {
	  return <div id='DemoComponentWithProps' className='lowWide'
	           style={{ backgroundColor: 'yellow', height: '50px'}}>
				    1) name: {props.name} {props.color}, whatchecked: {this.state.whatschecked} </div>;
	}

	handleChangeOnFormA(event) {
		// event.target.type === "checkbox" ? 
		//   this.setState({ whatschecked: 'cbox' }) : 
		//   this.setState({ whatschecked: 'not-cbox' })
        this.setState(() => (
			{ [event.target.name]: event.target.value, formAFirstName:  event.target.value }));
			
    }
	DoFormA = (props) => {
		return <form onSubmit={()=>{ alert('submitted!');}} >
			<input type="text" name="firstName" placeholder="First Name" 
			  onChange={(event) => { this.handleChangeOnFormA(event); }} />
			{/* above arrow fcn gives "this" React.Component class to function so that
			setState will work, and passes event to it. */}
			<div style={{display: 'inline-block', fontSize: '30px', paddingLeft: '20px'}} >{this.state.loadMsg}</div>
			<div style={{display: 'inline-block', fontSize: '30px', paddingLeft: '20px'}} >{this.state.firstName} , {this.state.formAFirstName}</div>
			<br />
			<textarea value={"here is my textarea: " + this.state.firstName} onChange={()=>{ /*prevent no-onChange error msg ;*/ }}  />
			<input  name="sylvester" type="checkbox" checked={this.state.firstName} 
			  onChange={this.handleChangeOnFormA} />
			<br/>Select box:
			<select value='red' onChange={()=>{this.setState({ whatschecked: 'select box' })}} >
					<option></option>
                    <option>red</option>
                    <option>blue</option>
                    <option>yellow</option>
            </select><br/><br/>
			<input type="submit" value="Submit2"  />
		</form>;
	}

	render() {
	  return (
		// <div className="App"> 
		<div>
			<h3>this is FormsTest.js</h3>
	 	  <style> { this.styleBlock } </style> {/* this is the react.js way of style inside the file */}
	      <div>
		  <this.DoFormA name="zz" color="blue" />
		  {/* below div gets value from class's state. Changing state will
              change the value in the div upon next refresh.
              This is the react.js way of changing element's text*/}
		    <div id='div1' className='lowWide' onClick= {this.handleClick2}
               style={{ backgroundColor: 'green'}}> 0) 
               {this.state.flavor}</div>;
			
			<br/>this is jsx markup for react.js
	        <this.DemoComponentWithProps name="zz" color="blue" />
			
	      </div>
	
	    </div>
	  );
	}

}
export default FormsTest;

