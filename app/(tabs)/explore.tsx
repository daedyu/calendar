import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BannerAd, BannerAdSize, TestIds} from "@react-native-firebase/admob";

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

export default function explore() {

  useEffect(() => {
  }, []);

  return (
      <ScrollView style={styles.container}>
        <View style={styles.block}>
          <Text style={styles.title}>나의 목표</Text>
        </View>

      </ScrollView>
  );
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
