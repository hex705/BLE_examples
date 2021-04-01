void readSensors() {

  if (IMU.accelerationAvailable()) {
    copyFloatArray( accNew, accOld, 3); // be able to check for change over time 
    IMU.readAcceleration(accNew[X], accNew[Y], accNew[Z]);
  }

  if (IMU.magneticFieldAvailable()) {
    copyFloatArray( magNew, magOld, 3);
    IMU.readMagneticField(magNew[X], magNew[Y], magNew[Z]);
  }

  // read the color
  if ( APDS.colorAvailable()) {
    copyIntArray( colorNew, colorOld, 4);
    APDS.readColor(colorNew[RED], colorNew[GREEN], colorNew[BLUE], colorNew[BRIGHTNESS]);
  }
}
