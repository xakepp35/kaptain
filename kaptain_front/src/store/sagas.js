import {eventChannel} from 'redux-saga'
import {take, actionChannel, call, put, takeEvery, all } from 'redux-saga/effects'
import neffos from 'neffos.js'

import { POD_ADD, POD_DEL } from "../actions/types";

const frontVersion = "0.1"

const wsScheme = document.location.protocol === "https:" ? "wss" : "ws"
const wsPort = document.location.port ? ":" + document.location.port : ""
const wsEndpoint = wsScheme + "://" + document.location.hostname + wsPort + "/neffos"

let neffosSocket

// wrapping function for socket.on
// const connect = () => {
//     socket = io(socketServerURL);
//     return new Promise((resolve) => {
//     socket.on(‘connect’, () => {
//     resolve(socket);
//     });
//     });
// };

const createSocketChannel = () => eventChannel(async(emit) => {
    neffosSocket = await neffos.dial(wsEndpoint, {
        default: { // "default" namespace.
            _OnNamespaceConnected: (nsConn, msg) => {
                console.log("connected to namespace: " + msg.Namespace);
                // handleNamespaceConnectedConn(nsConn);
            },
            _OnNamespaceDisconnect: (nsConn, msg) => {
                console.log("disconnected from namespace: " + msg.Namespace);
            },
            _OnRoomJoined: (nsConn, msg) => {
                console.log("joined to room: " + msg.Room);
            },
            _OnRoomLeft: (nsConn, msg) => {
                console.log("left from room: " + msg.Room);
            },
            add: (nsConn, msg) => {
                if( msg.Room === "pods") {
                    const podEntity = JSON.parse(msg.Body)
                    emit({
                        type: POD_ADD,
                        payload: podEntity,
                    })
                }
            },
            del: (nsConn, msg) => {
                if( msg.Room === "pods") {
                    const podUID = msg.Body
                    if (podUID) {
                        emit({
                            type: POD_DEL,
                            payload: podUID,
                        })
                    }
                }
            },
        }
    }, {
        headers: {
            'X-Version': frontVersion,
        },
        // if > 0 then on network failures it tries to reconnect every 5 seconds, defaults to 0 (disabled).
        reconnect: 5000
    })
    await neffosSocket.connect("default");
    return () => {
        //unsubscriber
    }
})

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

export function* neffosSaga () {
    console.log('neffosSaga started')
    const socketChannel = yield call(createSocketChannel)
    // then put the new data into the reducer
    while (true) {
        const newEvent = yield take(socketChannel)
        yield put({
            type: newEvent.type,
            payload: newEvent.payload,
        });
    }
}
