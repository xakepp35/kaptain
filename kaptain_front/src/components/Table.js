import React from 'react';

const SortMark = (props) => {
    if(props.columnAccessor != props.sortAccessor)
        return ""
    switch(props.sortMode) {
        case 1:
          return "🔽"
        case -1:
          return "🔼"
        default:
          return ""
      }
}

const TableView = (props) => (
    <table>
        <thead>
            <tr>
                <th>
                    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                </th>
                {props.headers.map(column => (
                    <th>
                        <span id={column.accessor} onClick={props.OnSorterClick}>
                            {column.name}
                            <SortMark columnAccessor={column.accessor} sortAccessor={props.sortAccessor} sortMode={props.sortMode} />
                        </span>
                    </th>          
                ))}
            </tr>
            <tr>
                <th></th>
                {props.headers.map(column => (
                    <th>
                        <input
                            className="Filter-input"
                            name={column.accessor}
                            value={column.filterValue || ""}
                            onChange={props.OnFilterChange}
                            placeholder={"Search records..."}
                        />
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {props.rows.map((row, i) => (
                <tr key={row.uid}>
                    <td>
                        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" checked={true}/>
                    </td>
                    {row.columns.map((cell, i) => (
                        <td key={row.uid+i}>
                            {cell}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)

const map_columns = (columns, filters) => (
    columns.map((column) => ({
        name: column.Header,
        accessor: column.accessor,
        sortMode: 1,
        filterValue: filters[column.accessor],
    }))
)

const filter_func = (rowValue, filterValue) => (
    String(rowValue || "")
    .toLowerCase()
    .includes(
        String(filterValue || "")
        .toLowerCase()
    )
)

const map_rows = (data, columns, filters, sortAccessor, sortMode) => (
    data.filter(dataRow => (
        columns.reduce((fstate, column) => (
            fstate && filter_func(dataRow[column.accessor], filters[column.accessor])
        ), true)
    )).sort((a, b)=>{
        switch(sortMode){
        case 1:
            return a[sortAccessor] > b[sortAccessor] ? 1 : -1 
        case -1:
            return a[sortAccessor] < b[sortAccessor] ? 1 : -1                
        default:
            return -1
        }
    }).map(dataRow=>({
        uid: dataRow.UID,
        columns: columns.map(column=>(
            dataRow[column.accessor]
        )),
    }))
)

class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filters: {},
            sortAccessor: "Name",
            sortMode: 1,
        }
        this.handleSorterClick = this.handleSorterClick.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
    }

    handleSorterClick(event) {
        const targetAccessor = event.target.id
        let newMode = this.state.sortMode
        if(targetAccessor === this.state.sortAccessor) {
            newMode = -newMode
        } else {
            newMode = 1
        }
        this.setState({
            sortAccessor: targetAccessor,
            sortMode: newMode,
        });
    }

    handleFilterChange(event) {
        this.setState({
            filters: {
                ...this.state.filters,
                [event.target.name]: event.target.value,
            },
        });
    }

    render() {
        return <TableView
            OnFilterChange={this.handleFilterChange}
            OnSorterClick={this.handleSorterClick}
            headers={map_columns(this.props.columns, this.state.filters)}
            rows={map_rows(this.props.data, this.props.columns, this.state.filters, this.state.sortAccessor, this.state.sortMode)}
            sortAccessor={this.state.sortAccessor}
            sortMode={this.state.sortMode}
        />
    }

}


export default Table;