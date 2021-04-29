import React from 'react';

import SortMarkView from './SortMarkView'

const SortMark = (props) => (
    props.columnAccessor != props.sortAccessor
    ? ""
    : (<SortMarkView sortMode={props.sortMode}/>)
)

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
                        <input type="checkbox" name={row.uid} onClick={props.onSelect} checked={props.selected[row.uid]?true:false}/>
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

export default TableView