import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

class TodoList extends Component {
    static propTypes = {
        textValue: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        inCompleteTodo: PropTypes.func.isRequired,
        completeTodo: PropTypes.func.isRequired,
        updateTodo: PropTypes.func.isRequired,
        loadTodos: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            todoValue: props.textValue
        };
    }

    componentDidMount = () => {
        const { loadTodos } = this.props;
        loadTodos();
    };

    toggleTodo = () => {
        const { isCompleted, inCompleteTodo, completeTodo, id } = this.props;
        if (isCompleted) {
            inCompleteTodo(id);
        } else {
            completeTodo(id);
        }
    }
    startEditing = () => {
        this.setState({
            isEditing: true,
        });
    }
    controlInput = textValue => {
        this.setState({ todoValue: textValue })
    }
    finishEditing = () => {
        const { todoValue } = this.state;
        const { id, updateTodo } = this.props;
        updateTodo(id, todoValue);
        this.setState({
            isEditing: false,
        });
    }

    render() {
        const { isEditing, todoValue } = this.state
        const { textValue, id, deleteTodo, isCompleted } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <TouchableOpacity onPress={this.toggleTodo}>
                        <View style={[styles.circle, isCompleted ? styles.completeCircle : styles.incompleteCircle]} />
                    </TouchableOpacity>
                    {
                        isEditing ? (
                            <TextInput
                                value={todoValue}
                                style={[
                                    styles.text,
                                    styles.input,
                                    isCompleted ? styles.strikeText : styles.unstrikeText
                                ]}
                                multiline={true}
                                returnKeyType={'done'}
                                onBlur={this.finishEditing}
                                onChangeText={this.controlInput}
                            />
                        ) : (
                                <Text
                                    style={[
                                        styles.text,
                                        isCompleted ? styles.strikeText : styles.unstrikeText
                                    ]}
                                >
                                    {textValue}
                                </Text>
                            )
                    }
                </View>
                {isEditing ? (
                    <View style={styles.buttons}>
                        <TouchableOpacity onPressOut={this.finishEditing}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>✅</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View style={styles.buttons}>
                            <TouchableOpacity onPressOut={this.startEditing}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>✏</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={() => deleteTodo(id)}>
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontWeight: '500',
        fontSize: 18,
        marginVertical: 20,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 3,
        marginRight: 20
    },
    completeCircle: {
        borderColor: '#bbb'
    },
    incompleteCircle: {
        borderColor: '#DA4453'
    },
    strikeText: {
        color: '#bbb',
        textDecorationLine: 'line-through'
    },
    unstrikeText: {
        color: "#29323c"
    },
    rowContainer: {
        flexDirection: 'row',
        width: width / 2,
        alignItems: 'center',
    },
    buttons: {
        flexDirection: 'row',
    },
    buttonContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    input: {
        marginVertical: 20,
        width: width / 2,
        paddingBottom: 5
    }
});

export default TodoList;