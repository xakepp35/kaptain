
import React from 'react';
import { connect } from "react-redux";

import axios from 'axios'

import PodsTableView from './PodsTableView'


const mockData = [{
	uid: "12345678",
	namespace: "default",
	name: "some_pod_name",
	status: "Running",
	startTime: "16:20",
	nodeName: "master.node.com",
}]

class PodsTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: {}
		}
		this.handleRowSelect = this.handleRowSelect.bind(this)
		this.handlePodDelete = this.handlePodDelete.bind(this)
		this.handlePodEvict = this.handlePodEvict.bind(this)
	}

	handleRowSelect(e) {
		const uid = e.target.name
		let newSelected = {...this.state.selected}
		if(newSelected[uid] ){
			delete newSelected[uid]
		} else {
			newSelected[uid]=true
		}
		this.setState({
			selected: newSelected,
		})
	}

	async handlePodDelete() {
		for(let i in this.state.selected) {
			const pod = this.props.podsData[i]
			console.log("Deleting pod " +pod.name+ "["+i+"]")
			const res = axios.get("/api/k8s/pods/delete?namespace="+pod.namespace+"&name="+pod.name)
		}
		this.setState({
			selected: {},
		})
	}

	async handlePodEvict() {
		for(let i in this.state.selected) {
			const pod = this.props.podsData[i]
			console.log("Evicting pod " +pod.name+ "["+i+"]")
			const res = axios.get("/api/k8s/pods/evict?namespace="+pod.namespace+"&name="+pod.name)
		}
		this.setState({
			selected: {},
		})
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
		return <PodsTableView
			OnChange={this.handleChange}
			podsData={podsData}
			selected={this.state.selected}
			onSelect={this.handleRowSelect}
			onClickDelete={this.handlePodDelete}
			onClickEvict={this.handlePodEvict}
		/>
	}

}

const mapStateToProps = (state) => ({
	podsData: state.podsData,
})

export default connect(mapStateToProps)(PodsTable)