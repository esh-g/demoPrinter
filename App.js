import { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, PermissionsAndroid, KeyboardAvoidingView, TextInput } from "react-native";
import { BLEPrinter } from "react-native-thermal-receipt-printer";

const _connectPrinter = (printer, callback) => {
  BLEPrinter.connectPrinter(printer.inner_mac_address).then(console.log).catch(console.warn);
}

export default function App() {

  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();
  const [string, setString] = useState("");

  useEffect(() => {
    PermissionsAndroid.requestMultiple(["android.permission.BLUETOOTH_SCAN", "android.permission.BLUETOOTH_CONNECT"]);
    BLEPrinter.init().then(()=> {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  return (
    <ScrollView style={{ padding: 24 }}>
      {
        printers.map(printer => (
          <TouchableOpacity style={{ padding: 12, backgroundColor: "#fff1", marginVertical: 6 }} key={printer.inner_mac_address} onPress={() => _connectPrinter(printer, setCurrentPrinter)}>
            <Text>Device Name: {printer.device_name}</Text>
            <Text>MAC: {printer.inner_mac_address}</Text>
          </TouchableOpacity>
          ))
      }

      <Text style={{ marginTop: 20 }} >{currentPrinter?.inner_mac_address} {currentPrinter?.device_name}</Text>

        <TextInput value={string} onChangeText={setString} style={{ padding: 12, backgroundColor: "#ddd", color: "#000" }} />

      <TouchableOpacity style={{ marginTop: 50, padding: 12, backgroundColor: "#111" }} onPress={() => {
        BLEPrinter.printText(string);
      }}>
        <Text>Print</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}