// IMU data multiple data points, variety of send techniques.


// to connect the sketch needs the UUID of the service running on the the arduino
// point of departure https://create.arduino.cc/projecthub/jingwen_zhu/getting-started-with-p5-ble-js-using-arduino-nano-33-ble-120ea6

// add this
// https://armsp.github.io/nano-33-ble-gen/webbluetooth_plotting.html
// test code for above //https://github.com/armsp/nano-33-ble-gen/tree/master/bluetooth/real_time_plotting/accelerometer_xyz_plotting

// UUID must match Arduino service -- this is how they find each other
const serviceUUID = "20210100-8cae-11eb-8dcd-0242ac130003"

// these must match the characterisis UUID from arduino -- variable names can change but UUID can;t
const characteristicsUUID = {
 accX:  "20210110-8cae-11eb-8dcd-0242ac130003",
 accY:  "20210111-8cae-11eb-8dcd-0242ac130003",
 accZ:  "20210112-8cae-11eb-8dcd-0242ac130003",
 accArray:"20210101-8cae-11eb-8dcd-0242ac130003",
 accString:"20210102-8cae-11eb-8dcd-0242ac130003",
 accCharArray:"20210103-8cae-11eb-8dcd-0242ac130003"
}

let arduinoCharacteristics;
let myBLE;

let X=0, Y=1, Z=2;

let accX, accY, accZ, accAll, accString, accCharArray;
let accX_value=null, accY_value=null, accZ_value=null; // for single values sends
let accAX_value=null, accAY_value=null, accAZ_value=null; // for FLOAT Array sends


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
let floatsFromString = new Array(3); // https://stackoverflow.com/questions/931872/what-s-the-difference-between-array-and-while-declaring-a-javascript-ar
let floatsFromCharArray = new Array(3);
let diffs = new Array(3);


function setup(){

   myBLE = new p5ble();

   // need a connect button to let browser attach to BLE peripheral (ie the arduino)
   const connectButton = createButton('Connect');
   connectButton.mousePressed(connectToBle);
   connectButton.position(15,65);

   // const updateButton = createButton('Update');
   // updateButton.position(15, 100);
   // updateButton.mousePressed(writeToBle);

}

function connectToBle(){
  myBLE.connect(serviceUUID, getCharacteristics);
}

function getCharacteristics(error, characteristicsFromPeripheral){
  if (error) console.log('error :: ', error);
  console.log('characteristics :: ', characteristicsFromPeripheral);

  //arduinoCharacteristics = characteristicsFromPeripheral[0]; // needs to be a list
  for(let i = 0; i < characteristicsFromPeripheral.length;i++){

     if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.accX){
       console.log("accX index ::", i);
       accX = characteristicsFromPeripheral[i];
       console.log(accX );
       myBLE.startNotifications(accX, handleChangeAccX, 'custom'); // https://github.com/ITPNYU/p5.ble.js/blob/master/examples/multipleCharIMU/p5-sketch/sketch.js
                                                                  // https://gregstoll.com/~gregstoll/floattohex/
                                                                  // endianess is diff on ard compW laptop

     }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.accY){
       console.log("accY index ::", i);
       accY = characteristicsFromPeripheral[i];
       myBLE.startNotifications(accY, handleChangeAccY, 'custom');

     }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.accZ){
       console.log("accZ index ::", i);
       accZ = characteristicsFromPeripheral[i];
       myBLE.startNotifications(accZ, handleChangeAccZ, 'custom');

     }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.accArray){
       console.log("accAll index ::", i);
       accAll = characteristicsFromPeripheral[i];
       myBLE.startNotifications(accAll, handleChangeAccAll, 'custom');

     }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.accString){
       console.log("accString index ::", i);
       accString = characteristicsFromPeripheral[i];
       myBLE.startNotifications(accString, handleChangeAccString, 'custom');

     }else if(characteristicsFromPeripheral[i].uuid == characteristicsUUID.accCharArray){
       console.log("accCharArray index ::", i);
       accCharArray= characteristicsFromPeripheral[i];
       myBLE.startNotifications(accCharArray, handleChangeCharArray, 'custom');

     }else{
       console.log("nothing");
     }
  }

} // end getCharacteristics


function handleChangeAccX(data){
  //  ax = data.getFloat32(0, true); (byte offset, endianess :: true = little // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32
  accX_value= data.getFloat32(0,true);
  //console.log('accX :: ', accX_value);
  let accX_inner = document.getElementById("accX");
  accX_inner.innerHTML = accX_value ;
}

function handleChangeAccY(data){
  //  ax = data.getFloat32(0, true); (byte offset, endianess :: true = little // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32
  accY_value= data.getFloat32(0,true); // offset 4 bytes no delimiter
  //console.log('accY :: ', accY_value);
  let accY_inner = document.getElementById("accY");
  accY_inner.innerHTML = accY_value ;
}
// recieve single float from float characteristic
function handleChangeAccZ(data){
  //  ax = data.getFloat32(0, true); (byte offset, endianess :: true = little // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32
  accZ_value= data.getFloat32(0,true);
  //console.log('accZ :: ', accZ_value);
  let accZ_inner = document.getElementById("accZ");
  accZ_inner.innerHTML = accZ_value ;
}

// receive array of floats from generic charcateristic
function handleChangeAccAll(data){
  // https://gregstoll.com/~gregstoll/floattohex/
  //  ax = data.getFloat32(0, true); (byte offset, endianess :: true = little // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32
  accAX_value= data.getFloat32(0,true);// 4 byte becasuee ard float is 4bytes and we therefore get float32 (32 bits = 4 bytes)
  accAY_value= data.getFloat32(4,true);
  accAZ_value= data.getFloat32(8,true);

  //console.log('accZ :: ', accZ_value);
  let accAX_inner = document.getElementById("accAX");
  accAX_inner.innerHTML = accAX_value ;

  //console.log('accZ :: ', accZ_value);
  let accAY_inner = document.getElementById("accAY");
  accAY_inner.innerHTML = accAY_value ;

  //console.log('accZ :: ', accZ_value);
  let accAZ_inner = document.getElementById("accAZ");
  accAZ_inner.innerHTML = accAZ_value ;

  // for dubug
  // expect zeros if working -- uncomment following two lines to use

  //floatsFromFloat = [accAX_value, accAY_value, accAZ_value];
  //compare(floatsFromFloat);
}

// convert the incoming arrayBuffer in DataView to a js string
//  https://gist.github.com/skratchdot/e095036fad80597f1c1a
// follow above link and scroll down to find this solution -- tested only in chrome

function ab2str(buf) {
  return new TextDecoder().decode(buf);
}

// got tired of typing parseFloat
function pf(someString){
  return parseFloat(someString);
}

// data arrives as string
function handleChangeAccString(data){
  // side reading
  //https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
  //https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String

  // here is the solution i found eventually
  // in p5BLE git discussion there is a plotter example with this idea at core
  // view-source:https://armsp.github.io/nano-33-ble-gen/webbluetooth_plotting.html
  // extract plotter later -- original post code no longer works.
  // but fxn below saves us -- convert to string then split on delimiter.
  let stringData = ab2str(data);
  let accelerationString = stringData.split('|'); // delimiter
    console.log('Acceleration: ', accelerationString); // these elements are strings

    // at this point we have an array of strings -- we need numbers !
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat

    console.log(accelerationString[0]);  // number formatted as string
    console.log(accelerationString[0]+2); // appends 2 to the end of number, doesn't add it -- cause its a string
    let tempAX = parseFloat(accelerationString[0]);
    console.log(tempAX); // same number -- but now its a number not a string
    console.log(tempAX+2); // mathematically adds 2 to the number
    let tempAY = pf(accelerationString[1]);
    console.log(tempAY); // same number -- but now its a number
    console.log(tempAY+2); // mathematically adds 2 to the number


    // convert incoming string to numbers
    for(let i = 0; i <3; i++){
      floatsFromString[i] = pf(accelerationString[i]); // pf == parseFloat converter function
    }


    // display all acc data delivered as string
    //console.log('accZ :: ', accZ_value);
      let accAXs_inner = document.getElementById("accAXs");
      accAXs_inner.innerHTML = floatsFromString[X] ; // accAXs_value

      //console.log('accZ :: ', accZ_value);
      let accAYs_inner = document.getElementById("accAYs");
      accAYs_inner.innerHTML = floatsFromString[Y] ; // accAXs_value  //console.log('accZ :: ', accZ_value);

      let accAZs_inner = document.getElementById("accAZs");
      accAZs_inner.innerHTML = floatsFromString[Z] ; // accAXs_value

     // debug -- only compare one type at a time
     // you will get rounding error on this one -- note exp = e-11
     // this is due to float to string convert limits in arduino (10places)

     //compare(floatsFromString);
}

// if you send a big char array and have to parse it

function handleChangeCharArray(data){

  let charArrayData = ab2str(data);
  let accellerationCharArray = charArrayData.split(','); // delimiter is now a comma
    console.log('Acceleration: ', accellerationCharArray); // these elements are strings

 // convert incoming string to numbers
  for(let i = 0; i <3; i++){
    floatsFromCharArray[i] = pf(accellerationCharArray[i]);
  }

// display all acc data delivered as char []

  //console.log('accZ :: ', accZ_value);
  let accAXca_inner = document.getElementById("accAXca");
  accAXca_inner.innerHTML = floatsFromCharArray[X] ; // accAXs_value

  let accAYca_inner = document.getElementById("accAYca");
  accAYca_inner.innerHTML = floatsFromCharArray[Y] ; // accAXs_value

  let accAZca_inner = document.getElementById("accAZca");
  accAZca_inner.innerHTML = floatsFromCharArray[Z] ; // accAXs_value

  // debug -- only compare one type at a time
  // expect zeros here if working
  compare(floatsFromCharArray);

}

// make sure the data arriving individually is same as that in other formats
// save staring at long numbers and going blind
function compare(vals){
// compare contenst of one of the arrays (floats, stirng, char[]) to single characteristic sends
// you will only see last one called -- so debug one at a time
  diffs[X] = accX_value - vals[X];
  diffs[Y] = accY_value - vals[Y];
  diffs[Z] = accZ_value - vals[Z];

    let compX_inner = document.getElementById("compX");
    compX_inner.innerHTML = diffs[X] ;

    let compY_inner = document.getElementById("compY");
    compY_inner.innerHTML = diffs[Y] ;
    let compZ_inner = document.getElementById("compZ");
    compZ_inner.innerHTML = diffs[Z] ;

}
