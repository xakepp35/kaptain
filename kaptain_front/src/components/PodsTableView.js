import React from 'react';
import Table from './Table'
import { Container, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import styled from 'styled-components'

const Styles = styled.div`
	display: block;
	max-width: 100%;
	overflow-y: auto;
`

const ControlBar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: #101040;
	padding: 1rem;
	border: 2px solid white;
`

const ButtonBar = styled.div`
	display: flex;
	flex-direction: row;
	max-width: 100%;
`

const columns = [
	{
		Header: 'Namespace',
		accessor: 'namespace',
	},
	{
		Header: 'Name',
		accessor: 'name',
	},
	{
		Header: 'Status',
		accessor: 'status',
	},
	{
		Header: 'Start Time',
		accessor: 'startTime', 
	},
	{
		Header: 'Node',
		accessor: 'nodeName', 
	},
]

const totalPods = (podsData) => podsData.length
const upPods = (podsData) => podsData.reduce((acc,cur)=>cur.status==="Running"?acc+1:acc, 0)
const downPods = (podsData) => podsData.reduce((acc,cur)=>cur.status!=="Running"?acc+1:acc, 0)

const PodsTableView = (props) => (
	<div className="App">
		<ControlBar>
			<ButtonBar>			
				<input className="Control-button" type="button" name="btnDelete" value="Delete" onClick={props.onClickDelete} />
				<input className="Control-button" type="button" name="btnEvict" value="Evict" onClick={props.onClickEvict} />
			</ButtonBar>
			<span>Total: {totalPods(props.podsData)} pods ({upPods(props.podsData)} up, {downPods(props.podsData)} down)</span>
		</ControlBar>
		<Styles>
			<Table columns={columns} data={props.podsData} selected={props.selected} onSelect={props.onSelect}/>
		</Styles>
	</div>
)

export default PodsTableView