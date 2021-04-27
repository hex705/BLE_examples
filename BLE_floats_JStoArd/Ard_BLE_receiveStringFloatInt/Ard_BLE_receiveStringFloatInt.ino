// simplest viable arduino recieve code -- float
#include <ArduinoBLE.h>


BLEService traceBLEService("20210100-8cae-11eb-8dcd-0242ac130003");

const int floatArraySize = 16;
char floatArray[floatArraySize];

const int largeIntArraySize = 16;
char largeIntArray[largeIntArraySize];

// need a characteristic for two data types
    // -- float we will alter dynamically
    // -- speed just gets send by JS to test

BLECharacteristic  floatAsStringCharacteristic("20210120-8cae-11eb-8dcd-0242ac130003", BLERead | BLEWrite | BLENotify, floatArraySize); // no size bc float type
BLEIntCharacteristic smallIntCharacteristic("20210121-8cae-11eb-8dcd-0242ac130003", BLERead | BLEWrite | BLENotify);   // no size bc float type

BLECharacteristic    largeIntCharacteristic("20210122-8cae-11eb-8dcd-0242ac130003", BLERead | BLEWrite | BLENotify, floatArraySize); // no size bc float

char ID[] = "nano 001";  // eventually there will be multiples

// set initial values
float sentAngle=5.0;
int   smallInt=55;
int   largeInt =9999;

// experiment with DEBUG define -- it works !
// #define VERBOSE
#define DEBUG

#ifdef DEBUG
  #define DEBUG_PRINT(x)  Serial.print (x)
  #define DEBUG_PRINTLN(x)  Serial.println (x)
  #define DEBUG_PRINT_FLOAT(x,y) Serial.println(x,y);
#else
  #define DEBUG_PRINT(x)
  #define DEBUG_PRINTLN(x)
#endif

void setup(){
  Serial.begin(9600);
  while (!Serial); // this will pause code until serial monitor opened -- remove in live code

  Serial.print("sizeof(int) :: \t");
  Serial.println(sizeof(int));
  Serial.print("sizeof(float) :: \t");
  Serial.println(sizeof(float));

  setupBle();
  clearCharArray(floatArray, floatArraySize);

} // end setup

void loop(){

  BLEDevice central = BLE.central();
  // if a central is connected to peripheral:

  // if (central) {
  //  Serial.print("Connected to central: ");
  //  // print the central's MAC address:
  //  Serial.println(central.address());

  // while the central is still connected to peripheral:
  if (central.connected()) {
    // if the remote device wrote to the characteristic,
    // use the value to control the LED:
    if (floatAsStringCharacteristic.written()) { // also valueUpdated
      //printCharArrayElements(floatArray, floatArraySize);

      // if your device is connect to a central AND  central has written to the characteristic
      BLE_readValue( floatAsStringCharacteristic, floatArray, floatArraySize );

      sentAngle = convertToFloat(floatArray); // global
      int intAngle = convertToInt(floatArray);

      DEBUG_PRINT("\n\nintAngle :: \t");
        DEBUG_PRINTLN(intAngle);

      DEBUG_PRINT("sentAngle -- to number :: \t");
        DEBUG_PRINT_FLOAT(sentAngle,5);
      sentAngle +=2.0;
      DEBUG_PRINT("sentAngle -- plus 2 :: \t");
        DEBUG_PRINT_FLOAT(sentAngle,5);

      // clear the char array -- its temporary
      clearCharArray(floatArray, floatArraySize);
      //printCharArrayElements(floatArray, floatArraySize);

    }
  }  // end if angle

  if (largeIntCharacteristic.written()) {
    BLE_readValue( largeIntCharacteristic, largeIntArray, largeIntArraySize );
    largeInt = convertToInt(largeIntArray); // may need to cast it to int
    Serial.print("largeInt :: \t");
    Serial.println(largeInt);
  }  // end if angle
  // use an int characteristic for ints from JS BLE -- but they are really (u_int8)
    // when data types correspond BLE is cake
  if (smallIntCharacteristic.written()) {
    // don;t use int characteristic if any chance a number larger than 8bits (0-255) is sent 
    smallInt = smallIntCharacteristic.value(); // may need to cast it to int
    if (smallInt>255) {
        Serial.println("err int biggerthan 255");
        smallInt = 0;
    }
    Serial.print("smallInt :: \t");
    Serial.println(smallInt);
  }  // end if angle


} //end loop


void clearCharArray(char theArray[], int theArraySize){
  #ifdef VERBOSE
    Serial.println("IN :: clearCharArray");
  #endif
  DEBUG_PRINTLN("clearCharArray");
  sprintf(theArray, "%2.15f", 0.0f );// fill it with zeros
  theArray[theArraySize-1]='\0'; // null terminate it
}

void printCharArrayElements(char theArray[], int theArraySize){
  #ifdef VERBOSE
    Serial.println("IN :: printCharArrayElements");
  #endif
  #ifdef DEBUG
    for(int i = 0; i < theArraySize; i ++ ){
      Serial.print("element[");
      Serial.print(i);
      Serial.print("]\t");
      Serial.println(theArray[i]);
    }
  #endif

}

void BLE_readValue(BLECharacteristic theCharacteristic, char charArray[], int size){

  int len = theCharacteristic.valueLength();
  if (len >= size) len = size-1; // if a long value is sent -- do not fall out of buffer
  theCharacteristic.readValue(charArray, len);// len was sizeof(floatArray)
  charArray[len]='\0';

  #ifdef VERBOSE
    Serial.println("IN :: BLE_readValue");
    Serial.print("len :: \t");
    Serial.println(len);
    for(int i = 0; i < size; i ++ ){
      Serial.print("charArray[");
      Serial.print(i);
      Serial.print("]\t");
      Serial.println(charArray[i]);
    }
  #endif
}

float convertToFloat( char theArray[]){
  #ifdef VERBOSE
    Serial.println("IN :: convertToFloat");
  #endif
  // not incoming array MUST be null terminated
  // convert char array to float
  return atof(theArray);
}

int convertToInt( char theArray[]){
  #ifdef VERBOSE
    Serial.println("IN :: convertToInt");
  #endif
  // not incoming array MUST be null terminated
  // convert char array to float
  return atoi(theArray);
}
