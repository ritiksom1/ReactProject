import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image, Dimensions, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import Geolocation from 'react-native-geolocation-service';


const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [1.2, 1.3, 1.4, 1.1, 1.5, 1.6, 1.7],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Line color
      strokeWidth: 2 // Line width
    }
  ],
  legend: ['KW Usage'] // Optional
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  style: {
    borderRadius: 16
  }
};

const Dashboard = () => {
  
  const [location, setLocation] = useState('Loading...');
  const [weather, setWeather] = useState({
    current: {
      description: 'Fetching...',
      icon: null
    },
    today: {
      description: 'Fetching...',
      icon: null
    },
    tomorrow: {
      description: 'Fetching...',
      icon: null
    }
  });

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLocation('Permission denied');
        }
      } catch (err) {
        console.warn(err);
        setLocation('Error requesting permission');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            setLocation(data.city || 'Unknown');
          })
          .catch(error => {
            console.error(error);
            setLocation('Error fetching location');
          });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=cc051a8e179295798b020916d17c8d17&units=metric`)
          .then(response => response.json())
          .then(data => {
            if (data.list && data.list.length > 0) {
              const currentWeather = data.list[0];
              const todayWeather = data.list[1];
              const tomorrowWeather = data.list[2];
              setWeather({
                current: {
                  description: currentWeather.weather[0].description || 'No description available',
                  icon: currentWeather.weather[0].icon ? `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png` : null
                },
                today: {
                  description: todayWeather.weather[0].description || 'No description available',
                  icon: todayWeather.weather[0].icon ? `http://openweathermap.org/img/wn/${todayWeather.weather[0].icon}.png` : null
                },
                tomorrow: {
                  description: tomorrowWeather.weather[0].description || 'No description available',
                  icon: tomorrowWeather.weather[0].icon ? `http://openweathermap.org/img/wn/${tomorrowWeather.weather[0].icon}.png` : null
                }
              });
            } else {
              setWeather({
                current: {
                  description: 'No weather data available',
                  icon: null
                },
                today: {
                  description: 'No weather data available',
                  icon: null
                },
                tomorrow: {
                  description: 'No weather data available',
                  icon: null
                }
              });
            }
          })
          .catch(error => {
            console.error(error);
            setWeather({
              current: {
                description: 'Error fetching weather',
                icon: null
              },
              today: {
                description: 'Error fetching weather',
                icon: null
              },
              tomorrow: {
                description: 'Error fetching weather',
                icon: null
              }
            });
          });
      },
      (error) => {
        console.error(error);
        setLocation('Error getting location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#186cbf" />
      <ScrollView contentContainerStyle={styles.scrollView}>
      

        <LinearGradient
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 1.3 }}
          colors={['#1a78d4', '#1a78d4', '#ffffff']}
          style={styles.gradient}
        >
          <View style={styles.updateContainer}>
            <Text style={styles.updateText}>Last Updated: 27-Aug-2020 04:02 PM</Text>
          </View>

          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Icon name="sun" type="feather" size={62} color="yellow" containerStyle={styles.iconContainer} />
              <Text style={styles.cardTitle}>Solar Generation</Text>
              <Text style={styles.cardValue}>1.073 KW</Text>
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.card}>
              <FontAwesome name="battery-full" size={62} color="orange" style={styles.iconContainer} />
              <Text style={styles.cardTitle}>Battery Charge</Text>
              <Text style={styles.cardValue}>100 %</Text>
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.card}>
              <Icon name="power" type="feather" size={62} color="lightgreen" containerStyle={styles.iconContainer} />
              <Text style={styles.cardTitle}>Grid Power</Text>
              <Text style={styles.cardValue}>ON</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.energyContainer}>
          <View style={styles.energyItem}>
            <View style={styles.circle} />
            <Text style={styles.energyText}>Energy Produced Today</Text>
          </View>
          <View style={styles.energyValueContainer}>
            <Text style={styles.energyValue}>4.5 KWH</Text>
          </View>
        </View>

        <View style={styles.voltageContainer}>
          <View style={styles.voltageItem}>
            <View style={styles.voltageTextContainer}>
              <View style={styles.circle1} />
              <Text style={styles.voltageText}>Input Voltage</Text>
            </View>
            <View style={styles.voltageImageContainer}>
              <Image source={require('../NavigationScreen/Images/voltagephoto.jpg')} style={styles.icon} />
            </View>
            <View style={styles.voltageValueContainer}>
              <Text style={styles.voltageValue}>230.4</Text>
              <Text style={styles.voltageValue1}>volt</Text>
            </View>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.voltageItem}>
            <View style={styles.voltageTextContainer}>
              <View style={styles.circle1} />
              <Text style={styles.voltageText}>Time to Charge</Text>
            </View>
            <View style={styles.voltageImageContainer}>
              <Image source={require('../NavigationScreen/Images/charge.png')} style={styles.icon} />
            </View>
            <View style={styles.voltageValueContainer}>
              <Text style={styles.voltageValue}>00 :05</Text>
              <Text style={styles.voltageValue1}>Hr : Min</Text>
            </View>
          </View>
        </View>

        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTitle}>
            <Text style={styles.weatherTitleLight}>Weather in your Area:</Text> <Text style={styles.weatherTitleBlack}>{location}</Text>
          </Text>
          <View style={styles.separator} />

          <View style={styles.weatherContent}>
           
            <View style={styles.weatherItem}>
              <Text style={styles.weatherText}>Today</Text>
              <View style={styles.weatherIconContainer}>
                {weather.today.icon ? <Image source={{ uri: weather.today.icon }} style={styles.weatherIcon} /> : <Text style={styles.weatherText}>No Icon</Text>}
                <Text style={styles.weatherDescription}>{weather.today.description || 'No description available'}</Text>
              </View>
            </View>
            <View style={styles.weatherVerticalLine} />
            <View style={styles.weatherItem}>
              <Text style={styles.weatherText}>Tomorrow</Text>
              <View style={styles.weatherIconContainer}>
                {weather.tomorrow.icon ? <Image source={{ uri: weather.tomorrow.icon }} style={styles.weatherIcon} /> : <Text style={styles.weatherText}>No Icon</Text>}
                <Text style={styles.weatherDescription}>{weather.tomorrow.description || 'No description available'}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>KW Usage</Text>
          <View style={styles.graphWrapper}>
            <LineChart
              data={data}
              width={screenWidth * 0.9} // Use 90% of screen width
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.graph}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e90ff',
  },
  scrollView: {
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  gradient: {
    padding: 10,
    marginBottom: 10,
  },
  updateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  updateText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'right',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  cardValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10%',
  },
  iconContainer: {
    marginBottom: 16,
  },
  verticalLine: {
    width: 2.5,
    backgroundColor: '#dcdcdc',
    height: '100%',
  },
  separator: {
    height: 1.8,
    backgroundColor: '#dcdcdc',
    marginVertical: 10,
    width: '70%',
    alignSelf: 'center',
  },
  energyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingVertical: '5%',
    backgroundColor: '#ffffff',
    borderTopWidth: 2.5,
    borderTopColor: '#dcdcdc',
    borderRadius: 10,
    borderLeftWidth: 9,
    borderLeftColor: '#8ebd8a',
    marginBottom: 20,
    marginTop: 10,
    margin: '4%',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1.2,
    shadowRadius: 10,
    elevation: 8,
  },
  energyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  energyValueContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 9,
    backgroundColor: 'lightgreen',
    marginRight: 10,
  },
  energyText: {
    fontSize: 16,
    color: 'gray',
  },
  energyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#186cbf',
  },
  voltageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: '4%',
  },
  voltageItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: '2%',
  },
  voltageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  voltageImageContainer: {
    marginBottom: 10,
  },
  voltageText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  icon: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 70,
  },
  voltageValueContainer: {
    marginBottom: 10,
  },
  voltageValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#186cbf',
    textAlign: 'center',
  },
  voltageValue1: {
    fontSize: 19,
    color: 'black',
    textAlign: 'center',
  },
  circle1: {
    width: 13,
    height: 13,
    borderRadius: 9,
    backgroundColor: 'lightgreen',
    marginRight: 10,
  },
  weatherContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderColor: '#dcdcdc',
    borderRightWidth: 4,
    borderLeftColor: 'dark',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: '4%',
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowOffset: { width: 1.5, height: 7 },
    shadowOpacity: 1.2,
    shadowRadius: 10,
    elevation: 7,
  },
  weatherTitle: {
    fontSize: 18,
    color: '#186cbf',
    marginBottom: 5,
    textAlign: 'center',
  },
  weatherTitleLight: {
    color: 'gray',
  },
  weatherTitleBlack: {
    color: 'black',
    fontWeight: 'bold',
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: '5%',  // Ensure some padding for better spacing
  },
  weatherItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: '1%',
    position: 'relative',
    justifyContent: 'center',
  },
  weatherCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',  // Center align the text and circle
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 65,  // Adjusted size for better visibility
    height: 65,
    marginBottom: 5,  // Added margin for spacing between icon and description
  },
  weatherText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,  // Reduced margin to decrease space
  },
  weatherDescription: {
    fontSize: 16,
    color: '#186cbf',
  },
  weatherVerticalLine: {
    width: 2.5,
    backgroundColor: '#dcdcdc',
    height: '84%',  // Ensured it spans the full height of the container
  },
  graphContainer: {
    padding: 10,
    marginBottom: 20,
    marginHorizontal: '4%',
  },
  graphTitle: {
    fontSize: 18,
    color: '#186cbf',
    marginBottom: 10,
    textAlign: 'center',
  },
  graphWrapper: {
    alignItems: 'center',
  },
  graph: {
    borderRadius: 16,
  },
});

export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Modal } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { Calendar } from 'react-native-calendars';
// import Icon from 'react-native-vector-icons/FontAwesome';

// // Function to calculate total values based on range
// const calculateTotal = (data) => {
//   return data.datasets[0].data.reduce((acc, value) => acc + value, 0);
// };

// // Function to calculate average values based on range
// const calculateAverage = (data, range) => {
//   let total = calculateTotal(data);
//   let count = data.datasets[0].data.length;

//   if (count === 0) return 0;

//   switch (range) {
//     case 'today':
//       return total / count; // Average for today
//     case 'week':
//       return total / (count / 7); // Example: assuming 7 data points per week
//     case 'month':
//       return total / (count / 30); // Example: assuming 30 days per month
//     case 'year':
//       return total / (count / 365); // Example: assuming 365 days per year
//     case 'custom':
//       return total / count; // Average for custom range
//     default:
//       return 0;
//   }
// };

// const GenerationComponent = ({
//   data,
//   chartConfig,
//   maxPower = 0, // Default to 0 if undefined
//   selectedRange,
//   setSelectedRange,
//   hourlyAvgPower = 0, // Default to 0 if undefined
// }) => {
//   const [calendarVisible, setCalendarVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState({ start: '', end: '' });
//   const [dateSelecting, setDateSelecting] = useState(''); // 'start' or 'end'

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0];
//     if (!selectedDate.start) {
//       setSelectedDate({ start: today, end: today });
//     }
//     if (!selectedRange) {
//       setSelectedRange('today');
//     }
//   }, [selectedDate, selectedRange, setSelectedDate, setSelectedRange]);

//   const handleRangeChange = (range) => {
//     setSelectedRange(range);
//     setCalendarVisible(false);
//     const today = new Date().toISOString().split('T')[0];
//     if (range === 'today') {
//       setSelectedDate({ start: today, end: today });
//     } else if (range === 'week') {
//       const endDate = today;
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - 6); // 6 days ago
//       setSelectedDate({
//         start: startDate.toISOString().split('T')[0],
//         end: endDate,
//       });
//     } else if (range === 'month') {
//       const startDate = new Date();
//       startDate.setDate(1);
//       const endDate = new Date();
//       endDate.setMonth(endDate.getMonth() + 1);
//       endDate.setDate(0); // Last day of the month
//       setSelectedDate({
//         start: startDate.toISOString().split('T')[0],
//         end: endDate.toISOString().split('T')[0],
//       });
//     } else if (range === 'year') {
//       const startDate = new Date(new Date().getFullYear(), 0, 1);
//       const endDate = new Date(new Date().getFullYear() + 1, 0, 0);
//       setSelectedDate({
//         start: startDate.toISOString().split('T')[0],
//         end: endDate.toISOString().split('T')[0],
//       });
//     }
//   };

//   const handleDateSelect = (day) => {
//     if (dateSelecting === 'start') {
//       setSelectedDate({
//         ...selectedDate,
//         start: day.dateString,
//       });
//       setDateSelecting('end'); // Move to selecting end date

//       // Close modal immediately after setting the start date
//       setCalendarVisible(false);
//     } else if (dateSelecting === 'end') {
//       setSelectedDate({
//         ...selectedDate,
//         end: day.dateString,
//       });
//       setDateSelecting(''); // Reset dateSelecting
//       setCalendarVisible(false);
//       // Optionally, close the modal after selecting the end date
//       // setCalendarVisible(false); // Uncomment if you want to close the modal after end date
//     }
//   };

//   const handleIconPress = (type) => {
//     setDateSelecting(type); // Set which date is being selected
//     setCalendarVisible(true); // Open the calendar modal
//   };

//   const handleCalendarIconPress = () => {
//     if (selectedRange === 'custom') {
//       setCalendarVisible(true); // Open calendar modal if custom range is selected
//     }
//   };

//   const getDetails = () => {
//     const title = `Generation Data`;
//     const value = `${calculateTotal(data)} kWh`;
//     const avgTitle = 'Average Generation';
//     const avgValue = `${calculateAverage(data, selectedRange)} kWh`;
//     const totalText = 'Total Generation';
//     const totalValue = `${calculateTotal(data)} kWh`;

//     return { title, value, avgTitle, avgValue, totalText, totalValue };
//   };

//   const { title, value, avgTitle, avgValue, totalText, totalValue } = getDetails();

//   const getHeaderText = () => {
//     switch (selectedRange) {
//       case 'today':
//         return "Today's Generation Energy";
//       case 'week':
//         return "Weekly Generation Energy";
//       case 'month':
//         return `Generation Energy for ${new Date().toLocaleString('default', { month: 'short' })}`; // Show current abbreviated month
//       case 'year':
//         return `Generation Energy for ${new Date().getFullYear()}`; // Show current year
//       case 'custom':
//         return "Custom Range Generation Energy";
//       default:
//         return "Generation Energy";
//     }
//   };

//   const getDateText = () => {
//     if (selectedRange === 'week') {
//       const endDate = new Date().toISOString().split('T')[0];
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - 6); // 7 days before today
//       return `${startDate.toISOString().split('T')[0]} - ${endDate}`;
//     }
//     if (selectedRange === 'month') {
//       return new Date().toLocaleString('default', { month: 'short' }); // Show abbreviated month name
//     }
//     if (selectedRange === 'year') {
//       return `${new Date().getFullYear()}`; // Show current year
//     }
//     return selectedDate.start || 'Select Date Range';
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>{getHeaderText()}</Text>
//       <View style={styles.dateWrapper}>
//         {selectedRange === 'custom' ? (
//           <View style={styles.dateRangeContainer}>
//             <TouchableOpacity onPress={() => handleIconPress('start')} style={styles.dateIconContainer}>
//               <Text style={styles.dateText}>{selectedDate.start || 'Start Date'}</Text>
//               <Icon name="calendar" size={24} color="#186cbf" style={styles.icon} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleIconPress('end')} style={styles.dateIconContainer}>
//               <Text style={styles.dateText}>{selectedDate.end || 'End Date'}</Text>
//               <Icon name="calendar" size={24} color="#186cbf" style={styles.icon} />
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={styles.dateIconContainer}>
//             <Text style={styles.dateText}>{getDateText()}</Text>
//             <TouchableOpacity onPress={handleCalendarIconPress}>
//               <Icon name="calendar" size={24} color="#186cbf" style={styles.icon} />
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//       <View style={styles.graphContainer}>
//         <LineChart
//           data={data}
//           width={Dimensions.get('window').width - 40} // Adjust width based on screen size
//           height={220}
//           chartConfig={chartConfig}
//           bezier
//           style={styles.chart}
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         {['today', 'week', 'month', 'year', 'custom'].map((range, index) => (
//           <TouchableOpacity
//             key={range}
//             onPress={() => handleRangeChange(range)}
//             style={[
//               styles.button,
//               index === 0 && styles.buttonFirst,
//               index === 4 && styles.buttonLast,
//               selectedRange === range && styles.buttonSelected
//             ]}
//           >
//             <Text style={[
//               styles.buttonText,
//               selectedRange === range && styles.buttonTextSelected
//             ]}>
//               {range.charAt(0).toUpperCase() + range.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={styles.detailsContainer}>
//         <View style={styles.detailsWrapper}>
//           <View style={styles.detailsTextContainer}>
//             <Text style={styles.detailTitle}>{title}</Text>
//             <Text style={styles.detailValue}>{value}</Text>
//             <Text style={styles.detailTitle}>{totalText}</Text>
//             <Text style={styles.detailValue}>{totalValue}</Text>
//           </View>
//           {(selectedRange === 'today' || selectedRange === 'week' || selectedRange === 'month' || selectedRange === 'year' || selectedRange === 'custom') && (
//             <View style={styles.detailsTextContainer}>
//               <Text style={styles.detailTitle}>{avgTitle}</Text>
//               <Text style={styles.detailValue}>{avgValue}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//       <Modal
//         transparent={true}
//         visible={calendarVisible}
//         animationType="slide"
//         onRequestClose={() => setCalendarVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Calendar
//               onDayPress={handleDateSelect}
//               markedDates={{
//                 [selectedDate.start]: { selected: true, selectedColor: '#186cbf' },
//                 [selectedDate.end]: { selected: true, selectedColor: '#186cbf' }
//               }}
//               markingType={'period'}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     width: '100%',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//     marginVertical: 10,
//   },
//   headerText: {
//     fontSize: 14.5,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'left',
//     width: '100%',
//     marginBottom: 10,
//   },
//   dateWrapper: {
//     width: '100%',
//     alignItems: 'flex-start',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   dateRangeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     width: '74%',
//     backgroundColor: '#ccc',
//     borderRadius: 6,
//   },
//   dateIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     backgroundColor: '#ccc',
//     borderRadius: 5,
//     padding: 5,
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#000',
//     marginHorizontal: 5,
//   },
//   graphContainer: {
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   chart: {
//     borderRadius: 16,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   button: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 40,
//     backgroundColor: '#ccc',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   buttonFirst: {
//     borderTopLeftRadius: 5,
//     borderBottomLeftRadius: 5,
//   },
//   buttonLast: {
//     borderTopRightRadius: 5,
//     borderBottomRightRadius: 5,
//   },
//   buttonText: {
//     fontSize: 14,
//     color: '#3b3b3b',
//   },
//   buttonTextSelected: {
//     color: '#fff',
//   },
//   buttonSelected: {
//     backgroundColor: '#186cbf',
//     borderColor: '#186cbf',
//   },
//   calendarWrapper: {
//     position: 'absolute',
//     left: 10,
//     top: 70,
//     width: Dimensions.get('window').width - 20,
//     zIndex: 600,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//   },
//   detailsContainer: {
//     width: '100%',
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   detailsWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     alignItems: 'flex-start',
//   },
//   detailsTextContainer: {
//     flex: 1,
//     padding: 5,
//   },
//   detailTitle: {
//     fontSize: 15,
//     color: '#000',
//     marginBottom: 4,
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#186cbf',
//     fontWeight: '700',
//     marginBottom: 9,
//   },
//   icon: {
//     backgroundColor: '#ccc',
//     borderRadius: 20,
//     padding: 3,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     width: '90%',
//     maxWidth: 400,
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
// });

// export default GenerationComponent;
