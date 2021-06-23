import { action, makeObservable, observable } from 'mobx';

class ObservableMsgStore {
  rxData = [];
  rxBuffSize;

  constructor(maxBuffSize) {
    makeObservable(this, {
      rxData: observable,
      addRscvMsg: action,
      clear: action,
    });

    this.rxBuffSize = maxBuffSize ? maxBuffSize : 512; // Default size
  }

  // Returns current buffer size
  get getBuffLen() {
    return this.rxData.length;
  }

  // Returns latest message
  get getLastMsg() {
    return this.rxData[this.rxData.length - 1];
  }

  // Returns all data
  get getAllMsg() {
    return this.rxData;
  }

  // Auxiliary method to fetch list of messages
  getMsgList = (start, end) => {
    // Check for invalid index
    if (end >= this.rxData.length || start < 0) {
      throw Error('Invalid indices for message array to return.');
    } else return this.rxData.slice(start, end);
  };

  // Appends new message to the RX message buffer
  addRscvMsg = (message) => {
    if (this.rxData.length > this.rxBuffSize) {
      this.rxData.shift();
    }
    this.rxData.push(message);
    //console.log(message);
  };

  // Clears message buffer
  clear = () => {
    this.rxData = [];
    console.log('Clearing message buffer...');
  };
}

export default ObservableMsgStore;
