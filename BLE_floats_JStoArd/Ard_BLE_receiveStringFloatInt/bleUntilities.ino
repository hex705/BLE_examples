
bool setupBle()
{
  // start BLE
  if ( !BLE.begin() )
  {
    Serial.println("BLE failed");
    return false;
  }
  Serial.println(ID);
  // set advertised local name and service UUID:
  BLE.setDeviceName( ID );
  BLE.setLocalName( ID );
  BLE.setAdvertisedService( traceBLEService );

  // BLE add characteristics

  // all three IMU readings in different data formats
  traceBLEService.addCharacteristic( floatAsStringCharacteristic );
  traceBLEService.addCharacteristic( smallIntCharacteristic );
  traceBLEService.addCharacteristic( largeIntCharacteristic );
  // add service
  BLE.addService( traceBLEService );

  // set initital values
  sprintf(floatArray, "%2.8f", sentAngle );// should load 0.987 as a char array followed by , <comma>
  floatAsStringCharacteristic.writeValue(floatArray,sizeof(floatArray));//sizeof(sentAngle)
  smallIntCharacteristic.writeValue(smallInt);
  largeIntCharacteristic.writeValue(largeIntArray, sizeof(largeIntArraySize));
  // start advertising
  BLE.advertise();

  Serial.println("BLE setup complete");

  return true;
}
