import React from 'react';
import TableView from './TableView';

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
        uid: dataRow.uid,
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
            selected={this.props.selected}
            onSelect={this.props.onSelect}
        />
    }

}


export default Table;