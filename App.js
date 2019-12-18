import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar, ScrollView, AsyncStorage, Dimensions, Platform, TextInput, StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import TodoList from './components/TodoList';
import uuidv1 from 'uuid/v1';
const { height, width } = Dimensions.get('window');
export default class App extends React.Component {
  state = {
    newTodoItem: '',
    dataIsReady: false,
    todos: {},
  }
  saveTodos = newToDos => {
    const saveTodos = AsyncStorage.setItem('todos', JSON.stringify(newToDos));
  };
  newTodoItemController = textValue => {
    this.setState({
      newTodoItem: textValue,
    })
  }
  componentDidMount = () => {
    this.loadTodos();
  };

  loadTodos = async () => {
    try {
      const getTodos = await AsyncStorage.getItem('todos');
      const parsedTodos = JSON.parse(getTodos);
      this.setState({ dataIsReady: true, todos: parsedTodos || {} });
    } catch (err) {
      console.log(err);
    }
  };

  addTodo = () => {
    const { newTodoItem } = this.state;
    if (newTodoItem !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            textValue: newTodoItem,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodoItem: '',
          todos: {
            ...prevState.todos,
            ...newToDoObject
          }
        };
        this.saveTodos(newState.todos);
        return { ...newState };
      });
    }
  };
  deleteTodo = id => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };
  inCompleteTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };

  completeTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };

  updateTodo = (id, textValue) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            textValue: textValue
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };
  render() {
    let { newTodoItem, dataIsReady, todos } = this.state;
    if (!dataIsReady) {
      return <AppLoading />
    }
    return (
      <LinearGradient
        colors={['#DA4453', '#89216B']}
        style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.appTitle}>Todo App</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={'Add an item!'}
            value={newTodoItem}
            onSubmitEditing={this.addTodo}
            onChangeText={this.newTodoItemController}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.listContainer}>
            {Object.values(todos).map(todo => <TodoList key={todo.id} {...todo} deleteTodo={this.deleteTodo} updateTodo={this.updateTodo} inCompleteTodo={this.inCompleteTodo} completeTodo={this.completeTodo} />)}
          </ScrollView>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f23657',
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: 36,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: '300'
  },

  card: {
    backgroundColor: '#fff',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 24
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 5
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 24
  },
  listContainer: {
    alignItems: 'center'
  }
});
