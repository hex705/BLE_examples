// https://forum.arduino.cc/index.php?topic=660532.0


bool setupBle()
{


  // start BLE
  if ( !BLE.begin() )
  {
    return false;
  }

  // set advertised local name and service UUID:
  BLE.setDeviceName( ID );
  BLE.setLocalName( ID );
  BLE.setAdvertisedService( sensorScanService );

  // BLE add characteristics

  // all three IMU readings in different data formats
  sensorScanService.addCharacteristic( accCharacteristic );
  sensorScanService.addCharacteristic( accCharacteristicString );
  sensorScanService.addCharacteristic( accCharacteristicCharArray );

  // each axis of IMU sent seperately
  sensorScanService.addCharacteristic( accX_Characteristic );
  sensorScanService.addCharacteristic( accY_Characteristic );
  sensorScanService.addCharacteristic( accZ_Characteristic );

  // add service
  BLE.addService( sensorScanService );

  // set initital values
  accCharacteristic.writeValue( accNew, sizeof(accNew) ); // generic Characteristic var need size
  accCharacteristicString.writeValue("test");             // string - size defined in characteristic declaration (eg 51)
  accCharacteristicCharArray.writeValue(accDataToSend);   // char array
 
  accX_Characteristic.writeValue( 0.0 ); 
  accY_Characteristic.writeValue( 0.0 );
  accZ_Characteristic.writeValue( 0.0 );

  // start advertising
  BLE.advertise();
  Serial.println("BLE setup complete");
  
  return true;
}
