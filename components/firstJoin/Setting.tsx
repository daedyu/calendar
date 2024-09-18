import {Keyboard, Pressable, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingProps {
    setJoined: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Setting({ setJoined }: SettingProps) {
    const [value, setValue] = useState<string>('');
    const [isTouched, setIsTouched] = useState<boolean>(false);

    const setFuture = async () => {
        try {
            await AsyncStorage.setItem('future', JSON.stringify(value));
            await AsyncStorage.setItem('joined', JSON.stringify(true));
            setJoined(true);
        } catch (e) {
            console.log(e);
        }
    }

    const handlePress = () => {
        if (value.trim() === '') {
            setIsTouched(true);
        } else {
            setIsTouched(false);
            Alert.alert(
                value,
                "이 꿈을 이룰것인가요?",
                [
                    {text: '취소', onPress: () => {}, style: 'cancel'},
                    {text: '확인', onPress: () => {setFuture()}, style: 'default'},
                ],
                {
                    cancelable: true,
                    onDismiss: () => {},
                },
            )
        }
        Keyboard.dismiss();
    };

    return (
        <Pressable style={styles.pressable} onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>당신의 목표를 입력하세요</Text>
                <TextInput
                    style={[styles.input, isTouched && value.trim() === '' ? styles.inputError : null]}
                    value={value}
                    onChangeText={setValue}
                    onBlur={() => setIsTouched(true)}
                    placeholder="목표를 입력하세요"
                    placeholderTextColor="#dcdcdc"
                />
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>시작하기</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        marginTop: 150,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    input: {
        marginTop: 20,
        width: '80%',
        backgroundColor: '#FFFFFF',
        height: 50,
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputError: {
        borderColor: '#ff0000',
    },
    button: {
        marginTop: 20,
        width: '50%',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
