/*
  This code reads IMU and updates a web page.

  Files:

  this ard code ::

  js_simpleDom  ::

  js_canvas     ::

  Notes ::


  Sources are many -- many are commented through out code.


  https://create.arduino.cc/projecthub;/jingwen_zhu/getting-started-with-p5-ble-js-using-arduino-nano-33-ble-120ea6

  this code needs to scan all the sensors -- store a readng and then supply them over BLE
  for now -- just going to grab -- light and accellerometer -- first iteration going to send
  X,Y,Z of accel as seperate characteristics. -- rather than needing to parse.


*/

// V01 -- arrays and one service with many characteristics -- just acc to start -- working now to bluesee on laptop --3 characteristics
// other useful thread  https://github.com/arduino-libraries/ArduinoBLE/issues/35
// https://github.com/ITPNYU/p5.ble.js

#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>
#include <Arduino_APDS9960.h>


BLEService sensorScanService("20210100-8cae-11eb-8dcd-0242ac130003"); // BLE LED Service

//aboandoned this stragtegy
// but see here for string example
// https://github.com/armsp/nano-33-ble-gen/blob/master/bluetooth/real_time_plotting/accelerometer_xyz_plotting/accelerometer_xyz_plotting.ino

char accDataToSend[51];
//char magDataToSend[20];
//char colDataToSend[20];

// need a charcateristic for each sensor of interest and then data formats being explored

BLECharacteristic accCharacteristic          ("20210101-8cae-11eb-8dcd-0242ac130003", BLERead | BLENotify, sizeof(float) * 3);     // size of 3 floats
BLEStringCharacteristic accCharacteristicString ("20210102-8cae-11eb-8dcd-0242ac130003", BLERead | BLENotify, 51);                 // size of string
BLECharacteristic accCharacteristicCharArray ("20210103-8cae-11eb-8dcd-0242ac130003", BLERead | BLENotify, sizeof(accDataToSend)); // size of array

BLEFloatCharacteristic accX_Characteristic   ("20210110-8cae-11eb-8dcd-0242ac130003", BLERead | BLENotify ); // data type (size) defined by chracteristic type
BLEFloatCharacteristic accY_Characteristic   ("20210111-8cae-11eb-8dcd-0242ac130003", BLERead | BLENotify );
BLEFloatCharacteristic accZ_Characteristic   ("20210112-8cae-11eb-8dcd-0242ac130003", BLERead | BLENotify );

//BLEService batteryService("1101");
//BLEUnsignedCharCharacteristic batteryLevelChar("2101", BLERead | BLENotify); // 21


char ID[] = "nano 001";  // eventually there will be multiples


// sensor data vars
// many builtin sensors dump multiple data types

float accNew[] = {0.0, 0.0, 0.0};
float accOld[] = {0.0, 0.0, 0.0};

float magNew[] = {0, 0, 0};
float magOld[] = {0, 0, 0};

int colorNew[] = {0, 0, 0, 0};
int colorOld[] = {0, 0, 0, 0};

// sensor change status vars
int accChanged  = 0, magChanged = 0, colorChanged = 0;

// threshold magnitude of change required to trigger send 
// was good during debug may be overkill for your needs
// set to zero if you want every change 

const float accThreshold = 0.01, magThreshold = 3.0;
const int colorThreshold = 3;

// some array access constants
const int RED = 0, GREEN = 1, BLUE = 2, BRIGHTNESS = 3;
const int X = 0, Y = 1, Z = 2;

// timer vars
int  sampleInterval = 100;
long lastSampleTime = -1;
long timeNow = 0;

const int VERBOSE = 0;

void setup() {

  Serial.begin(9600);
  while (!Serial); // this will pause code until serial monitor opened -- remove in live code

  // start IMU
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  // start color sensor
  if (!APDS.begin()) {
    Serial.println("Error initializing APDS9960 sensor.");
    while (1);
  }

  setupBle();


  Serial.println("BLE nano Peripheral");

}

void loop() {

  timeNow = millis();

  // timer to regulate sensor reads (set sampleInterval to 0 if you want full speed)
  if (timeNow - lastSampleTime > sampleInterval) {
    readSensors();
    checkForChange();
    lastSampleTime = timeNow;
  }

  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral (note -- another way is if subscribed ( how to do in JS?))

  if (central) {
    // Serial.print("Connected to central :: ");
    // print the central's MAC address:
    // Serial.println(central.address());

    if ( accChanged )  {
      //Serial.print("acc changed :: sending data ");

      // debug
      //        Serial.print("accNew[x] :: ");
      //        Serial.print(accNew[X]);
      //        Serial.print("\taccNew[y] :: ");
      //        Serial.print(accNew[Y]);
      //        Serial.print("\taccNew[z] :: ");
      //        Serial.print(accNew[Z]);
      //        Serial.println();
      //        Serial.println(sizeof(accNew));

      // send the three floats here
      accX_Characteristic.writeValue(accNew[X]); //accNew[X]
      accY_Characteristic.writeValue(accNew[Y]); //accNew[Y]
      accZ_Characteristic.writeValue(accNew[Z]); //accNew[Z]

      // send as array of floats
      accCharacteristic.writeValue(accNew, sizeof(accNew));

      // send as a string
      // Arduino String conversion to float limits to 10 decimal places ( not sure why buffer in source is 33 bytes)
      // https://www.arduino.cc/reference/en/language/variables/data-types/string/functions/tochararray/
      // in String( var, len ) -- len > 10 has no effect
      // pipe = | = delimiter -- could be commas see next

      String accelerometerData = String(accNew[X], 14) + "|" + String(accNew[Y], 14) + "|" + String(accNew[Z], 14);
      // Serial.println(accelerometerData);
      accCharacteristicString.writeValue(accelerometerData);


      // send as a char array
      // send with comma  ,  delimiter
      // https://en.cppreference.com/w/c/io/fprintf
      // see notes on bytes count sent as this is very inefficient
      sprintf(accDataToSend, "%.13f,%.13f,%.13f", accNew[X], accNew[Y], accNew[Z]);
      //   Serial.println(accDataToSend);
      accCharacteristicCharArray.writeValue(accDataToSend); // will we run out of mem ?

      // once new data is sent change flag back
      accChanged = 0;
    } // if accCHanged 


    // place holders for other data .... it gets caried away at some point

    if ( magChanged )  {
      // Serial.println("mag changed");
      magChanged = 0;
    } // printFloatArray( magOld,3); printFloatArray( magOld,3);

    if ( colorChanged ) {
      //Serial.println("color changed");
      colorChanged = 0;
    }

  } // central
  
} // loop



// later 
void showProperties(BLEByteCharacteristic bc) { 
  ;
}
