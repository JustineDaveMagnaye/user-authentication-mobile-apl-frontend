import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; 

function LogScreen() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeNumber, setEmployeeNumber] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const handleFilterChange = (value) => setFilter(value);

  const getUserLogs = async () => {
    setLoading(true);
    try {
      const employeeNumber = await AsyncStorage.getItem('@employee_number');
      setEmployeeNumber(employeeNumber);
      const token = await AsyncStorage.getItem('@token');
      const payload = {
        employee: {
          employeeNumber: employeeNumber
        }
      };
      const response = await axios.post(
        'https://rcauthy.serveo.net/time-record/getUserLogs',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Sort logs based on sortOrder
      const sortedLogs = response.data.sort((a, b) => 
        sortOrder === 'desc' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setLogs(sortedLogs);
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to fetch logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLogs();
  }, [sortOrder]); // Re-fetch logs whenever sortOrder changes

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const onRefresh = () => {
    setRefreshing(true);
    getUserLogs().finally(() => setRefreshing(false));
  };

  const filteredLogs = filter === 'All' ? logs : logs.filter(log => log.type === filter);

  const renderLogItem = ({ item }) => {
    const formatTime = (time) => {
      if (!time) return '';
      const date = new Date(time);
      return date.toLocaleString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila', 
      });
    };
  
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.cell}>{formatTime(item.timeIn)}</Text>
        <Text style={styles.cell}>{formatTime(item.timeOut)}</Text>
        <Text style={styles.cell}>{item.totalHours}</Text>
        <Text style={[styles.cell, item.type === 'Onsite' ? styles.onsite : styles.online]}>
          {item.type}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
      <Text style={styles.headerText}>Employee-Log Records</Text>
      <Text style={styles.subText}>Employee Number: {employeeNumber}</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Type:</Text>
        <Picker
          selectedValue={filter}
          onValueChange={handleFilterChange}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Onsite" value="Onsite" /> 
          <Picker.Item label="Online" value="Online" />
        </Picker>
      </View>

      <View style={styles.tableHeader}>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.columnHeaderContainer}>
          <Text style={styles.columnHeader}>Date</Text>
          <MaterialIcons 
            name={sortOrder === 'desc' ? 'arrow-downward' : 'arrow-upward'} 
            size={16} 
            color="#d1e6f7" 
          />
        </TouchableOpacity>
        <Text style={styles.columnHeader}>Time In</Text>
        <Text style={styles.columnHeader}>Time Out</Text>
        <Text style={styles.columnHeader}>Total Hours</Text>
        <Text style={styles.columnHeader}>Type</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.logList}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>
              No logs to display.
            </Text>
          )}
        />
      )}

      <Text style={styles.footerMessage}>Keep track of your hard work!</Text>
    </View>
  );
}

export default LogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00274D',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 55,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#cce4ff',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#28527a',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  picker: {
    height: 40,
    width: 120,
    color: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#006494',
    borderRadius: 8,
    marginBottom: 10,
  },
  columnHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
    paddingHorizontal: 0,
  },
  
  columnHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d1e6f7',
    textAlign: 'center',
    marginRight: 4,
  },
  logList: {
    width: '100%',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f5faff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d1e6f7',
  },
  cell: {
    fontSize: 13,
    color: '#003f6b',
    textAlign: 'center',
    flex: 1,
  },
  onsite: {
    color: '#38b000',
    fontWeight: 'bold',
  },
  online: {
    color: '#0077b6',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#cce4ff',
    fontSize: 16,
    paddingTop: 20,
  },
  footerMessage: {
    fontSize: 14,
    color: '#cce4ff',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
