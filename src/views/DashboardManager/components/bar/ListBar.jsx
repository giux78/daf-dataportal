import React from 'react';
import { connect } from 'react-redux'

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

// SERVICES
import DashboardService from '../services/DashboardService';

const dashboardService = new DashboardService();


class ListBar extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;

      this.state = {
        isOpen: props.isOpen?props.isOpen:false,
        validationMSg: 'Campo obbligatorio',
        validationMSgOrg: 'Campo obbligatorio',
        pvt: '0'
      }
  }

  onPvtChange(e, value){
    this.setState({
        pvt: value
    });
    this.validate(e);
  }

  onOrganizationChange(e, value){
    this.setState({
      org: value
    });
    this.validate(e);
  }

  openModal = () => {
    this.setState({
      isOpen: true
    });
  };
  
  hideModal = () => {
    this.setState({
      isOpen: false
    });
  };

  /**
  * Save Title
  */
  /* handleSave = (e) => {
    e.preventDefault()
    if(this.title.value){
      if(this.pvt.value == 1 && (!this.org || this.org.value == '')){
        this.setState({
          validationMSgOrg: 'Campo obbligatorio'
        });
      }else{
        //save data
        let request = {
          title: this.title.value,
          pvt: this.state.pvt,
          org: this.state.org
        };
        dashboardService.save(request).then((data)=> {
            this.props.history.push('/dashboard/list/'+ data.message + '/edit');
      });
    }
  }else{
    this.setState({
        validationMSg: 'Campo obbligatorio'
      });
    }
  } */

  validate = (e) => {
    e.preventDefault()
    if(!this.title.value){
      this.setState({
        validationMSg: 'Campo obbligatorio'
      });
    }else{
      this.setState({
        validationMSg: null
      });
    }

    if(!this.org || this.org.value == ''){
      this.setState({
        validationMSgOrg: 'Campo obbligatorio'
      });
    }else{
      this.setState({
        validationMSgOrg: null
      });
    }
  }
  
  /**
  * Save Dashboard
  */
  handleSave = (e) => {
    e.preventDefault()

    if(this.title.value){
      if(!this.org || this.org.value == ''){
        this.setState({
          validationMSgOrg: 'Campo obbligatorio'
        });
      }else{
        //prepara data
        let layout = { rows: [] };
        let widgets = {};
        let request = {
          title : this.title.value,
          pvt: this.state.pvt,
          org: this.state.org,
          subtitle : this.subtitle.value,
          layout : JSON.stringify(layout),
          widgets : JSON.stringify(widgets),
          status: 0
        };
        
        this.props.history.push({
          pathname: '/private/dashboard/create',
          state: { 'dash': request, 'modified':true }})

/*         //save data
        dashboardService.save(request).then((data)=> {
            this.props.history.push('/dashboard/list/'+ data.message + '/edit');
        }) */
      }
    } else {
      this.setState({
        validationMSg: 'Campo obbligatorio'
      });
    }
  }


  render = function(){
    const { loggedUser } = this.props

    return (
      <div>
        
        <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal}>
          <form onSubmit={this.save}>
            <ModalHeader>
              <ModalTitle>Crea una Dashboard</ModalTitle>
              <ModalClose onClick={this.hideModal}/>
            </ModalHeader>
            <ModalBody>
            <div className="form-group">
                <div className="form-group row">
                  <label className="col-md-2 form-control-label">Titolo</label>
                  <div className="col-md-8">
                    <input type="text" className="form-control" ref={(title) => this.title = title} onChange={this.validate.bind(this)} id="title" placeholder="Titolo"/>
                    {this.state.validationMSg && <span>{this.state.validationMSg}</span>}
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 form-control-label">Sottotitolo</label>
                  <div className="col-md-8">
                    <input type="text" className="form-control" ref={(subtitle) => this.subtitle = subtitle} id="subtitle" placeholder="Sottotitolo"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 form-control-label">Privata</label>
                  <div className="col-md-8">
                  {loggedUser.organizations && loggedUser.organizations.length > 0 ?
                    <select className="form-control" ref={(pvt) => this.pvt = pvt} onChange={(e) => this.onPvtChange(e, e.target.value)} id="pvt" >
                      <option value="0" defaultValue key="0">No</option>
                      <option value="1" key='1'>Si</option>
                    </select>
                    :
                    <div>
                      <select className="form-control" ref={(pvt) => this.pvt = pvt} onChange={(e) => this.onPvtChange(e, e.target.value)} id="pvt" >
                        <option value="0" defaultValue key="0">No</option>
                      </select>
                      <span>Puoi creare soltanto dashboards pubbliche in quanto non hai nessuna organizzazione associata</span>
                    </div>
                  }
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 form-control-label">Organizzazione</label>
                  <div className="col-md-8">
                    <select className="form-control" ref={(org) => this.org = org} onChange={(e) => this.onOrganizationChange(e, e.target.value)} id="org" >
                        <option value=""  key='organization' defaultValue></option>
                        {loggedUser.organizations && loggedUser.organizations.length > 0 && loggedUser.organizations.map(organization => {
                            return (<option value={organization} key={organization}>{organization}</option>)
                        })
                        }
                    </select>
                    {this.state.validationMSgOrg && <span>{this.state.validationMSgOrg}</span>}
                  </div>
                </div>
            </div>
            </ModalBody>
            <ModalFooter>
              <button className='btn btn-gray-200' onClick={this.hideModal}>
                Chiudi
              </button>
              <button type="button" className="btn btn-primary px-2" onClick={this.handleSave.bind(this)}>
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                  Crea
              </button>
            </ModalFooter>
          </form>
        </Modal>


        <div className="container" ref="auto">
          <div className="row">
            <div className="col-10">
              <div className="input-prepend input-group mb-20">
                <div className="input-group-text transparent-frame">
                  <i className="fas fa-search"></i>
                </div>
                  <input id="prependedInput" className="form-control transparent-frame" size="25" type="text" onChange={this.props.onChange} placeholder="Filtra la lista ..."/>
              </div>
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-link float-right" title="Aggiungi Dashboard" onClick={this.openModal}>
                <i className="fa fa-plus-circle fa-lg m-t-2"></i>
              </button>
            </div>
          </div> 
        </div>


      </div>

    );
  }
};

function mapStateToProps(state) {
    const loggedUser = state.userReducer['obj']?state.userReducer['obj'].loggedUser:{ }   
    return { loggedUser }
}

export default connect(mapStateToProps)(ListBar)
