
import React from 'react';
import { connect } from "react-redux";

import neffos from 'neffos.js'
import axios from 'axios'

import PodsTableView from './PodsTableView'



const mapPodsData = (podsData) => Object.values(podsData).map(
	(item) => ({
		UID: item.metadata.uid,
		Namespace: item.metadata.namespace,
		Name: item.metadata.name,
		Status: item.status.phase,
		StartTime: item.status.startTime,
		NodeName: item.spec.nodeName,
	})
)

const mockData = [{
	Namespace: "default",
	Name: "some_pod_name",
	Status: "Running",
	StartTime: "16:20",
	NodeName: "master.node.com",
}]

class PodsTable extends React.Component {

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		// const res = await axios.get("/api/k8s/pods/list")
		// console.dir(res)
		// this.setState({
		//   PodsData:res.data
		// })
	}

	render() {
		const podsData = Object.values(this.props.podsData)
		return <PodsTableView OnChange={this.handleChange} podsData={podsData}/>
	}

}

const mapStateToProps = (state) => ({
	podsData: state.podsData,
})

export default connect(mapStateToProps)(PodsTable)