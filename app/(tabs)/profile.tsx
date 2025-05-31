import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native';
import { Settings, SquarePlus as PlusSquare, Package, Star, Clock, LogOut } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { mockUserListings } from '@/data/mockData';
import ListingCard from '@/components/ListingCard';
import StatusBadge from '@/components/StatusBadge';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore, getCurrentUser } from '@/lib/auth';

// Define user type for TypeScript
interface User {
  email: string;
  name: string;
  userType: string;
  image: string;
  joinDate: string;
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('listings');
  const { theme } = useTheme();
  const { logout } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  // Get user data on component mount
  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData as User);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              router.replace('../login');
            } else {
              Alert.alert("Error", result.error || "Failed to sign out");
            }
          }
        }
      ]
    );
  };

  // If user data is not loaded yet
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Loading profile...</Text>
      </View>
    );
  }

  // Format join date
  const formattedDate = new Date(user.joinDate).toLocaleDateString('en-GB', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <Pressable style={[styles.settingsButton, { backgroundColor: theme.card }]}>
          <Settings size={22} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user.name}</Text>
            <View style={[styles.userTypeContainer, { backgroundColor: theme.tabBar }]}>
              <Text style={[styles.userTypeText, { color: theme.primary }]}>{user.userType}</Text>
            </View>
            <Text style={[styles.joinedText, { color: theme.secondaryText }]}>Member since {formattedDate}</Text>
          </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Listings</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Sold</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>4.7</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Rating</Text>
          </View>
        </View>

        <Link href="/(tabs)/listings" asChild>
          <Pressable style={[styles.createButton, { backgroundColor: theme.primary }]}>
            <PlusSquare size={20} color="#000" />
            <Text style={styles.createButtonText}>Create New Listing</Text>
          </Pressable>
        </Link>

        <View style={[styles.tabsContainer, { backgroundColor: theme.background }]}>
          <Pressable 
            style={[
              styles.tab, 
              { backgroundColor: activeTab === 'listings' ? theme.card : 'transparent' }
            ]} 
            onPress={() => setActiveTab('listings')}
          >
            <Package size={18} color={activeTab === 'listings' ? theme.primary : theme.secondaryText} />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'listings' ? theme.text : theme.secondaryText }
              ]}
            >
              My Listings
            </Text>
          </Pressable>
          <Pressable 
            style={[
              styles.tab, 
              { backgroundColor: activeTab === 'saved' ? theme.card : 'transparent' }
            ]} 
            onPress={() => setActiveTab('saved')}
          >
            <Star size={18} color={activeTab === 'saved' ? theme.primary : theme.secondaryText} />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'saved' ? theme.text : theme.secondaryText }
              ]}
            >
              Saved
            </Text>
          </Pressable>
          <Pressable 
            style={[
              styles.tab, 
              { backgroundColor: activeTab === 'history' ? theme.card : 'transparent' }
            ]} 
            onPress={() => setActiveTab('history')}
          >
            <Clock size={18} color={activeTab === 'history' ? theme.primary : theme.secondaryText} />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'history' ? theme.text : theme.secondaryText }
              ]}
            >
              History
            </Text>
          </Pressable>
        </View>

        <View style={styles.listingsContainer}>
          {activeTab === 'listings' && mockUserListings.map(listing => (
            <View key={listing.id} style={styles.listingItem}>
              <ListingCard listing={listing} showStatus />
            </View>
          ))}
          {activeTab === 'saved' && (
            <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>No saved listings yet</Text>
          )}
          {activeTab === 'history' && (
            <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>No transaction history yet</Text>
          )}
        </View>

        <Pressable 
          style={[styles.logoutButton, { borderColor: '#FF3B30' }]}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userTypeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 5,
  },
  userTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  joinedText: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 8,
    padding: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  tabText: {
    marginLeft: 5,
    fontWeight: '500',
    fontSize: 13,
  },
  listingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listingItem: {
    marginBottom: 15,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    marginLeft: 8,
    color: '#FF3B30',
    fontWeight: '600',
  },
});