import { useEffect, useState } from "react";
import { View, Text, Button, PermissionsAndroid, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView } from "react-native";
import BleManager from "react-native-ble-manager";
import { BLEPrinter } from "react-native-thermal-receipt-printer";


export default function App() {

  const [isReady, setIsReady] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connected, setConnected] = useState(null);
  const [inp, setInp] = useState("Hello World");

  function logPer() {
    BleManager.getDiscoveredPeripherals().then((devs) => {console.log(devs); setDevices(devs); });
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
    <SafeAreaView style={{ backgroundColor: "#ffe", width: "100%" }}>
      <Text>
        Started Scan
      </Text>
      <Button onPress={logPer} title="List devices" />
      <ScrollView style={{ height: 400, width: "100%" }}>
        {devices.map((dev, idx) => (
          <TouchableOpacity key={idx} style={{ padding: 8, marginVertical: 6, backgroundColor: "#fca" }} onPress={() => {
            BLEPrinter.getDeviceList().then((list) => {
              console.log(list);
              BLEPrinter.connectPrinter(dev.id).then(setConnected);
            });
          }}>
            <Text>{dev.name}</Text>
            <Text>{dev.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text>Connected Printer: {connected ? `${connected.device_name} ${connected.inner_mac_address} ` : "None"}</Text>
      <KeyboardAvoidingView behavior="position">
        {connected && (
          <View style={{ backgroundColor: "#fff" }} >
          {console.log("AAA", connected)}
          <TextInput value={inp} multiline onChangeText={setInp} style={{ margin: 24, borderWidth: 0.5, padding: 24 }} />
          <Button title="Print" onPress={() => {
            BLEPrinter.printText(inp);
          }} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}