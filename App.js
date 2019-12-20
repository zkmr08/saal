import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar, TouchableOpacity, Image, ScrollView, AsyncStorage, Dimensions, Platform, TextInput, StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import CategoryList from './components/CategoryList';
import TodoList from './components/TodoList'
import uuidv1 from 'uuid/v1';
const { width } = Dimensions.get('window');
export default class App extends React.Component {
  state = {
    item: '',
    categoriesAreReady: false,
    todosAreReady: false,
    categories: {},
    todos: {},
    isSelectedCategory: false,
    selectedCategory: '',
  }
  saveCategories = newCategories => {
    const saveCategories = AsyncStorage.setItem('categories', JSON.stringify(newCategories));
  };
  saveTodos = (selectedCategory, newTodos) => {
    const saveTodos = AsyncStorage.setItem(selectedCategory, JSON.stringify(newTodos))
  }
  inputController = textValue => {
    this.setState({
      item: textValue,
    })
  }
  componentDidMount = () => {
    this.loadCategories();
  };

  loadCategories = async () => {
    try {
      const getCategories = await AsyncStorage.getItem('categories');
      const parsedCategories = JSON.parse(getCategories);
      this.setState({ categoriesAreReady: true, categories: parsedCategories || {} });
    } catch (err) {
      console.log(err);
    }
  };

  loadTodos = async () => {
    const { selectedCategory } = this.state
    try {
      const getTodos = await AsyncStorage.getItem(selectedCategory);
      const parsedTodos = JSON.parse(getTodos);
      this.setState({ todosAreReady: true, todos: parsedTodos || {} })
    } catch (err) {
      console.log(err);
    }
  }

  addCategory = () => {
    const { item } = this.state;
    if (item !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newCategoryObject = {
          [ID]: {
            id: ID,
            textValue: item,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          item: '',
          categories: {
            ...prevState.categories,
            ...newCategoryObject
          }
        };
        this.saveCategories(newState.categories);
        return { ...newState };
      });
    }
  };
  addTodo = () => {
    const { item, selectedCategory } = this.state;
    if (item !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            textValue: item,
            createdAt: Date.now(),
            category: selectedCategory,
          }
        };
        const newState = {
          ...prevState,
          item: '',
          todos: {
            ...prevState.todos,
            ...newTodoObject
          }
        };
        this.saveTodos(selectedCategory, newState.todos);
        return { ...newState };
      });
    }
  };
  deleteCategory = id => {
    this.setState(prevState => {
      const categories = prevState.categories;
      delete categories[id];
      const newState = {
        ...prevState,
        ...categories
      };
      this.saveCategories(newState.category);
      return { ...newState };
    });
  };
  deleteTodo = id => {
    const { selectedCategory } = this.state;
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this.saveTodos(selectedCategory, newState.todos);
      return { ...newState };
    });
  };

  inCompleteTodo = id => {
    const { selectedCategory } = this.state;
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
      this.saveTodos(selectedCategory, newState.todos);
      return { ...newState };
    });
  };

  completeTodo = id => {
    const { selectedCategory } = this.state;
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
      this.saveTodos(selectedCategory, newState.todos);
      return { ...newState };
    });
  };

  updateCategory = (id, textValue) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        categories: {
          ...prevState.categories,
          [id]: {
            ...prevState.categories[id],
            textValue: textValue
          }
        }
      };
      this.saveCategories(newState.categories);
      return { ...newState };
    });
  };

  updateTodo = (id, textValue) => {
    const { selectedCategory } = this.state;
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
      this.saveTodos(selectedCategory, newState.todos);
      return { ...newState };
    });
  };

  selectedCategory = (selectedValue) => {
    this.setState({
      isSelectedCategory: true,
      selectedCategory: selectedValue,
      todos: {},
    }, () => { this.loadTodos() }
    );
  }

  backToCategory = () => {
    this.setState({
      isSelectedCategory: false,
      selectedCategory: '',
    })
  }

  render() {
    let { item, isSelectedCategory, categoriesAreReady, todos, categories, selectedCategory } = this.state;
    if (!categoriesAreReady) {
      return <AppLoading />
    }
    return (
      <LinearGradient
        colors={['#DA4453', '#89216B']}
        style={styles.container}>
        <StatusBar barStyle="light-content" />

        {isSelectedCategory ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity activeOpacity={0.5} onPress={this.backToCategory}>
              <Image
                source={require('./back-button-image.png')}
                style={styles.ImageIconStyle}
              />
            </TouchableOpacity>
            <Text style={styles.appTitle}>{selectedCategory}</Text>
          </View>
        ) : (
            <Text style={styles.appTitle}>Categories</Text>
          )}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={isSelectedCategory ? 'Add a Todo!' : 'Add a Category'}
            value={item}
            onSubmitEditing={isSelectedCategory ? this.addTodo : this.addCategory}
            onChangeText={this.inputController}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.listContainer}>
            {isSelectedCategory ? (
              Object.values(todos).map(todo => <TodoList key={todo.id} {...todo} deleteTodo={this.deleteTodo} loadTodos={this.loadTodos} updateTodo={this.updateTodo} inCompleteTodo={this.inCompleteTodo} completeTodo={this.completeTodo} />)
            ) : (
                Object.values(categories).map(category => <CategoryList key={category.id} {...category} selectedCategory={this.selectedCategory} deleteCategory={this.deleteCategory} updateCategory={this.updateCategory} />)
              )}
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
  },
  ImageIconStyle: {
    width: 50,
    height: 50,
    marginTop: 60,
  },
  appTitle: {
    color: '#fff',
    fontSize: 36,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: '300',
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
  listContainer: {
    alignItems: 'center'
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
  },
});