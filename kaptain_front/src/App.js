import React from 'react';
import logo from './logo.png';
import './App.css';
import {NavLink, Switch, Route} from 'react-router-dom';
import { Container, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import Table from './Table'
import styled from 'styled-components'
//import socketIOClient from 'socket.io-client';
import neffos from 'neffos.js'
import axios from 'axios'


const scheme = document.location.protocol === "https:" ? "wss" : "ws";
const port = document.location.port ? ":" + document.location.port : "";
const wsURL = scheme + "://" + document.location.hostname + port + "/neffos";

const frontVersion = "0.1"

const Styles = styled.div`
  padding: 1rem;
  display: block;
  max-width: 100%;
`

const columns = [
  {
    Header: 'Namespace',
    accessor: 'Namespace',
  },
  {
    Header: 'Name',
    accessor: 'Name',
  },
  {
    Header: 'Status',
    accessor: 'Status',
  },
  {
    Header: 'Start Time',
    accessor: 'StartTime', 
  },
  {
    Header: 'Node',
    accessor: 'NodeName', 
  },
]


const mapPodsData = (podsData) => Object.entries(podsData).map(
  (item) => ({
    Namespace: item[1].metadata.namespace,
    Name: item[1].metadata.name,
    Status: item[1].status.phase,
    StartTime: item[1].status.startTime,
    NodeName: item[1].spec.nodeName,
  })
)

const mockData = [{
  Namespace: "default",
  Name: "some_pod_name",
  Status: "Running",
  StartTime: "16:20",
  NodeName: "master.node.com",
}]

const PodsView = (props) => (
  <div className="App">
    <Styles>
      <Table columns={columns} data={mapPodsData(props.PodsData)} />
    </Styles>
  </div>
)


class PodsApp extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      PodsData:{},
    }
    this.PodsData = {}
    this.handleChange = this.handleChange.bind(this)
    this.configureSocket = this.configureSocket.bind(this)
    this.addHandler = this.addHandler.bind(this)
    this.delHandler = this.delHandler.bind(this)
    this.timerRenderer = this.timerRenderer.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  addHandler(nsConn, msg) {
    // console.log("add")
    // console.dir(msg)
    if( msg.Room === "pods") {
      const podEntity = JSON.parse(msg.Body)
      if (podEntity.metadata) {
        // let podsData = {...this.state.PodsData};
        // podsData[podEntity.metadata.uid]=podEntity
        // this.setState({
        //   PodsData: podsData
        // })
        this.PodsData[podEntity.metadata.uid]=podEntity
      }
    }
  }

  delHandler(nsConn, msg) {
    // console.log("del")
    // console.dir(msg)
    if( msg.Room === "pods") {
      const podUID = msg.Body
      if (podUID) {
        // let podsData = {...this.PodsData};
        // delete podsData[podUID]
        // this.setState({
        //   PodsData: podsData
        // })
        delete this.PodsData[podUID]
      }
    }
  }

  timerRenderer() {
    this.setState({
      PodsData: this.PodsData
    })
  }

  async configureSocket(serverEndpoint) {
    //console.dir(this);
    const conn = await neffos.dial(wsURL, {
      default: { // "default" namespace.
          _OnNamespaceConnected: function (nsConn, msg) {
              console.log("connected to namespace: " + msg.Namespace);
             // handleNamespaceConnectedConn(nsConn);
          },
          _OnNamespaceDisconnect: function (nsConn, msg) {
            console.log("disconnected from namespace: " + msg.Namespace);
          },
          _OnRoomJoined: function (nsConn, msg) {
            console.log("joined to room: " + msg.Room);
          },
          _OnRoomLeft: function (nsConn, msg) {
            console.log("left from room: " + msg.Room);
          },
          add: this.addHandler,
          del: this.delHandler,
      }
    }, {
      headers: {
          'X-Version': frontVersion,
      },
      // if > 0 then on network failures it tries to reconnect every 5 seconds, defaults to 0 (disabled).
      reconnect: 5000
    });

    await conn.connect("default");
    return conn
  }


  async componentDidMount() {
    // const res = await axios.get("/api/k8s/pods/list")
    // console.dir(res)
    // this.setState({
    //   PodsData:res.data
    // })
    //console.dir(Object.entries(res.data))
    //this.configureSocket()
    console.log(wsURL)
    this.socket = await this.configureSocket(wsURL)
    setInterval(this.timerRenderer, 200)
}
  

  render() {
    return <PodsView OnChange={this.handleChange} {...this.state}/>
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <a
          className="App-link"
          href="https://github.com/xakepp35/kaptain"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} className="App-logo" alt="logo" />
          github
        </a>
        <NavLink
          className="App-link"
          to="/pods"
          rel="noopener noreferrer"
        >
          Pods
        </NavLink>
        <NavLink
          className="App-link"
          to="/nodes"
          rel="noopener noreferrer"
        >
          Nodes
        </NavLink>
        
      </header>
      <main className="App-main">
        <Switch>
          <Route exact path='/' component={PodsApp}/>
          <Route path='/pods' component={PodsApp}/>
        </Switch>
      </main>
    </div>
  );
}

export default App;
