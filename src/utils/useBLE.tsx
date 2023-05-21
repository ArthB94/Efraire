import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { set } from "react-native-reanimated";
import DeviceInfo from "react-native-device-info";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";
import { BleError, BleManager, Characteristic, Device, Service } from "react-native-ble-plx";
import base64 from "react-native-base64"
import { decode } from "base-64";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();


const UUID_SERVICE = "00000000-0000-0000-0000-00000000da00"
const UUID_CHARACTERISTIC25 = "00000025-0000-1000-8000-00805f9b34fb"
const UUID_CHARACTERISTIC10 = "00000010-0000-1000-8000-00805f9b34fb"

// LOG  Appareil trouvé: 4B:EC:C4:2C:07:A2 Nano33BLE
 //LOG  Services disponibles: ["00000000-0000-0000-0000-00000000da00"]
//LOG  UUIDs des caractéristiques: ["00002a00-0000-1000-8000-00805f9b34fb", "00002a01-0000-1000-8000-00805f9b34fb"]
//LOG  UUIDs des caractéristiques: ["00002a05-0000-1000-8000-00805f9b34fb"]
//LOG  UUIDs des caractéristiques: ["00000025-0000-1000-8000-00805f9b34fb", "00000010-0000-1000-8000-00805f9b34fb"]

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    connectToDevice(device: Device): Promise<void>;
    scanForDevices(): void;
    setConnectedDevice(device: Device): void;
    currentDevice: Device | null;
    data: number[];
    allDevices: Device[];
    hexToFloat(hexString: string): number;
    setData(data: number[]): void;

}


export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [currentDevice, setConnectedDevice] = useState<Device | null>(null);
    const [data, setData] = useState<Float[]>([0,0]);


    const requestPermissions = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const apiLevel = await DeviceInfo.getApiLevel();
            if (apiLevel < 23) {
                const grantedStatus = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Bluetooth Low Energy needs access to your location',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                        buttonNeutral: 'Ask Me Later',
                    }
                );
                callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
            }
            else {
                const result = await requestMultiple([
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ]);

                const isAllPermissionGranted =
                    result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
                console.log('isAllPermissionGranted', isAllPermissionGranted);
                callback(isAllPermissionGranted);
            }
        } else {
            callback(true);
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForDevices = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);

            }
            if (device && device.name?.includes('Nano')) {
                setAllDevices(prevState => {
                    if (!isDuplicateDevice(prevState, device)) {
                        
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });
    }
    const connectToDevice = async (device: Device) => {

        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            console.log("CONNECTING TO DEVICE");


            bleManager.stopDeviceScan();
            startStreamingData(device, 25);
            startStreamingData(device, 10);
            setConnectedDevice(deviceConnection);

        } catch (error) {
            console.error("ERROR WHEN CONNECTING", error);
        }
    }

    const startStreamingData = async (device: Device, CharNum:number) => {
        let UUID_CHARACTERISTIC;
        if(CharNum == 25){
            UUID_CHARACTERISTIC = UUID_CHARACTERISTIC25;
        }
        else{
            UUID_CHARACTERISTIC = UUID_CHARACTERISTIC10;
        }
        try {
          await device.discoverAllServicesAndCharacteristics();
          const characteristic = await device.readCharacteristicForService(
            UUID_SERVICE,
            UUID_CHARACTERISTIC
          );
          await device.monitorCharacteristicForService(
            UUID_SERVICE,
            UUID_CHARACTERISTIC,
            (error, characteristic) => {
              if (error) {
                console.error('Error updating data:', error);
                return;
              }
              if (!characteristic?.value) {
                console.error('No characteristic value found');
                return;
              }
              if (CharNum == 25) {
                setData([hexToFloat(base64ToHex(characteristic.value)),data[1]]);
              }
              else{
                setData([data[0],hexToFloat(base64ToHex(characteristic.value))]);
              }
              console.log('Data updated:', data);
            }
          );
        } catch (error) {
          console.error('Error starting data streaming:', error);
        }
      };

      // Convertir un nombre hexadécimal en float (big-endian)
      const hexToFloat = (hexString: string): number => {
        const byteArray = hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)); //cette ligne permet de séparer les octets en groupes de 2 caractères et de les convertir en entiers 
        const buffer = new ArrayBuffer(4); //création d'un tableau de 4 octets
        const uint8Array = new Uint8Array(buffer);//création d'un tableau de 8 bits non signés
        const floatArray = new Float32Array(buffer);//création d'un tableau de 32 bits signés
        for (let i = 0; i < byteArray.length; i++) {    //boucle pour remplir le tableau de 8 bits non signés
          uint8Array[i] = byteArray[i]; //remplissage du tableau de 8 bits non signés
        }
        const floatValue = floatArray[0]; //conversion du tableau de 32 bits signés en float
        return floatValue;
      };

      // Convertir de Base64 à Hexadécimal
      const base64ToHex = (base64String: string): string => {
        const binaryString = decode(base64String); //décodage de la chaîne de caractères en base 64
        const byteArray = new Uint8Array(binaryString.length); //création d'un tableau de 8 bits non signés
        for (let i = 0; i < binaryString.length; i++) { //boucle pour remplir le tableau de 8 bits non signés
            byteArray[i] = binaryString.charCodeAt(i); //remplissage du tableau de 8 bits non signés
        }
        return Array.from(byteArray, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join(''); //conversion du tableau de 8 bits non signés en hexadécimal
    };

    return {
        hexToFloat,
        requestPermissions,
        scanForDevices,
        allDevices,
        connectToDevice,
        setConnectedDevice,
        currentDevice,
        data,
        setData,
    };

}

