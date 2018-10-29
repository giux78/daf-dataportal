import React from 'react';
import { toastr } from 'react-redux-toastr'

class BtnControlWidget extends React.Component {
    constructor() {
        super();
        this.state = {
            isModalAddOpen: false,
            isModalOpen: false
        }
    }

    moveDown = function(index) {
        let rows = this.props.layout.rows;
        let from = index;
        let to = index + 1;
        let prevWid = this.props.layout.rows[from-1]?this.props.layout.rows[from-1].columns[0].widgets[0].key:''
        let currWid = this.props.layout.rows[from].columns[0].widgets[0].key
        let nextWid = this.props.layout.rows[to]?this.props.layout.rows[to].columns[0].widgets[0].key:''
        let doubleNextWid = this.props.layout.rows[to+1] ? this.props.layout.rows[to+1].columns[0].widgets[0].key:''


        if(currWid.indexOf('TextWidget')!==-1 && (doubleNextWid.indexOf('TextWidget')!==-1)){
          toastr.info('Attenzione', 'Hai già inserito un testo sotto questo elemento, modificalo per aggiungere paragrafi')
        }
        else if(prevWid.indexOf('TextWidget')!==-1 && (nextWid.indexOf('TextWidget')!==-1)){
          toastr.info('Attenzione', 'Spostando sotto questo widget avrai due testi consecutivi, modifica il testo al posto di muovere il widget')
        }
        else{
          rows.splice(to, 0, rows.splice(from, 1)[0])
          this.props.setLayout(this.props.layout)
        }
    }

    moveUp = function(index) {
        let rows = this.props.layout.rows;
        let from = index;
        let to = index - 1;
        let prevWid = this.props.layout.rows[from+1]?this.props.layout.rows[from+1].columns[0].widgets[0].key:''
        let currWid = this.props.layout.rows[from].columns[0].widgets[0].key
        let nextWid = this.props.layout.rows[to] ? this.props.layout.rows[to].columns[0].widgets[0].key:''
        let doubleNextWid = this.props.layout.rows[to-1] ? this.props.layout.rows[to-1].columns[0].widgets[0].key:''
        
        if(currWid.indexOf('TextWidget')!==-1 && (doubleNextWid.indexOf('TextWidget')!==-1)){
          toastr.info('Attenzione', 'Hai già inserito un testo sopra questo elemento, modificalo per aggiungere paragrafi')
        }
        else if(prevWid.indexOf('TextWidget')!==-1 && (nextWid.indexOf('TextWidget')!==-1)){
          toastr.info('Attenzione', 'Spostando sopra questo widget avrai due testi consecutivi, modifica il testo al posto di muovere il widget')
        }
        else{
          rows.splice(to, 0, rows.splice(from, 1)[0])
          this.props.setLayout(this.props.layout)
        }
    }

    removeCol = function () {
        console.log(this.props.layout)
        let rows = this.props.layout.rows;
        let row = rows[this.props.index]
        let columns = row.columns;
        for(let i=0; i < columns.length; i++) {
            let column = columns[i];
            if(column.widgets){
                for(let j=0; j < column.widgets.length; j++) {
                    let widget = column.widgets[j];
                    if(widget.key !='BtnControlWidget_0'){
                        let widgetsArr = this.props.dashboardWidgets;
                        if(widgetsArr[widget.key]){
                            delete widgetsArr[widget.key];
                        }
                    }
                }
            }
        }
        rows.splice(this.props.index, 1);
        this.props.setLayout(this.props.layout);
    }


    render() {
        return (
            <div className="btn-control-widget">
                {/* <button type="button" className="btn btn-sm btn-gray-200" aria-label="Add Widget"
                    onClick={this.addWidgetOpenModal}>
                    <span className="fa fa-plus" aria-hidden="true"></span>
                </button> */}

                {this.props.index != 0 &&
                    <button type="button" className="btn btn-sm btn-gray-200" aria-label="Move Up"
                        onClick={() => this.moveUp(this.props.index)}>
                        <span className="fa fa-chevron-up" aria-hidden="true"></span>
                    </button>
                }
                { this.props.index != this.props.layout.rows.length - 1 &&
                    <button type="button" className="btn btn-sm btn-gray-200" aria-label="Move Down"
                        onClick={() => this.moveDown(this.props.index)}>
                        <span className="fa fa-chevron-down" aria-hidden="true"></span>
                    </button>
                }
                <button type="button" className="btn btn-sm btn-gray-200" aria-label="Remove"
                    onClick={() => this.removeCol()}>
                    <span className="fa fa-trash" aria-hidden="true"></span>
                </button>

            </div>
        );
  }
}

export default BtnControlWidget;