// handling floats from p5JS to arduino

// if floats are active in BLE library, check script_withFloat.js

/*
  constraints:
    JS -- have type number and string but not float
    JS- unicode 16 -- not ascii

    ARD -- has floats and ascii

    ARD -- use characteristic type to control parsing.
        -- if you are just sending frmo ARD -- then float characteristics are great.

*/

// BLE functions and vars are in traceBLE_variables.js

let input,button,greeting,messageToSend;

function setup() {

  noCanvas();

  myBLE = new p5ble();

  // Create a 'Connect' button
  connectButton = createButton('Connect');
  connectButton.addClass('notConnected');
  console.log("connect button classes: ", connectButton.class()); // find classes ?
  connectButton.position(20, 10);
  connectButton.mousePressed(connectToBle);

  // heading
  greeting = createElement('h2', 'BLE - send floats as strings to Ard');
  greeting.position(20, 50);

  // input box to enter float you want to send
  input = createInput();
  input.position(20, 120);

  // send button
  button = createButton('send over BLE');
  button.position(input.x + input.width, 120);
  button.mousePressed(formatMessage);

  // place holder to echo back the number entered
  myContent = createElement('p', 'Message to send : <em>waiting for input</em>');
  myContent.position(20,160);
}

// keeping the web interface context seperate from the actual send
function formatMessage() {

  messageToSend = input.value();
  // update page with what you are sending
  myContent.html('Message to send : ' + messageToSend );
  input.value(''); // clear input box

  // the following is a prototype line to call a BLESendMessage
  // for this demo using the two characteristcs from service
  let temp = parseInt(messageToSend)%256;  // so small int to arduino needs to never roll over must check this on JS side -- I suggest all numbers go as strings
  
  console.log(temp);
  BLESend(floatAsString, messageToSend); // is a float to angle characteristic
  BLESend(smallInt, temp); // is a float to angle characteristic
  BLESend(largeInt, messageToSend); // is a float to angle characteristic
}

// function BLESendInt(characteristic, message){
//   // only sends lowest 8 bits
//   myBLE.write(characteristic, message);
// }

function BLESend(characteristic, message){
 // if message is a string it gets sent as string
  console.log("IN: BLESend ",message,"\t",typeof(message));
 // if message is a number
 if (typeof(message) == 'number') {
   console.log("\tinput was a number");
    // message is a float or large ( >8bit) int
    if (!Number.isInteger(message) || message >=256){
      console.log("\t\tinput was float or big int");
      // convert to string
      let tempF="";
      tempF+=message;
      message=tempF;
    } else {
      console.log("\t\tsmall int");
    }
}
// messages at this point are either : strings, numbers turned into strings, or small ints
// this allows arduino use of Int characteristic with BLE

  console.log("SENDing ",message," as ", typeof(message) );
  //console.log("myBLE.write -- uncommment when BLE active");
  myBLE.write(characteristic, message); // was trajectoryBLEAngle, tempAngle
}

function printWithType(val){
  console.log('val&type ',val,'\t',typeof(val));
}


function draw(){;}
