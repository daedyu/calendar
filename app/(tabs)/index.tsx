import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Setting from "@/components/firstJoin/Setting";
import {useNavigation} from "@react-navigation/core";

LocaleConfig.locales['ko'] = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
    dayNamesShort: ['일', '월','화','수','목','금','토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

// DateObject 타입 정의
interface DateObject {
    day: number;
    month: number;
    year: number;
    timestamp: number;
    dateString: string;
}

// 마킹된 날짜의 타입 선언
interface MarkedDates {
    [date: string]: {
        marked: boolean;
        dotColor: string;
    };
}

export default function HomeScreen() {
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [streak, setStreak] = useState<number>(0);
    const [maxStreak, setMaxStreak] = useState<number>(0);
    const [joined, setJoined] = useState<boolean>(false);
    const navigation = useNavigation();
    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    useEffect(() => {
        loadJoined();
    }, []);

    useLayoutEffect(() => {
        // 특정 조건에 따라 탭바 숨기기
        navigation.setOptions({
            tabBarStyle: { display: joined ? 'flex' : 'none' },
        });
    }, [navigation, joined]);

    useEffect(() => {
        loadSuccessDays();
        loadMaxStreak();
    }, []);

    useEffect(() => {
        calculateStreak();
    }, [markedDates]);

    const loadJoined = async () => {
        try {
            const join = await AsyncStorage.getItem('joined');

            if (join) {
                const joinedValue = JSON.parse(join);
                setJoined(joinedValue);
            } else {
                console.log(joined)
            }
        } catch (e) {
            console.log(e)
        }
    }

    // 저장된 성공일 불러오기
    const loadSuccessDays = async () => {
        try {
            const storedDays = await AsyncStorage.getItem('successDays');
            if (storedDays) {
                setMarkedDates(JSON.parse(storedDays));
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 최대 성공일수 불러오기
    const loadMaxStreak = async () => {
        try {
            const storedMaxStreak = await AsyncStorage.getItem('maxStreak');
            if (storedMaxStreak) {
                setMaxStreak(Number(storedMaxStreak));
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 연속 성공일수 계산
    const calculateStreak = async () => {
        const today = new Date();
        const todayString = formatDate(today);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayString = formatDate(yesterday);

        let streakCount = 0;
        let checkingDate: Date;

        if (markedDates[todayString]) {
            checkingDate = new Date(today);
        } else if (markedDates[yesterdayString]) {
            checkingDate = new Date(yesterday);
        } else {
            setStreak(0);
            return;
        }

        const dates = Object.keys(markedDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        for (const date of dates) {
            if (formatDate(checkingDate) === date) {
                streakCount++;
                checkingDate.setDate(checkingDate.getDate() - 1);
            } else {
                break;
            }
        }

        setStreak(streakCount);

        // 최대 성공일수 업데이트
        if (streakCount > maxStreak) {
            setMaxStreak(streakCount);
            try {
                await AsyncStorage.setItem('maxStreak', streakCount.toString());
            } catch (e) {
                console.log(e);
            }
        }
    };

    // 날짜 선택 및 저장
    const toggleSuccessDay = async (day: DateObject) => {
        const today = new Date();
        const selectedDate = new Date(day.dateString);
        const formattedToday = formatDate(today);
        const formattedSelectedDate = formatDate(selectedDate);

        if (formattedSelectedDate !== formattedToday) {
            Alert.alert('알림', '오늘 날짜만 선택할 수 있습니다.');
            return;
        }

        const dateKey = day.dateString;
        const newMarkedDates = { ...markedDates };

        if (newMarkedDates[dateKey]) {
            delete newMarkedDates[dateKey]; // 성공 해제
        } else {
            newMarkedDates[dateKey] = { marked: true, dotColor: 'green' }; // 성공 체크
        }

        // 상태 업데이트 및 데이터 저장
        setMarkedDates(newMarkedDates);

        try {
            await AsyncStorage.setItem('successDays', JSON.stringify(newMarkedDates));
        } catch (e) {
            console.log(e);
        }
    };

    if (joined) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.block}>
                    <Text style={styles.title}>연속 성공일수</Text>
                    <Text style={styles.streak}>{streak}일</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>최대 성공일수</Text>
                    <Text style={styles.streak}>{maxStreak}일</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>성공 체크</Text>
                    <Calendar
                        markedDates={markedDates}
                        onDayPress={(day) => {
                            toggleSuccessDay(day);
                        }}
                        theme={{
                            calendarBackground: '#F5F5F5',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: 'green',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: 'green',
                            arrowColor: 'green',
                            monthTextColor: 'black',
                            indicatorColor: 'green',
                            textDayFontFamily: 'monospace',
                            textMonthFontFamily: 'monospace',
                            textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                        }}
                        locale="ko" // 로케일 설정
                    />
                </View>
            </ScrollView>
        );
    } else {
        return (
            <Setting setJoined={setJoined}></Setting>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingTop: 40, // 헤더와 겹치지 않게 여백 추가
    },
    block: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2, // Android용 그림자 효과
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    streak: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});
