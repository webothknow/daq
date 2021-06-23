//import React from 'react';
import PropTypes from 'prop-types';
import { action, makeObservable, observable } from 'mobx';
import ObservableMsgStore from './ObservableMsgStore';

class WebSocketClient {
  // Server-side JSON data & connection status
  status = 'NOT_CONNECTED';
  ws = null;
  store = null;

  constructor(address, port, uri, rxsize) {
    address
      ? (this.host = address)
      : (this.host = 'ws://' + new URL(window.location.href).hostname);
    this.port = port;
    this.uri = uri;
    this.rxSize = rxsize;

    this.store = new ObservableMsgStore(this.rxSize);

    makeObservable(this, {
      status: observable,
      setConnStatus: action,
    });
  }

  // Helper function to create valid URL
  // by filtering out undefined values
  getURL = () => {
    let url;

    // Fallback to port & URI specification
    if (this.port && this.uri) {
      url = [this.host, ':' + this.port, this.uri];
    }

    // Default behavior
    else if (this.host) {
      url = [this.host];
    }

    var url_ftrd = url.filter(Boolean).join('');
    return url_ftrd;
  };

  // Action for setting connection status
  setConnStatus = (status) => {
    switch (status) {
      case 'CONNECTED':
        this.status = 'CONNECTED';
        break;

      case 'NOT_CONNECTED':
        this.status = 'NOT_CONNECTED';
        break;

      case 'ERROR':
        this.status = 'ERROR';

      default:
      //throw Error('Unrecognized socket connection status error.');
    }
  };

  // Auxiliary connection setter in case of
  // changing connection settings as per user input
  setConnection(address, port, uri) {
    this.host = address;
    this.port = port;
    this.uri = uri;

    console.log('New WebSocket URL accepted:\n' + this.getURL());
  }

  // Closes active WebSocket connection
  closeConn() {
    if (this.status === 'CONNECTED') {
      this.ws = null;
      this.store.clear();
      this.setConnStatus('NOT_CONNECTED');
      console.log('WebSocket connection is closing...');
    } else {
      console.log('No active WebSocket connection found.\nClosing action ignored.');
    }
  }

  // Send payload via WebSocket
  sendMsg(cmd) {
    //if (this.status != null && this.ws.readyState === 1) {
    if (this.status === 'CONNECTED' && this.status != null) {
      this.ws.send(cmd);
      console.log('Data sent: ' + JSON.stringify(cmd));
    } else {
      console.log('No active WebSocket connection found.\nCheck connection status.');
    }
  }

  // Open connection event
  // Subscribes to WebSocket events
  openConn = () => {
    if (!this.ws) {
      // Filter undefined values to compose actual URL
      this.ws = new WebSocket(this.getURL());
      this.ws.onopen = (e) => {
        console.log('WebSocket connection established.');
        this.setConnStatus('CONNECTED');
      };

      this.ws.onmessage = (e) => {
        // If no valid JSON format is found, encapsulate it in curly bracket
        let msg = null;
        //if (e.data.indexOf('{') === -1 && e.data.lastIndexof('}') === -1) {
        if (e.data[0] !== '{' && e.data[e.data.length - 1] !== '}') {
          msg = '{' + e.data + '}';
        } else msg = JSON.parse(e.data);

        this.store.addRscvMsg(msg);
      };

      this.ws.onerror = (e) => {
        console.log('WebSocket error: ' + e + '\nClosing connection...');
        this.setConnStatus('ERROR');
        this.ws = null;
      };

      this.ws.onclose = (e) => {
        console.log('WebSocket connection lost.');
        this.setConnStatus('NOT_CONNECTED');
        this.ws = null;
      };
    } else {
      console.log(
        'Existing WebSocket connection detected.\nPlease close the active connection and try again.',
      );
    }
  };
}

/*
 * @deprecated
 * No longer uses properties
 */
// Default properties
WebSocketClient.defaultProps = {
  addr: 'dev.perigee.kr',
  port: 8700,
  uri: '/ws',
  rxsize: 512,
};

WebSocketClient.propTypes = {
  addr: PropTypes.string,
  port: PropTypes.number,
  uri: PropTypes.string,
  rxsize: PropTypes.number,
};

export default WebSocketClient;
