// this component is standalone, so no imports......      import '../App.css';
// question: how to declare CSS in this file??
import React, { Component } from 'react';

/**  
 * This component makes a tty-style scrolling output do display text lines. Includes optional "clear" button.
 * caller example: [cbPushedClearBtn is a callback this component calls when "clear output"] pressed
 * <TTYStyleOutput id="consoleThing" 
				   text={ this.state.lnOutput } doClearBtn='yes' 
				   cbPushedClearBtn={ this.cbClearOutput } />
 */
class TTYStyleOutput extends Component {
    // constructor(props) {
    //     super(props) 
    // } 
    /* this gets called by framework when component updates. */
	componentDidUpdate() {
        // to get scrolling div to scroll to bottom when new content is appended
		const objDiv = document.getElementById('consoleThing');
        objDiv.scrollTop = objDiv.scrollHeight;
	}

    render() {
        // WARNING: below must have encompassing parent error else misleading error msg
        this.clearBtn = '';
        if (this.props.doClearBtn === 'yes') { 
            // vh is viewport %age, em is fontsize %age 
            this.clearBtn = <div className='fancyWithRadius' 
                style={{ margin:'0px', padding:'.1em', width: 'fit-content'}}
                onClick={() => this.props.cbPushedClearBtn() } > 
                clear console</div>
        } 

        /** the css grid thing "grid-template-rows: min-content auto;"
         * says make the first row height fit the content (height of button in this case)
         * and the second row "auto", which fills the rest of the grid in the parent div.
         * react.js/JSX notation makes this even more fun by changing
         * "grid-template-rows" to "gridTemplateRows"
         * Result is button is at top and console output goes below it, scrolling when full.
         */
        return (
            <div id='TTYStyleOutput'
               style={{ height: '100%',display:'grid', gridTemplateRows:'min-content auto',
                        background: '#2d2850', color: '#FFFF00',
                        fontFamily: 'Noto Sans\', sans-serif', fontSize: '12pt',
                        borderRadius: '10px', padding: '5px', margin:'10px',
                        border: 'solid 4px black' }}
             >
            <div style={{ gridRow: '1' }} >{ this.clearBtn } </div>
            <div id="consoleThing" dangerouslySetInnerHTML={{__html:  this.props.text }}
                        style={{ gridRow: '2', overflow: 'auto', margin: '1vh' }} >
                        {/* NOTE: props is set in constructor, but gets updated whenever this
                        component is rendered. Note this.state is NOT used! Props used instead! */} 
            </div>
            {/* <div id="consoleThing" 
                        style={{ gridRow: '2', overflow: 'auto', margin: '1vh' }} >
                        { / * NOTE: props is set in constructor, but gets updated whenever this
                        component is rendered. Note this.state is NOT used! Props used instead! * / }
                        { this.props.text } 
            {
            / * } dangerouslySetInnerHTML={{__html: { this.state.statusMsg } <br/> Output: { this.state.lnOutput }} } > * / }
            </div> */}
            </div>
         )
    }
}
export { TTYStyleOutput }