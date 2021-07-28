import React, {Component} from 'react'
import { View, Text, PermissionsAndroid, StyleSheet, Button, Alert, Image, Platform } from 'react-native';
import {Table, Row} from 'react-native-table-component';
import { writeFile, readFile, DocumentDirectoryPath, DownloadDirectoryPath } from 'react-native-fs';
import XLSX from 'xlsx';

const DDP = DownloadDirectoryPath + "/";

const input = res => res;
const output = str => str;


// const App = () => {
//   return (
//     <View>
//       <Text>ok</Text>
//     </View>
//   )
// }

export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      data:[["No.","Men No,","ID No"],
            [10,40,40],
            [24,5,36],
            [3,53,6],
            [4,5,26],
            [5,25,36],
            ]
    };
    this.importFile = this.importFile.bind(this)
    this.exportFile = this.exportFile.bind(this)
  };

requestRunTimePermission=() => {
  var that = this;
  async function externalStoragePermission() {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title:'External Storage Write Permission',
          message:'App needs access to Storage data.',
        }
      );
      if(granted === PermissionsAndroid.RESULTS.GRANTED){
        that.exportFile();
      }else{
        alert('WRITE_EXTERNAL_STORAGE permission denied')
      }
    }
    catch(err){
      Alert.alert('Write permission err',err)
    }
  }
  if(Platform.OS === 'android'){
    externalStoragePermission();
  }else{
    this.exportFile();
  }
}

importFile() {
  Alert.alert('file to sheetjsw.xlsx', 'Copy to ' + DDP, [
    {text:'Cancel',onPress:() => {}, style:'cancel'},
    {text:'Import', onPress:() => {
      readFile(DDP + 'sheetjsw.xlsx','ascii').then((res) => {
        const wb = XLSX.read(input(res), {type:'binary'});

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {header:1});

        this.setState({data:data, });
      }).catch((err) => {Alert.alert('importFile Error', 'Error' + err.message)});
    }}
  ])
}

exportFile() {
  var data= [
    {"Name":"John","City":"Seattle","Tech":"React Native"},
    {"Name":"Mike","City":"Los Angeles","Tech":"Ionic"},
    {"Name":"Zach","City":"New York","Tech":"Flutter"},
    {"Name":"Mike","City":"Los Angeles","Tech":"Ionic"},
    {"Name":"Zach","City":"New York","Tech":"Flutter"},
  ]

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

  const wbout = XLSX.write(wb, {type:'binary', bookType:'xlsx'});

  const file = DDP + "Sheetjsw.xlsx";

  writeFile(file, output(wbout), 'ascii').then((res) => {
    Alert.alert("exportFile success", "Exported to " + file);
  }).catch((err) => {Alert.alert("exportFile Error", "Error " + err.message);});

};

render() {return (
  <View style={styles.container}>
    <Text style={{fontSize:25, color:"green", fontWeight:'bold'}}>Sheet Current Data</Text>

    <Table style={{width:'80%',margin:20}} borderStyle={{borderWidth:2, borderColor:'red'}} >
    {
      this.state.data.map((rowData, index) => (
        <Row 
        key={index}
        data={rowData}
        style={[styles.row,index%2 && {backgroundColor:'red'}]}
        textStyle={styles.text}
        />
      ))
    }
    </Table>

    <View style={{flexDirection:'row', justifyContent:'space-between', width:"70%", backgroundColor:'red',borderRadius:5, borderWidth:1, padding:10}}>
    <Button onPress={this.importFile} title="Import Data" color="green" />
    <Button onPress={() => this.requestRunTimePermission()} title="Export Data" color="blue" />
    </View>

  </View>
);};

};

const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',backgroundColor:'#ddd'},
  welcome:{fontSize:20, textAlign:'center', margin:10},
  instructions:{textAlign:'center',color:'#333333',marginBottom:5},
  thead:{height:40, backgroundColor:'#f1f8ff'},
  tr:{height:30},
  text:{marginLeft:5},
  table:{width:"100%"},
  row:{height:40,backgroundColor:'#E7E6E1'}
});

