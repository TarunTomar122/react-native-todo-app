import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from 'react-native';

import realm from '../database/realm';
import uuid from 'uuid-random';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      todos: [],
      text: '',
    };
  }

  componentDidMount() {
    // Get all todos from realm and setState
    this.setState({isLoading: true});
    let todos = realm.objects('Todo');
    this.setState({todos: todos, isLoading: false});
  }

  addTodo() {
    if (this.state.text.length > 0) {
      console.log('addTodo');
      this.setState({isLoading: true});

      let todo = {
        body: this.state.text,
        _id: uuid(),
      };

      realm.write(() => {
        realm.create('Todo', todo);
      });

      // get all todos from realm and setState
      let todos = realm.objects('Todo');
      this.setState({todos: todos, text: '', isLoading: false});
    }
  }

  async deleteTodo(id) {
    this.setState({isLoading: true});
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey('Todo', id));
    });

    // get all todos from realm and setState
    let todos = realm.objects('Todo');
    this.setState({todos: todos, isLoading: false});
  }

  renderTodos() {
    return this.state.todos.map((todo, i) => {
      return (
        <View
          key={i}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 20,
            padding: 10,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}>
          <Text style={{fontSize: 16}}>{todo.body}</Text>
          <TouchableOpacity
            style={{backgroundColor: 'gray', paddingHorizontal: 10}}
            onPress={() => this.deleteTodo(todo._id)}>
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              height: 50,
              borderColor: 'gray',
              borderWidth: 1,
              fontSize: 20,
              marginHorizontal: 10,
              padding: 10,
              width: '100%',
            }}
            placeholder="Add Todo"
            onChangeText={text => this.setState({text})}
            value={this.state.text}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#0066ff',
              padding: 10,
              margin: 10,
              width: '30%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.addTodo()}>
            <Text style={{color: '#fff', fontSize: 20}}>Add Todo</Text>
          </TouchableOpacity>
        </View>
        <View>
          {this.state.isLoading && (
            <ActivityIndicator size="large" color="red" />
          )}

          <ScrollView>{this.renderTodos()}</ScrollView>
        </View>
      </View>
    );
  }
}
