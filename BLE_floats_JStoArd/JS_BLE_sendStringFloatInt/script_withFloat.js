
//https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-output-from-p5-js/
// this code pairs with -- ARD_p5serTOard_4_wOLED

var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem1432401'; // fill in your serial port name here
var inData;                            // for incoming serial data
var outByte = 0, oldByte=-5;                       // for outgoing data
var theCanvas;


let input,button,greeting,myContent;
let checkbox, checkbox2,cb1,cb2;

//message data
let radio, sendType, contentToSend;
let messageReadyToSend;


function setup() {

  theCanvas = createCanvas(512, 50);          // make the canvas
  theCanvas.parent("p5Canvas"); // https://stackoverflow.com/questions/35660240/how-to-put-p5-js-canvas-in-a-html-div/36540479
  // https://github.com/processing/p5.js/wiki/Positioning-your-canvas
  theCanvas.position(10,400);

  //serial = new p5.SerialPort();    // make a new instance of the serialport library
  //serial.on('data', serialEvent);  // callback for when new data arrives
  //serial.on('error', serialError); // callback for errors
  //serial.open(portName);           // open a serial port

  input = createInput();
  input.position(20, 120);

  button = createButton('submit');
  button.position(input.x + input.width, 120);
  button.mousePressed(getInput);

  greeting = createElement('h2', 'float or string ?');
  greeting.position(20, 10);

  myContent = createElement('p', 'Output ... ');
  myContent.position(20,175);

  setupRadio();
}

function setupRadio(){
   radio = createRadio();
   radio.option(1,'Send as String');
   radio.option(2,'Send as Float');
   radio.style('width', '130px');
   radio.selected('1'); // this took a while to hook but its ok now.
   radio.position(20,65);

}

function getInput() {
  messageToSend = input.value();
  sendType = radio.value();

    //console.log("sendtype ",sendType);
    //console.log("sendval ",radio.selected().value);

  let type = "string";
  if (sendType == 2) type = "float";

  myContent.html('Message content -->' + messageToSend +'<br\>Send type --> ' + type);
  input.value(''); // clear input box

  BLESendMessage(trajectoryBLEAngle, messageToSend,type); // generalize this later

  // test sending a variable, the characteristic will direct parsing
  let myfloat = -1.234
  BLESendMessage(trajectoryBLEAngle, myfloat, typeof(myfloat));
}

function BLESendMessage(characteristic, message, type){ // need 3 parameter type if float is ever active
  // if the message is a string and type is a string (1)  then simple send with BLE as string

  // else if the message type is float -- then get array of 4 ints and make that a message? this works in serial -- it does not work in BLE -- BLE has to be string b/c bottleneck -- or 4 characteristics... thats hell .

  // if you are sending a float then you can't use BLE
  // at this time these is no else for BLE -- the library has to change OR ??
  messageReadyToSend = 0;

  switch (type){

    case 'string': // string
      console.log("BLE sendMessage Type = ", typeof(message));
      if ( typeof(message) == 'string' ) {messageReadyToSend = 1;}
        else {console.log("MESSAGE TYPE (STRING) MISMATCH");}
    break;

    case 'float': // float -- just don't
      console.log("BLE sendMessage Type = float");
      console.log("you need to let this go steve");
      //pack array --
      let packedMessage = BLEPackFloat(message);
      console.log("message ", message, " packed message ", packedMessage);
      //printWithType(packedMessage);

      // just send the float now if they would let you. 

    break;

    case 'number':
      let tempF="";
      tempF+=message;
      message=tempF;
      messageReadyToSend = 1;
    break;

    default: // not type specificed
      console.log("message TYPE unknown");
    break;
  }

  //  **********      if (messageReadyToSend == 1)  myBLE.write(characteristic, message); // was trajectoryBLEAngle, tempAngle
}

function BLEPackFloat(theFloat){
  // SIDE NOTE ::: see /Users/steve.daniels/Documents/github/BLE_examples/receiveFloats for solving this

  // in the end this does not work -- becasue JS is unicode 16 -- not ascii -- so back to a string so just send the string.
  // could put the parsing info for float here -- or at least call it ... it took days
  // take float value and convert to 4 char array -- turn into string
  // arduino characteristic must be String or generic
  let theArrayBuffer = new ArrayBuffer(4);  // 4 byte buffer == 1 float
  let F32v_arrayBuffer = new Float32Array(theArrayBuffer);
  let Uint8v_arrayBuffer = new Uint8Array(theArrayBuffer);
  //let bytes = new Array(4);

  F32v_arrayBuffer[0] = theFloat;
  let tempString="";
  // commas separated string with little endian encoding
  // let  tempString = Uint8v_arrayBuffer.toString();
      // console.log("short cut ",tempString);
      // printWithType(tempString);

  for (let i = 0; i < Uint8v_arrayBuffer.length; i++) {
    // https://gregstoll.com/~gregstoll/floattohex/
    // flip byte order if needed with 3-i for index of Uint8v_arrayBuffer
      //bytes[i]= Uint8v_arrayBuffer[3-i]; // i am sure this is BE
      //console.log(Uint8v_arrayBuffer[3-i].toString(16),Uint8v_arrayBuffer[3-i].toString(10));
      tempString += Uint8v_arrayBuffer[3-i]; // maybe ? just 4 bytes in a row
  }
  return tempString;

} // end fxn

function printWithType(val){
  console.log('val&type ',val,'\t',typeof(val));
}



function serialEvent() {
  // read a byte from the serial port:
  var inByte = serial.read();
  // store it in a global variable:
  inData = inByte;
}

function serialError(err) {
  //println('Something went wrong with the serial port. ' + err);
}


function draw() {
;

}



// function keyPressed() {
//   if (key >= 0 && key <= 9) { // if the user presses 0 through 9
//     outByte = byte(key * 25); // map the key to a range from 0 to 225
//   }
//
//   if( key === 'h'|| key === 'H') outByte = 'H';
//   if( key === 'l'|| key === 'L') outByte = 'L';
//
//   serial.write(outByte); // send it out the serial port
// }
