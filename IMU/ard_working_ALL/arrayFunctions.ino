// arduino BLE have sensors that return floats and sensors that return ints
// many of the sensors return multiple values
// these are simple utility functions for the sensor generated data

// Rate limiting data flows can be done with timers 
// i am using the compare functions to see if data has changed
// this is an extention of basic strategy for single sensor values of holding old and comparing to new
// for sensors that return multiple data points those values are held in an array
// checkForChange() looks for ANY change -- not channel (x,y,z) specific changes
//


/*
  Functions in this tab ::
    void copyFloatArray(float* src, float* dst, int len)
    void copyIntArray(int* src, int* dst, int len) {
    
    void checkForChange()
    int compareIntArrays(int* newReadings, int* oldReadings, int len, int threshold )
    int compareFloatArrays( float* newReadings, float* oldReadings, int len, float threshold )

*/

// Function to copy 'len' elements from 'src' to 'dst'
void copyFloatArray(float* src, float* dst, int len) {

  if (VERBOSE) {
    Serial.println( "======== start FLOAT array copy ========");
    printFloatArray(src, len);
    printFloatArray(dst, len);
  }

  memcpy(dst, src, sizeof(src[0])*len);

  //  printFloatArray(src,3);
  //  printFloatArray(dst,3);
  //  Serial.println( "======== end array copy ========");

}

// Function to copy 'len' elements from 'src' to 'dst'
void copyIntArray(int* src, int* dst, int len) {

  if (VERBOSE) {
    Serial.println( "======== start INT array copy ========");
    printIntArray(src, len);
    printIntArray(dst, len);
  }

  memcpy(dst, src, sizeof(src[0])*len);
  //  printIntArray(src,3);
  //  printIntArray(dst,3);
  //  Serial.println( "======== end array copy ========");
}



void checkForChange() {

  accChanged = compareFloatArrays( accNew, accOld, 3, accThreshold);
  magChanged = compareFloatArrays( magNew, magOld, 3, magThreshold);

  colorChanged = compareIntArrays( colorNew, colorOld, 4, colorThreshold);

}

int compareIntArrays(int* newReadings, int* oldReadings, int len, int threshold ) {
  int changed = 0;
  for (int  i = 0; i < len; i ++) {
    if (abs(newReadings[i] - oldReadings[i]) > threshold) changed = 1;
  }
  return changed;
}

int compareFloatArrays( float* newReadings, float* oldReadings, int len, float threshold ) {
  int changed = 0;
  for (int  i = 0; i < len; i ++) {
    if (abs(newReadings[i] - oldReadings[i]) > threshold) changed = 1;
  }
  return changed;
}
