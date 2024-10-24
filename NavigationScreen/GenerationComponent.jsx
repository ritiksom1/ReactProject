import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Modal, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';

// Define constants for date range
const START_DATE = '2022-01-01';
const TODAY_DATE = new Date().toISOString().split('T')[0];

// Function to calculate total values based on range
const calculateTotal = (data) => {
  const total = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
  return total.toFixed(2); // Round to 2 decimal places
};

// Function to calculate average values based on range
const calculateAverage = (data, range) => {
  let total = parseFloat(calculateTotal(data));
  let count = data.datasets[0].data.length;

  if (count === 0) return '0.00'; // Handle empty data case

  switch (range) {
    case 'today':
      return (total / count).toFixed(2); // Average for today
    case 'week':
      return (total / (count / 7)).toFixed(2); // Example: assuming 7 data points per week
    case 'month':
      return (total / (count / 30)).toFixed(2); // Example: assuming 30 days per month
    case 'year':
      return (total / (count / 365)).toFixed(2); // Example: assuming 365 days per year
    case 'custom':
      return (total / count).toFixed(2); // Average for custom range
    default:
      return '0.00';
  }
};

// Custom Day Component
const CustomDay = ({ date, state, onPress }) => {
  const isAllowedDate = date >= START_DATE && date <= TODAY_DATE;

  const dayStyle = isAllowedDate ? styles.day : [styles.day, { opacity: 0.5 }];
  const textColor = state === 'selected' ? '#fff' : (isAllowedDate ? '#000' : '#d3d3d3');

  return (
    <TouchableOpacity 
      style={dayStyle} 
      onPress={isAllowedDate ? onPress : null} // Only allow press if date is allowed
    >
      <Text style={{ color: textColor }}>
        {date.split('-')[2]}
      </Text>
    </TouchableOpacity>
  );
};

const GenerationComponent = ({
  data,
  chartConfig,
  maxPower = 0, // Default to 0 if undefined
  selectedRange,
  setSelectedRange,
  hourlyAvgPower = 0, // Default to 0 if undefined
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ start: '', end: '' });
  const [dateSelecting, setDateSelecting] = useState(''); // 'start' or 'end'

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!selectedDate.start) {
      setSelectedDate({ start: today, end: today });
    }
    if (!selectedRange) {
      setSelectedRange('today');
    }
  }, [selectedDate, selectedRange, setSelectedDate, setSelectedRange]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    setCalendarVisible(false);
    const today = new Date().toISOString().split('T')[0];
    if (range === 'today') {
      setSelectedDate({ start: today, end: today });
    } else if (range === 'week') {
      const endDate = today;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // 6 days ago
      setSelectedDate({
        start: startDate.toISOString().split('T')[0],
        end: endDate,
      });
    } else if (range === 'month') {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of the month
      setSelectedDate({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      });
    } else if (range === 'year') {
      const startDate = new Date(new Date().getFullYear(), 0, 1);
      const endDate = new Date(new Date().getFullYear() + 1, 0, 0);
      setSelectedDate({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      });
    }
  };

  const handleDateSelect = (day) => {
    if (dateSelecting === 'start') {
      if (new Date(day.dateString) > new Date(selectedDate.end) || new Date(day.dateString) < new Date(START_DATE)) {
        Alert.alert('Invalid Date', 'Start date must be within the allowed range.');
        return;
      }
      setSelectedDate({
        ...selectedDate,
        start: day.dateString,
      });
      setDateSelecting('end'); // Move to selecting end date

      // Close modal immediately after setting the start date
      setCalendarVisible(false);
    } else if (dateSelecting === 'end') {
      if (new Date(day.dateString) < new Date(selectedDate.start) || new Date(day.dateString) > new Date(TODAY_DATE)) {
        Alert.alert('Invalid Date', 'End date cannot be earlier than start date or later than today.');
        return;
      }
      setSelectedDate({
        ...selectedDate,
        end: day.dateString,
      });
      setDateSelecting(''); // Reset dateSelecting
      setCalendarVisible(false); // Close the modal after selecting the end date
    }
  };

  const handleIconPress = (type) => {
    setDateSelecting(type); // Set which date is being selected
    setCalendarVisible(true); // Open the calendar modal
  };

  const handleCalendarIconPress = () => {
    if (selectedRange === 'custom') {
      setCalendarVisible(true); // Open calendar modal if custom range is selected
    }
  };

  const getDetails = () => {
    const title = `Generation Data`;
    const value = `${calculateTotal(data)} kWh`; // Total value with 2 decimal places
    const avgTitle = 'Average Generation';
    const avgValue = `${calculateAverage(data, selectedRange)} kWh`; // Average value with 2 decimal places
    const totalText = 'Total Generation';
    const totalValue = `${calculateTotal(data)} kWh`; // Total value with 2 decimal places

    return { title, value, avgTitle, avgValue, totalText, totalValue };
  };

  const { title, value, avgTitle, avgValue, totalText, totalValue } = getDetails();

  const getHeaderText = () => {
    switch (selectedRange) {
      case 'today':
        return "Today's Generation Energy";
      case 'week':
        return "Weekly Generation Energy";
      case 'month':
        return `Generation Energy for ${new Date().toLocaleString('default', { month: 'short' })}`; // Show current abbreviated month
      case 'year':
        return `Generation Energy for ${new Date().getFullYear()}`; // Show current year
      case 'custom':
        return "Custom Range Generation Energy";
      default:
        return "Generation Energy";
    }
  };

  const getDateText = () => {
    if (selectedRange === 'week') {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // 7 days before today
      return `${startDate.toISOString().split('T')[0]} - ${endDate}`;
    }
    if (selectedRange === 'month') {
      return new Date().toLocaleString('default', { month: 'short' }); // Show abbreviated month name
    }
    if (selectedRange === 'year') {
      return `${new Date().getFullYear()}`; // Show current year
    }
    return selectedDate.start || 'Select Date Range';
  };

  // Marked dates for selected start and end
  const markedDates = {
    [selectedDate.start]: { selected: true, selectedColor: '#186cbf' },
    [selectedDate.end]: { selected: true, selectedColor: '#186cbf' }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{getHeaderText()}</Text>
      <View style={styles.dateWrapper}>
        {selectedRange === 'custom' ? (
          <View style={styles.dateRangeContainer}>
            <TouchableOpacity onPress={() => handleIconPress('start')} style={styles.dateIconContainer}>
              <Text style={styles.dateText}>{selectedDate.start || 'Start Date'}</Text>
              <Icon name="calendar" size={24} color="#186cbf" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleIconPress('end')} style={styles.dateIconContainer}>
              <Text style={styles.dateText}>{selectedDate.end || 'End Date'}</Text>
              <Icon name="calendar" size={24} color="#186cbf" style={styles.icon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.dateIconContainer}>
            <Text style={styles.dateText}>{getDateText()}</Text>
            <TouchableOpacity onPress={handleCalendarIconPress}>
              <Icon name="calendar" size={24} color="#186cbf" style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.graphContainer}>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 40} // Adjust width based on screen size
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      <View style={styles.buttonContainer}>
        {['today', 'week', 'month', 'year', 'custom'].map((range, index) => (
          <TouchableOpacity
            key={range}
            onPress={() => handleRangeChange(range)}
            style={[
              styles.button,
              index === 0 && styles.buttonFirst,
              index === 4 && styles.buttonLast,
              selectedRange === range && styles.buttonSelected
            ]}
          >
            <Text style={[
              styles.buttonText,
              selectedRange === range && styles.buttonTextSelected
            ]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsWrapper}>
          <View style={styles.detailsTextContainer}>
            <Text style={styles.detailTitle}>{title}</Text>
            <Text style={styles.detailValue}>{value}</Text>
            <Text style={styles.detailTitle}>{totalText}</Text>
            <Text style={styles.detailValue}>{totalValue}</Text>
          </View>
          {(selectedRange === 'today' || selectedRange === 'week' || selectedRange === 'month' || selectedRange === 'year' || selectedRange === 'custom') && (
            <View style={styles.detailsTextContainer}>
              <Text style={styles.detailTitle}>{avgTitle}</Text>
              <Text style={styles.detailValue}>{avgValue}</Text>
            </View>
          )}
        </View>
      </View>
      <Modal
        transparent={true}
        visible={calendarVisible}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              markingType={'period'}
              dayComponent={({ date, state }) => (
                <CustomDay date={date.dateString} state={state} onPress={() => handleDateSelect(date)} />
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },
  headerText: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    width: '100%',
    marginBottom: 10,
  },
  dateWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '74%',
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  dateIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
    marginHorizontal: 5,
  },
  graphContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonFirst: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  buttonLast: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#3b3b3b',
  },
  buttonTextSelected: {
    color: '#fff',
  },
  buttonSelected: {
    backgroundColor: '#186cbf',
    borderColor: '#186cbf',
  },
  calendarWrapper: {
    position: 'absolute',
    left: 10,
    top: 70,
    width: Dimensions.get('window').width - 20,
    zIndex: 600,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  detailsContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  detailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  detailsTextContainer: {
    flex: 1,
    padding: 5,
  },
  detailTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#186cbf',
    fontWeight: '700',
    marginBottom: 9,
  },
  icon: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    padding: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 50,
  },
});

export default GenerationComponent;
