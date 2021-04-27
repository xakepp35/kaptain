import React from 'react';

const SortMark = (props) => {
    switch(props.mode) {
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
                {props.headers.map(column => (
                    <th>
                        {column.name}
                        <span>
                            <SortMark mode={column.sortMode} />
                        </span>
                    </th>          
                ))}
            </tr>
            <tr>
                {props.headers.map(column => (
                    <th>
                        <input
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
                <tr>
                    {row.map(cell => (
                        <td>
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

const map_rows = (data, columns, filters) => (
    data.filter(dataRow => (
        columns.reduce((fstate, column) => (
            fstate && filter_func(dataRow[column.accessor], filters[column.accessor])
        ), true)
    )).map(dataRow=>(
        columns.map(column=>(
            dataRow[column.accessor]
        ))
    ))
)

class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            filters:{},
        }
        this.handleFilterChange = this.handleFilterChange.bind(this)
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
            headers={map_columns(this.props.columns, this.state.filters)}
            rows={map_rows(this.props.data, this.props.columns, this.state.filters)}
        />
    }

}


export default Table;