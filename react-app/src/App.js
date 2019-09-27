import React, {Component} from 'react'

class App extends Component {
    render() {
        return (
            <div>
                <ul className="my-list">
                    <li>{true ? 'JS Pang': 'Patch Pan'}</li>
                    <li>I love React</li>
                </ul>
            </div>
            
        )
        // var child1 = React.createElement('li', null, 'Jspan')
        // var child2 = React.createElement('li', null, 'I love React')
        // var root = React.createElement('ul', {className: 'my-list'}, child1, child2)
        // return root

    }
}

export default App