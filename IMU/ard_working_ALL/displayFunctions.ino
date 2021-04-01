
// arduino BLE have sensors that return floats and sensors that return ints
// many of the sensors return multiple values
// these are simple utility functions for the arrays holding sensor generated data



/* fxn in this tab:
 *   void printIntArray( int* src, int len) 
 *   void printFloatArray( float* src, int len)
 *   void plotSensors(int* sense, int len)
 *   void plotSensors(float* sense, int len)
 *   
 *   unused
 *   //void buildSendString(int* src, int len, char* buff) 
 *   //void buildSendString(float* src, int len, char* buff)
 */


// for int based arrays
void printIntArray( int* src, int len) {
  Serial.println("\nprint int array ....");
  for (int i = 0; i < len; i++) {
    Serial.print(src[i]);
    Serial.print("\t");
  }
  Serial.println();
}

// for float based arrays 
void printFloatArray( float* src, int len) {
  Serial.println("\nprint float array ....");
  for (int i = 0; i < len; i++) {
    Serial.print(src[i]);
    Serial.print("\t");
  }
  Serial.println();
}

// for ints
void plotSensors(int* sense, int len){

  for (int i=0; i < len; i++){
    Serial.print(sense[i]);
    Serial.print(" ");
  }
  
}

//for floats
void plotSensors(float* sense, int len){

  for (int i=0; i < len; i++){
    Serial.print(sense[i]);
    Serial.print(" ");
  }
  
}


//void buildSendString(int* src, int len, char* buff) {
//  // build comma seperated here
//
//  for (int i = 0; i < len; i++) {
//    buff += src[i];
//    buff += ',';
//  }
//  buff += '/0';
//}
//
//void buildSendString(float* src, int len, char* buff) {
//  // build comma seperated here
//
//  for (int i = 0; i < len; i++) {
//    buff += src[i];
//    buff += ',';
//  }
//  buff += '/0';
//}
