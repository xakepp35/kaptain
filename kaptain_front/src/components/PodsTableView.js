import React from 'react';
import Table from './Table'
import { Container, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import styled from 'styled-components'

const Styles = styled.div`
	display: block;
	max-width: 100%;
`

const ButtonBar = styled.div`
	display: flex;
	flex-direction: row;
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

const totalPods = (podsData) => podsData.length
const upPods = (podsData) => podsData.reduce((acc,cur)=>cur.Status==="Running"?acc+1:acc, 0)
const downPods = (podsData) => podsData.reduce((acc,cur)=>cur.Status!=="Running"?acc+1:acc, 0)

const PodsTableView = (props) => (
	<div className="App">
		<ButtonBar>
			<span>Total: {totalPods(props.podsData)} pods ({upPods(props.podsData)} up, {downPods(props.podsData)} down)</span>
			<input type="button" name="btnDelete" value="Delete" onClick={props.OnClickDelete} />
			<input type="button" name="btnEvict" value="Evict" onClick={props.OnClickEvict} />
		</ButtonBar>
		<Styles>
			<Table columns={columns} data={props.podsData} />
		</Styles>
	</div>
)

export default PodsTableView