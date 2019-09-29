const defaultState = {
  inputValue: 'Write Something',
  list:[ 
    '早八点开晨会，分配今天的代码任务',
    '早酒店吃饭'
  ]
}
export default (state = defaultState, action) => {
  console.log('------------>>>>>',state, action)
  if (action.type === 'changeInput') {
    let newState = JSON.parse(JSON.stringify(state))
    newState.inputValue = action.value
    console.log(newState)
    return newState
  }
  return state
}