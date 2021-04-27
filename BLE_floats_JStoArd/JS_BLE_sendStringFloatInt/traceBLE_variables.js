let myBLE;
let BLE_CONNECTED = 0;


const serviceUUID = "20210100-8cae-11eb-8dcd-0242ac130003" // match arduino ???  must be

// these must match the characteristics UUID from arduino -- variable names can change but UUID can;t
const characteristicsUUID = {
  floatAsStringCharacteristic: "20210120-8cae-11eb-8dcd-0242ac130003",
  smallIntCharacteristic:      "20210121-8cae-11eb-8dcd-0242ac130003",
  largeIntCharacteristic:      "20210122-8cae-11eb-8dcd-0242ac130003"
};

let floatAsString, smallInt, largeInt;
let trajectoryAngle_value, trajectorySpeed_value;

// callbacks
function connectToBle() {
  // Connect to a device by passing the service UUID
  console.log("trying to connect to peripheral device.");
  myBLE.connect(serviceUUID, getCharacteristics);
}



function getCharacteristics(error, characteristicsFromPeripheral){
  if (error) console.log('error :: ', error);
  BLE_CONNECTED = myBLE.isConnected();
  connectButton.class('connected');
  console.log('connected -- new characteristics :: ', characteristicsFromPeripheral);

  for(let i = 0; i < characteristicsFromPeripheral.length; i++ )
  {

    if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.floatAsStringCharacteristic)
    {
      console.log("angle index ::", i);
      floatAsString = characteristicsFromPeripheral[i];
      console.log(floatAsString );
      //myBLE.startNotifications(floatAsString, handleChangeTrajectoryAngle, 'custom');

    }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.largeIntCharacteristic){
      console.log("speed index ::", i);
      largeInt = characteristicsFromPeripheral[i];
      console.log(largeInt );
      //myBLE.startNotifications(largeInt, handleChangeTrajectorySpeed);

    }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.smallIntCharacteristic){
      console.log("speed index ::", i);
      smallInt = characteristicsFromPeripheral[i];
      console.log(smallInt );
    //  myBLE.startNotifications(smallInt, handleChangeTrajectorySpeed);
    } // end elseif
  }// end for
} // end fxn

  //
  //
  // // some utility functions and incoming parse helpers
  // function ab2str(buf) {
  //   return new TextDecoder().decode(buf);
  // }
  //
  // // got tired of typing parseFloat
  // function pf(someString){
  //   return parseFloat(someString);
  // }
  //
  //
  // function handleChangeTrajectoryAngle(data){
  //
  //   let charArrayData = ab2str(data);
  //   let accellerationCharArray = charArrayData.split(','); // delimiter is now a comma
  //
  //   console.log('Angle from generic chracteristic :: ', accellerationCharArray); // these elements are strings
  //
  //   // convert incoming string to numbers
  //   let floatsFromCharArray=new Array(3);
  //   for(let i = 0; i <accellerationCharArray.length; i++){
  //     floatsFromCharArray[i] = pf(accellerationCharArray[i]);
  //     console.log("float from char array" , floatsFromCharArray[i]);
  //   }
  //
  // }
  //
  //
  // // trajectoryAngle_value, trajectorySpeed_value;
  // function handleChangeTrajectorySpeed(data)
  // {
  //   //  ax = data.getFloat32(0, true); (byte offset, endianess :: true = little // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32
  //   trajectorySpeed_value =  data;
  //   console.log('speed :: ', trajectorySpeed_value);
  //   // if (fxnCount==0) {
  //   //   console.log("first time - speed");
  //   //   myBLE.read(trajectoryAngle_value, gotValue);
  //   //
  //   // }
  // }
  //
  // function readFloats(){
  //   console.log("reading current floats");
  //   if ( fxnCount==1 ){
  //     console.log("angle:: ", myBLE.read(floatAsString));
  //     console.log("speed:: ", myBLE.read(smallInt));
  //     console.log("angleFLOAT:: ", myBLE.read(floatAsStringFloat));
  //
  //   } else {
  //     console.log("not set");
  //   }
  // }
  //
  // // A function that will be called once got values
  // function gotValue(error, value)
  // {
  //   if (error) console.log('error: ', error);
  //   console.log('value: ', value);
  //   //myValue = value;
  //   // After getting a value, call p5ble.read() again to get the value again
  //   //myBLE.read(trajectoryAngle_value, gotValue);
  //   // You can also pass in the dataType
  //   // Options: 'unit8', 'uint16', 'uint32', 'int8', 'int16', 'int32', 'float32', 'float64', 'string'
  //   // myBLE.read(myCharacteristic, 'string', gotValue);
  // }
