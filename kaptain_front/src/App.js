import React from 'react';
import logo from './logo.svg';
import './App.css';
import {NavLink, Switch, Route} from 'react-router-dom';
import { Container, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import styled from 'styled-components'
import socketIOClient from 'socket.io-client';
import axios from 'axios'
import { matchSorter } from 'match-sorter'

const Styles = styled.div`
  padding: 1rem;
  display: block;
  max-width: 100%;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 1px;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows //rows.slice(0, 40)

  return (
    <>
    <div>Found {rows.length} records</div>
    <br />
    <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <>
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>          
              ))}
            </tr>
            <tr>
            {headerGroup.headers.map(column => (
                <th>
                {/* Render the columns filter UI */}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
                            </th>
              ))}
            </tr>
            </>
          ))}
          {/* <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              
            </th>
          </tr> */}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
    </>
  )
}

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
    accessor: 'Status', // accessor is the "key" in the data
    Filter: SelectColumnFilter,
    filter: 'includes',
  },
  {
    Header: 'Start Time',
    accessor: 'StartTime', // accessor is the "key" in the data
  },
]

const mapPodsData = (podsData) => Object.entries(podsData).map(
  (item) => item[1].metadata ? 
  ({
    Namespace: item[1].metadata.namespace,
    Name: item[1].metadata.name,
    Status: item[1].status.phase,
    StartTime: item[1].status.startTime,
  }) :
    ({
      Status: "-",
      Name: "-",
      Namespace: "-",
      StartTime: '-',
    })
)

const PodsView = (props) => {
  return (
    <div className="App">
      <Styles>
      <Table columns={columns} data={mapPodsData(props.PodsData)} />
    </Styles>
          {/*JSON.stringify(props)*/}
    </div>
  );
}



class PodsApp extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      PodsData:[{a:1}],
    }
    this.socket = this.configureSocket("http://localhost:8765")
    this.handleChange = this.handleChange.bind(this)
    this.startNewGame = this.startNewGame.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  configureSocket = (serverEndpoint) => {
    var socket = socketIOClient(serverEndpoint);
    socket.onAny(x => console.dir(x))
    console.log("connecting")
    socket.on('connect', () => {
      console.log("on connection")
        // if (this.state.channel) {
        //     this.handleChannelSelect(this.state.channel.id);
        // }
    });
    socket.on('pod_del', uid => {
      console.dir(uid)
        // let channels = this.state.channels;
        // channels.forEach(c => {
        //     if (c.id === channel.id) {
        //         c.participants = channel.participants;
        //     }
        // });
        // this.setState({ channels });
    });
    socket.on('pod_add', pod => {
        console.dir(pod)
        /*let channels = this.state.channels
        channels.forEach(c => {
            if (c.id === message.channel_id) {
                if (!c.messages) {
                    c.messages = [message];
                } else {
                    c.messages.push(message);
                }
            }
        });
        this.setState({ channels });*/
    });
    socket.connect()
    return socket;
}

  async startNewGame() {
    //console.dir(this.state);
    // const res = await RestApi.startNewGame({
    //   PlayerName: this.state.PlayerName,
    //   MaxMatchesPrerTurn: this.state.MaxMatchesPrerTurn,
    //   StartMatchesAmount: this.state.StartMatchesAmount,
    // })
    // console.dir(res)
    //navigate to /game
  }

  async componentDidMount() {
    const res = await axios.get("/api/k8s/pods/list")
    console.dir(res)
    this.setState({
      PodsData:res.data
    })
    console.dir(Object.entries(res.data))
    //this.configureSocket()
}
  

  render() {
    return <PodsView OnChange={this.handleChange} NewGameHandler={this.startNewGame} {...this.state}/>
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
