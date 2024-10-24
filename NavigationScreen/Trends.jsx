import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GenerationComponent from './GenerationComponent';
import PowercutComponent from './PowercutComponent';

const dataOptions = {
  today: {
    generation: {
      labels: ['Today'],
      datasets: [{ data: [1.2, 1.3, 1.8] }],
      maxPower: 1.8
    },
    powercut: {
      labels: ['Today'],
      datasets: [{ data: [0.1, 0.2, 0.1] }],
      maxPower: 0.2
    }
  },
  week: {
    generation: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [1.2, 1.3, 1.4, 1.1, 1.5, 1.6, 1.7] }],
      maxPower: 1.7
    },
    powercut: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8] }],
      maxPower: 0.8
    }
  },
  month: {
    generation: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [1.2, 1.3, 1.5, 1.6] }],
      maxPower: 1.6
    },
    powercut: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [0.5, 0.6, 0.7, 0.8] }],
      maxPower: 0.8
    }
  },
  year: {
    generation: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{ data: [1.2, 1.3, 1.4, 1.1, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2] }],
      maxPower: 2.2
    },
    powercut: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{ data: [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5] }],
      maxPower: 0.8
    }
  },
  custom: {
    generation: {
      labels: ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5', 'Jul 6', 'Jul 7'],
      datasets: [{ data: [0.75, 0.76, 0.77, 0.78, 0.79, 0.80, 0.81] }],
      maxPower: 0.8
    },
    powercut: {
      labels: ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5', 'Jul 6', 'Jul 7'],
      datasets: [{ data: [0.50, 0.52, 0.54, 0.56, 0.58, 0.60, 0.62] }],
      maxPower: 0.8
    }
  }
};

const Trends = () => {
  const [selectedRange, setSelectedRange] = useState('week');
  const [graphType, setGraphType] = useState('generation');
  const [selectedRange1, setSelectedRange1] = useState('month');
 
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ start: '', end: '' });

  const generationData = dataOptions[selectedRange].generation;
  const powercutData = dataOptions[selectedRange1].powercut;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(24, 108, 191, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            graphType === 'generation' && styles.activeButton,
            styles.leftRounded
          ]}
          onPress={() => setGraphType('generation')}
        >
          <Text style={styles.headerButtonText}>Generation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerButton,
            graphType === 'powercut' && styles.activeButton,
            styles.rightRounded
          ]}
          onPress={() => setGraphType('powercut')}
        >
          <Text style={styles.headerButtonText}>Powercut</Text>
        </TouchableOpacity>
      </View>

      {graphType === 'generation' ? (
        <GenerationComponent 
          data={generationData} 
          chartConfig={chartConfig} 
          maxPower={generationData.maxPower}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          calendarVisible={calendarVisible}
          setCalendarVisible={setCalendarVisible}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        <PowercutComponent 
          data={powercutData} 
          chartConfig={chartConfig} 
          maxPower={powercutData.maxPower}
          selectedRange={selectedRange1}
          setSelectedRange={setSelectedRange1}
          calendarVisible={calendarVisible}
          setCalendarVisible={setCalendarVisible}
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  headerButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    borderWidth: 1.5,
    borderColor: '#186cbf',
  },
  leftRounded: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  rightRounded: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7, 
  },
  activeButton: {
    backgroundColor: '#186cbf',
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Trends;