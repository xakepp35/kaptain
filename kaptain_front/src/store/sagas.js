import {take, actionChannel, call, eventChannel, put, takeEvery, all } from 'redux-saga/effects'
import neffos from 'neffos.js'

// function websocketInitChannel() {
//     return eventChannel( emitter => {
//       //const ws = new WebSocket() 
//     //   ws.onmessage = e => {
//     //     return emitter( { type: 'ACTION_TYPE', payload } )
//     //   }
//       // unsubscribe function
//       return () => {
//         // do whatever to interrupt the socket communication here
//       }
//     })
// }

export function* neffosSaga() {
    console.log('Hello Sagas!')
}