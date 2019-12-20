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

class CategoryList extends Component {
    static propTypes = {
        textValue: PropTypes.string.isRequired,
        selectedCategory: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        deleteCategory: PropTypes.func.isRequired,
        updateCategory: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            categoryValue: props.textValue
        };
    }
    startEditing = () => {
        this.setState({
            isEditing: true,
        });
    }
    controlInput = textValue => {
        this.setState({ categoryValue: textValue })
    }
    finishEditing = () => {
        const { categoryValue } = this.state;
        const { id, updateCategory } = this.props;
        updateCategory(id, categoryValue);
        this.setState({
            isEditing: false
        });
    }

    render() {
        const { isEditing, categoryValue } = this.state
        const { textValue, id, deleteCategory, selectedCategory } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    {
                        isEditing ? (
                            <TextInput
                                value={categoryValue}
                                style={[
                                    styles.text,
                                    styles.input,
                                ]}
                                multiline={true}
                                returnKeyType={'done'}
                                onBlur={this.finishEditing}
                                onChangeText={this.controlInput}
                            />
                        ) : (
                                <Text
                                    onPress={()=> selectedCategory(textValue)}
                                    style={[
                                        styles.text,
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
                            <TouchableOpacity onPressOut={() => deleteCategory(id)}>
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
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 20,
        marginLeft: 20,
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

export default CategoryList;