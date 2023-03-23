import { useEffect, useState } from "react";
import { View, Text, Button, PermissionsAndroid, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from "react-native";
import BleManager from "react-native-ble-manager";
import { BLEPrinter } from "react-native-thermal-receipt-printer";

export default function App() {

  const [isReady, setIsReady] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connected, setConnected] = useState(null);
  const [inp, setInp] = useState("");

  function logPer() {
    BleManager.getDiscoveredPeripherals().then(console.log)
    BleManager.getDiscoveredPeripherals().then(setDevices);
  }

  useEffect(() => {
    if (!isReady) { 
      PermissionsAndroid.requestMultiple(["android.permission.BLUETOOTH_SCAN", "android.permission.BLUETOOTH_CONNECT", "android.permission.BLUETOOTH_ADVERTISE", "android.permission.ACCESS_FINE_LOCATION"]).then(console.log)
      Promise.all([BleManager.start(), BLEPrinter.init()]).then(() => setIsReady(true)); 
      return; 
    }
    BleManager.scan([], 300, true).then(() => console.log("Scanning"));
  }, [isReady]);

  return (
    <SafeAreaView>
      <Text>
        Started Scan
      </Text>
      <Button onPress={logPer} title="List devices" />
      <ScrollView>
        {devices.map((dev, idx) => (
          <TouchableOpacity key={idx} style={{ padding: 8, marginVertical: 6, backgroundColor: "#0002" }} onPress={() => {
            BleManager.createBond(dev.id).then(() => {
              BLEPrinter.connectPrinter(dev.id).then(setConnected)
            })
          }}>
            <Text>{dev.name}</Text>
            <Text>{dev.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text>Connected Printer: {connected ? `${connected.device_name} ${connected.inner_mac_address} ` : "None"}</Text>
      {connected && (
        <>
        <TextInput value={inp} onChangeText={setInp} placeholder="Enter text to print" />
        <Button title="Print" onPress={() => {
          BLEPrinter.printText(inp);
        }} />
        </>
      )}
    </SafeAreaView>
  )
}