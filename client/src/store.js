import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./Reducers";
import { composeWithDevTools } from 'redux-devtools-extension';


// function saveToLocalStorage(state) {
//     try {
//         const serializedState = JSON.stringify(state);
//         sessionStorage.setItem('state', serializedState)
//     } catch (error) {
//         console.log(error);

//     }
// }
// function loadFromLocalStorage() {
//     try {
//         const serializedState = sessionStorage.getItem('state');
//         if (serializedState === null) return undefined
//         return JSON.parse(serializedState)
//     } catch (error) {
//         console.log(error);
//         return undefined
//     }
// }


const initialState = {};


const middleware = [thunk];

// const persistedState = loadFromLocalStorage()

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
// store.subscribe(() => saveToLocalStorage(store.getState))
export default store;

// const store = createStore(reducer, composeWithDevTools(
//     applyMiddleware(...middleware),
    // other store enhancers if any
// ));