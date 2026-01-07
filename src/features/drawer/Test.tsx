import { Button } from '@rneui/base';
import React, { useEffect, useState, } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';


const Test = () => {
  let name2 = 'anyname';

  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const [email, setEmail] = useState('');
  const [display, setDisplay] = useState(true);
  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [list, setList] = useState([])

  const users = [
    { id: 1, name: 'Anyname' },
    { id: 2, name: 'peter' },
    { id: 3, name: 'Bruce' },
    { id: 4, name: 'li' },
  ];
  // const getAPIData = async () => {
  //   const url = "https://jsonplaceholder.typicode.com/posts";
  //   let result = await fetch(url);
  //   result = await result.json();
  //   setData(result);
  // }
  // const getApi = async () => {
  //   const url = "https://jsonplaceholder.typicode.com/posts";
  //   let resultt = await fetch(url);
  //   resultt = await resultt.json();
  //   setData2(resultt)
  // }

  const getap = async () => {
    console.warn("Function Call");
    const data = {
      name: "sam",
      age: 33,
      email: "sam@gmail.com",
      id: 99
    }
    const url = "http://10.0.2.2:3000/users";
    let result = await fetch(url, {
      method: "post",
      headers: { "content-Type ": "application/json" },
      body: JSON.stringify(data)
    });
    result = await result.json();
    // setList(result)
    console.warn(result)
  }

  // useEffect(() => {
  //   // getAPIData()
  //   getap()
  // }, [])

  return (
    <View style={{ margin: 20 }}>
      {/* <TextInput
        style={styles.input}
        placeholder="Your Name"
        onChange={text => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChange={text => setPass(text)}
        value={pass}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        onChange={text => setEmail(text)}
        value={email}
      />
      <Button title="printdata" onPress={() => setDisplay(true)} />
      <View style={{ marginTop: 20 }}>
        <Button title="clear data" />
        <FlatList
          data={users}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      </View>

      {display ? (
        <View>
          <Text>user name: {name}</Text>
          <Text>pass {pass}</Text>
          <Text>Your Email :{email}</Text>
        </View>
      ) : null} */}

      {/* <View>
        {data.length ?
          data.map((item) =>
            <View>
              <Text>Id: {item.id}</Text>
              <Text>Title: {item.title}</Text>
              <Text>Body: {item.body}</Text>

            </View>
          ) : null

        }
      </View> */}
      <View>
        {data.length ? <FlatList
          data={data} renderItem={({ item }) => <View>
            <Text>{item.id}</Text>
            <Text>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>}
        /> : null
        }
      </View>

      {/* <View>
        {list.length ? list.map((item) => <View style={{ borderColor: 'red', borderWidth: 2 }}>
          <Text>
            {item.name}
          </Text>
          <Text>{item.id}</Text>
          <Text>
            {item.email}
          </Text>
        </View>) : null}

      </View> */}

      <View>
        <TouchableHighlight

          onPress={getap}>
          <Text>
            Save Data
          </Text>
        </TouchableHighlight>
      </View>
    </View >
  );
};

const User = prodddd => {
  return (
    <View style={{ margin: 20 }}>
      <Text>{prodddd.name}</Text>
      <Text>{prodddd.age}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
});
export default Test;
