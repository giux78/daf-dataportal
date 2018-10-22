import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container } from 'reactstrap'
import { getAllOrganizations, search, datasetDetail, launchQueryOnStorage } from '../../actions'
import ReactTable from "react-table"
import Select from 'react-select'

class CreateWidget extends Component {
  constructor(props){
    super(props)

    this.state = {
      selected: [],
      selectedField: '',
      groupedBy: '',
      query: {
        "select": [],
        // "where": [],
        "groupBy": [],
        // "having": [],
        /* "limit": 25 */
      },
      isQuery: false,
      privateWdg: '',
      selectedDataset: '',
      selectedOrg: '',
      organizations: [],
      queryResult: [], 
      fields: []
    }
    this.onChangeOrg = this.onChangeOrg.bind(this)
    this.getDatasetDetail = this.getDatasetDetail.bind(this)
    this.select = this.select.bind(this)
    this.launchQuery = this.launchQuery.bind(this)
    this.renderTable = this.renderTable.bind(this)
    this.onChangeGroupBy = this.onChangeGroupBy.bind(this)
    this.renderSelectFields = this.renderSelectFields.bind(this)
  }

  componentDidMount(){
    const { dispatch } = this.props
    dispatch(getAllOrganizations())
    .then(json => {
      this.setState({
        organizations: json.elem
      })
    })
  }

  onChangeOrg(org){
    const { dispatch } = this.props
    const { privateWdg } = this.state

    this.setState({
      selectedOrg: org
    })

    var status = []
    if(privateWdg==='1')
      status = ['0','1']
    else
      status = ['2']

    let filter = {
      'text': "",
      'index': ['catalog_test'],
      'org': [org],
      'theme':[],
      'date': "",
      'status': status,
      'order': "desc"
    }

    dispatch(search('', filter, false, filter))

  }

  getDatasetDetail(){
    const { dispatch } = this.props

    var fields = []

    this.setState({
      isQuery: true
    })
    const { selectedDataset } = this.state
    dispatch(datasetDetail(selectedDataset, '', false))
  }

  select(field){
    const { selected, query } = this.state
    
    var fields = selected

    if(fields.indexOf(field)>-1){
      fields.splice(fields.indexOf(field), 1)
      query.select.splice(query.select.indexOf({'name': field.value}), 1)
    }else{
      fields.push(field)
      query.select.push({'name': field.value})
    }

    this.setState({
      selectedField: field,
      selected: fields
    })
  }

  launchQuery(){
    const { dispatch, dataset } = this.props
    const { query } = this.state
    dispatch(launchQueryOnStorage(dataset.operational.logical_uri, query))
    .then(response => {
      if(response.ok){
        const result = response.json()
        result.then(json => { 
          this.setState({
            queryResult: json
          })
        })
      }
    })
  }

  onChangeGroupBy(value){
    console.log(value)

    this.setState({
      groupedBy: value
    })

    this.state.query.groupBy = [{"name":value}]
  }

  renderTable(){
    const { queryResult } = this.state
    const { dataset } = this.props

    if(queryResult.length>0){
      var columns=[{
        Header: dataset.dcatapit.name,
        columns: []
      }]
      Object.keys(queryResult[0]).map(elem=>{
        columns[0].columns.push({
          Header: elem,
          accessor: elem
        })
      })

      return <ReactTable 
              data={queryResult}
              columns={columns}
              defaultPageSize={25}
              className="-striped -highlight"
              />
    }
  }

  renderSelectFields(){
    const { dataset } = this.props
    
    var fields = []

    if(dataset){
      dataset.dataschema.flatSchema.map(field => {
        fields.push({"value": field.name, "label": field.name})
      }) 
    } 

    return <Select
      value={this.state.selectedField}
      onChange={this.select}
      options={fields}
      isMulti={true}
    />
  }

  render(){
    const { loggedUser, results, dataset, isFetching } = this.props
    const { privateWdg, organizations, isQuery, selected } = this.state
    return(
      <Container className="py-3">
        <div className="card">
          <div className="card-body">
            <div className="card-title mb-3">
              <h3>Seleziona il Dataset da cui partire</h3>
            </div>
            <div className="form-group row">
              <label className="col-md-4 form-control-label">Privato</label>
              {loggedUser.organizations && loggedUser.organizations.length > 0 ?
                <div className="col-md-8">
                  <select className="form-control" value={this.state.privateWdg} onChange={(e)=>this.setState({privateWdg: e.target.value})}>
                    <option value={''}></option>
                    <option value={'1'}>Sì</option>
                    <option value={'0'}>No</option>
                  </select>
                </div>
                :
                <div className="col-md-8">
                  <input className="form-control" disabled={true} defaultValue={"No"}/>
                  <span>Puoi creare soltanto widget pubbliche in quanto non hai nessuna organizzazione associata</span>
                </div>
              }
            </div>
            <div className="form-group row">
              <label className="col-md-4 form-control-label">Organizzazione</label>
              <div className="col-md-8">
                <select className="form-control" value={this.state.selectedOrg} onChange={(e)=>{this.onChangeOrg(e.target.value)}} disabled={privateWdg===''}>
                  <option value={''}></option>                  
                  {privateWdg==='1' && loggedUser.organizations && loggedUser.organizations.length > 0 && loggedUser.organizations.map(organization => {
                    return (<option value={organization} key={organization}>{organization}</option>)
                  })
                  }
                  {privateWdg==='0' && organizations && organizations.length > 0 && organizations.map(organization => {
                    return (<option value={organization} key={organization}>{organization}</option>)
                  })
                  }
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-4 form-control-label">Nome Dataset</label>
              <div className="col-md-8">
                <select className="form-control" disabled={this.state.selectedOrg===''} onChange={(e)=>{this.setState({selectedDataset: e.target.value})}}>
                  <option value=""  key='widgetDataset' defaultValue></option>
                  {results && results.length>4 && results.map(result => {
                    if(result.type=='catalog_test'){
                      var source = JSON.parse(result.source)
                      return (<option value={source.dcatapit.name} key={source.dcatapit.name}>{source.dcatapit.name}</option>)
                    }else if(result.type=='ext_opendata'){
                      var source = JSON.parse(result.source)
                      return (<option value={source.name} key={source.name}>{source.name}</option>)
                    }
                  })
                  }
                </select>
              </div>
            </div>
            <button className="btn btn-primary float-right" onClick={this.getDatasetDetail} title="Passa al query builder">Avanti</button>
          </div>
        </div>
        {isQuery && <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h3>Costruisci la query per i tuoi dati</h3>
              {isFetching && <h1 className="text-center p-5"><i className="fas fa-circle-notch fa-spin mr-2" />Caricamento</h1>}
              {!isFetching && 
              <div className="row">
                <div className="col-md-4">
                  {this.renderSelectFields()}
                  <select className="form-control" value={this.state.groupedBy} onChange={(e)=>{this.onChangeGroupBy(e.target.value)}}>
                    {this.state.selected.map((select, index)=>{
                      return(<option key={index} value={select.value}>{select.value}</option>)
                    })}
                  </select>
                </div>
                <div className="col-md-8">
                  {this.renderTable()}
                </div>
              </div>
              }
              <button className="btn btn-primary float-right" title="Lancia la Query" onClick={this.launchQuery}>Lancia Query</button>
            </div>
          </div>
        </div>
        }
      </Container>
    )
  }
}

function mapStateToProps(state) {
  const { isFetching, dataset } = state.datasetReducer['obj'] || { isFetching: true }
  const loggedUser = state.userReducer['obj']?state.userReducer['obj'].loggedUser:{ }
  const { results } = state.searchReducer['search'] || { isFetching: false, results: [] }
  return { isFetching, dataset, loggedUser, results }
}

export default connect(mapStateToProps)(CreateWidget)