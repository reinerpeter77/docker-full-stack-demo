import '../../App.css';
import React from 'react';

    function JMapTableComponent(jsonObjA) {
        // (<ul>{jsonObjA.theList.map(item => <li keyy={item.keyy}>name2: {item.name}, color2:{item.color}</li>)}</ul>)
        var label = 'from JSX react.js component in separate file..:';
        const rows = jsonObjA.theList.map((item, ct) => { 
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

export default JMapTableComponent;