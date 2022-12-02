import React from 'react';
//import React, { useState } from 'react'; 

// when react.js calls it, params are JSON so use {} below in params
// DONT FORGET TO RETURN A VALUE ELSE IT RUNS OK BUT NOTHING IS VISIBLE!
function ReactSelectBox({ choices, label, value, onChange }) {
    // map example:...    items.map((zzz) => { console.log('val ' +  zzz.fval); return true; });
    console.log('ReactSelectBoxx')
    if (!choices.length) return "";
    return (
        <div> {label}
            <select value={value} onChange={onChange} >
                {choices.map((item) => { // anonymous function. If doesnt return value, output is BLANK!
                    return (<option key={item} value={item}>{item}</option>);
                })}
            </select>
        </div>
    );
};

function ReactSelectBox2({ choices, values, label, initValue, onChange }) {
    // map example:...    items.map((zzz) => { console.log('val ' +  zzz.fval); return true; });
    console.log('ReactSelectBoxx')
    if (!choices.length) return "";
    var idx = 0;
    return (
        <div> {label}
            <select value={initValue} onChange={onChange} >
                {
                choices.map((item) => { // anonymous function. If doesnt return value, output is BLANK!
                    return (<option key={item} value={values[idx++]} onMouseEnter={ console.log('asdf')} >{item}</option>);
                })}
            </select>
        </div>
    );
};

// make selector for frequency choice. Only accepts JSON object
function ReactSelectBoxLowHighStep( { low, high, step, label, value, onChange } ) {
    // console.log('math: ' + (Math.PI/4.0).toFixed(2))
    // console.log('high: ' + high + ' step: ' + step); return (<div></div>)
    var selectBoxItems = []; var idx;
    for (idx = low; idx < high; idx += step) {
        selectBoxItems.push({ fval: idx }); // must use object as item, or map fails
    }
    // map example:...    items.map((zzz) => { console.log('val ' +  zzz.fval); return true; });
    return (
        <div> {label}
            <select value={value} onChange={onChange} >
                {selectBoxItems.map((item) => { 
                    var lbl = (item.fval % 1 === 0) ? item.fval : item.fval.toFixed(2); // has decimals?
                    return (<option key={item.fval} value={item.fval}>{lbl}</option>);
                })}
                {/* {items.map((item) => ( 
              <option key={item.fval} value={item.fval}>{item.fval.toFixed(2)}</option>
          ))}  // WARNING: do not use this type of shortcut. if { instead of ( NO OUTPUT IS RETURNED! */}
            </select>
        </div>
    );
};

export { ReactSelectBox, ReactSelectBox2, ReactSelectBoxLowHighStep };
