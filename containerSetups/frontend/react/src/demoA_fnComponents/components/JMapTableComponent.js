import '../../App.css';
import React from 'react';

    function JMapTableComponent(jsonIn) {
        //console.log('JMapTableComponent ' + jsonIn.theList[2].color)
        // (<ul>{jsonObjA.theList.map(item => <li keyy={item.keyy}>name2: {item.name}, color2:{item.color}</li>)}</ul>)
        var label = 'from JSX react.js component in separate file..:';
        const rows = jsonIn.theList.map((item, ct) => { 
            // ct is a react thing which counts iterations
            return <tr style={{backgroundColor: ct%2 ? '#55ff55':'#5555ff', color:'red'}} key={item.keyy}>
                        <td>{item.keyy}</td><td>{item.name}</td><td>{item.color}</td>
                    </tr> 
        })
        // WARNING: below must have encompassing parent error else misleading error msg
        return <div>{label} <table><tbody>{rows}</tbody></table></div>
        //return {`${label}`} <table><tbody>{rows}</tbody></table>
        //return <table><tbody>{rows}</tbody></table>
    }

    var ct = 0;
    function JMapListItemTemplate(jsonIn) {
        //console.log('JMapListItemTemplate ' + jsonIn.theList[2].color)
        return (<div>count: {ct++}
                   <ul className='css_3'>
                       {jsonIn.theList.map(
                           item => <li 
                           key={item.keyy}>
                           {/* key: {item.keyy},  */}
                           name2: {item.name}, 
                           color2:{item.color}
                </li>)}</ul></div>)
    }

export { JMapTableComponent, JMapListItemTemplate };