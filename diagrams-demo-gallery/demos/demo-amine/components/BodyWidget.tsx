import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { TrayRightWidget } from './TrayRightWidget';
import { Application } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';

export interface BodyWidgetProps {
	app: Application;
}

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Footer = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		background: rgb(30, 30, 255);
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;
}

var reply_click = function(event, str)
{
	//print in DOM element
const element: HTMLElement = document.getElementById('printHere') as HTMLElement
    element.innerHTML = str;
}

export class BodyWidget extends React.Component<BodyWidgetProps> {
	render() {
		return (
			<S.Body>
				<S.Header>
					<div className="title">Ancrypt CryptShop demo</div>
				</S.Header>
				<S.Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'genKey-128' }} name="Gen-Key-128" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'genData' }} name="Gen-Data" color="rgb(192,192,0)" />
						<TrayItemWidget model={{ type: 'aes-cbc-128' }} name="AES-CBC-128" color="rgb(0,255,192)" />
						<TrayItemWidget model={{ type: 'cmac' }} name="CMAC" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'outFile' }} name="Out-File" color="rgb(255,192,0)" />
					</TrayWidget>
					<S.Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var node: DefaultNodeModel = null;
						        switch(data.type){
							    case 'cmac': {
								node = new DefaultNodeModel('CMAC', 'rgb(192,255,0)');
								let port1 = node.addInPort('KeyIn');
								let port2 = node.addInPort('DataIn');
								let port3 = node.addOutPort('Signature');
								break;
							    }

							    case 'aes-cbc-128': {
								node = new DefaultNodeModel('AES-CBC-128', 'rgb(0,255,192)');
								let port1 = node.addInPort('KeyIn');
								let port2 = node.addOutPort('DataOut');
								let port3 = node.addInPort('DataIn');
								break;
							    }

							    case 'genKey-128': {
								node = new DefaultNodeModel('Gen-Key-128', 'rgb(0,192,255)');
								let port1 = node.addOutPort('KeyOut');
								break;
							    }

							    case 'genData': {
								node = new DefaultNodeModel('Gen-Data', 'rgb(192,192,0)');
								let port1 = node.addOutPort('DataOut');
								break;
							    }

							    case 'outFile': {
								node = new DefaultNodeModel('Out-File', 'rgb(255,192,0)');
								let port1 = node.addInPort('DataIn');
								break;
							    }
							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app.getDiagramEngine().getModel().addNode(node);
							this.forceUpdate();
						        this.str = JSON.stringify(this.props.app.getDiagramEngine().getModel().serialize());
						        console.log('from ', this.str);
						}}
						onDragOver={(event) => {
							event.preventDefault();
						}}
					>
						<DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget>
					</S.Layer>
					<TrayRightWidget>
			<button id="generateButton" onClick={event => reply_click(event, this.str)}>Generate</button>
			</TrayRightWidget>
				</S.Content>

							<S.Footer>
                                 			<p id="printHere"></p>
							    </S.Footer>
			</S.Body>
		);
	}
}

