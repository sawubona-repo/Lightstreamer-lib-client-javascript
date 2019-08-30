import Inheritance from "../../src-tool/Inheritance";
import Tutor from "./Tutor";
import Utils from "../Utils";
  
  var notifySenderName;
  for(var i in  {notifySender:true}) {
    notifySenderName=i;
  }
  
  
  var SendMessageBridge = function(owner,connOptions,_phase,_seqData,_num,_sequence,_ack) {
    
    this._callSuperConstructor(SendMessageBridge,[connOptions]);
    
    this.seqData = _seqData;
    this.num = _num;
    this.sequence = _sequence;
    this.phase = _phase;
    //this.attempts = 0;
    this._owner = owner;
    this.waitingAck = _ack;
  };
  
  SendMessageBridge.prototype = {
      
    /*public*/ notifySender: function(failed) {
      this._callSuperMethod(SendMessageBridge,notifySenderName,[failed]);
      
      if (!failed) {
        this._owner.sentOnNetwork(this.sequence,this.num);
        
        if (!this.waitingAck) {
          this._owner.noAckMessageSent(this.sequence,this.num);
          return;
        }
      }
      
      
      /*this.attempts++;
      if (this.attempts >= 5) {
        
      }*/
    },
      
    verifySuccess: function() {
      //if push_pase is changed we've already received a loop so that our request is successful
      if (this._owner.checkMessagePhase(this.phase)) {
        //phase is correct
        if (this.seqData.messages[this.num]) { //the message is still in the queue
          if (this.seqData.messages[this.num].query != null) { //the message has not been acknowledged yet
            return false;
          }
        }
      }
      return true;
    },
    
    doRecovery: function() {
      //let's try again
      this._owner.resend(this.num,this);
    },
    
    notifyAborted: function() {
      //nothing to do
    },
    
    getProg: function() {
      return this.num;
    },
    
    getOwner: function() {
      return this._owner;
    }
    
  };
  
  Inheritance(SendMessageBridge,Tutor);
  export default SendMessageBridge;

