import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert, Platform } from 'react-native';
import { Settings, PlusSquare, Package, Star, Clock, LogOut, ChevronRight, Award } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { listingsService, isSupabaseConfigured, supabase } from '@/lib/supabase';
import ListingCard from '@/components/ListingCard';
import CreateListingModal from '@/components/CreateListingModal';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore, getCurrentUser } from '@/lib/auth';
import { Listing } from '@/types/listing';
import { createWebIcon } from '@/components/Icon';
import { ListingsGridSkeleton } from '@/components/SkeletonLoader';

// Premium Web Icons
const WebSettings = createWebIcon(Settings);
const WebPlus = createWebIcon(PlusSquare);
const WebPackage = createWebIcon(Package);
const WebStar = createWebIcon(Star);
const WebClock = createWebIcon(Clock);
const WebLogOut = createWebIcon(LogOut);
const WebChevron = createWebIcon(ChevronRight);
const WebAward = createWebIcon(Award);

interface User {
  id: string;
  email: string;
  name: string;
  userType: string;
  image: string;
  joinDate: string;
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('listings');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { colors, typography, spacing, shadows, radius, layout } = useTheme();
  const { logout } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [stats, setStats] = useState({ listings: 0, sold: 0, rating: 4.9 });

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData as User);
  }, []);

  const fetchUserListings = useCallback(async () => {
    if (!user?.id || !isSupabaseConfigured) {
      setListingsLoading(false);
      return;
    }

    try {
      setListingsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`*, categories(name, description)`)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const transformed: Listing[] = (data as any[]).map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price,
          location: item.location || 'Location not specified',
          category: item.categories?.name || 'Uncategorized',
          images: item.images || [],
          status: item.status || 'active',
          userType: item.user_type || 'private',
          createdAt: item.created_at || new Date().toISOString(),
          userId: item.seller_id || '',
        }));
        setUserListings(transformed);
        const soldCount = transformed.filter(l => l.status === 'sold').length;
        setStats(prev => ({ ...prev, listings: transformed.length, sold: soldCount }));
      }

      const { data: favData } = await supabase
        .from('favorites')
        .select(`listing_id, listings(*, categories(name))`)
        .eq('user_id', user.id);

      if (favData) {
        const transformedFavorites: Listing[] = (favData as any[])
          .filter(f => f.listings)
          .map((fav) => ({
            id: fav.listings.id,
            title: fav.listings.title,
            description: fav.listings.description || '',
            price: fav.listings.price,
            location: fav.listings.location || 'Location not specified',
            category: fav.listings.categories?.name || 'Uncategorized',
            images: fav.listings.images || [],
            status: fav.listings.status || 'active',
            userType: fav.listings.user_type || 'private',
            createdAt: fav.listings.created_at || new Date().toISOString(),
            userId: fav.listings.seller_id || '',
          }));
        setSavedListings(transformedFavorites);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setListingsLoading(false), 500);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchUserListings();
  }, [user?.id, fetchUserListings]);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Are you sure you want to sign out?");
      if (confirm) {
        const result = await logout();
        if (result.success) router.replace('../login');
      }
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out", style: "destructive", onPress: async () => {
            const result = await logout();
            if (result.success) router.replace('../login');
          }
        }
      ]);
    }
  };

  if (!user) return null;

  const formattedDate = new Date(user.joinDate).toLocaleDateString('en-GB', {
    month: 'long', year: 'numeric'
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header */}
      <View style={[styles.header, {
        paddingTop: Platform.OS === 'ios' ? layout.scale(64) : layout.scale(48),
        paddingBottom: layout.scale(24),
        paddingHorizontal: layout.scale(20),
      }]}>
        <View>
          <Text style={[styles.headerSubtitle, { color: colors.primary, fontSize: layout.moderateScale(10) }]}>ELITE MEMBER</Text>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: layout.moderateScale(28) }]}>DASHBOARD</Text>
        </View>
        <Pressable style={[styles.settingsButton, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: layout.touchTarget + 6,
          height: layout.touchTarget + 6,
          borderRadius: radius.md,
        }]}>
          <WebSettings size={layout.moderateScale(22)} color={colors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: layout.scale(100) }]}
      >
        {/* Profile "Black Card" */}
        <View style={[styles.profileCard, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          marginHorizontal: layout.scale(20),
          borderRadius: radius.xl,
          padding: layout.scale(20),
          marginBottom: layout.scale(24),
        }, shadows.lg]}>
          <View style={styles.profileMain}>
            <Image source={{ uri: user.image }} style={[styles.profileImage, { width: layout.scale(80), height: layout.scale(80), borderRadius: radius.md }]} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: colors.text, fontSize: layout.moderateScale(20) }]}>{user.name.toUpperCase()}</Text>
                <WebAward size={layout.moderateScale(18)} color={colors.primary} strokeWidth={2.5} />
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${colors.primary}15`, borderRadius: radius.sm }]}>
                <Text style={[styles.statusText, { color: colors.primary, fontSize: layout.moderateScale(10) }]}>{user.userType.toUpperCase()}</Text>
              </View>
              <Text style={[styles.joinedText, { color: colors.textSecondary, fontSize: layout.moderateScale(10) }]}>ESTABLISHED {formattedDate.toUpperCase()}</Text>
            </View>
          </View>

          {/* Stat Ribbon */}
          <View style={[styles.divider, { backgroundColor: colors.border, marginBottom: layout.scale(20) }]} />
          <View style={styles.statsRibbon}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.primary, fontSize: layout.moderateScale(22) }]}>{stats.listings}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>PORTFOLIO</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.primary, fontSize: layout.moderateScale(22) }]}>{stats.sold}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>TRADES</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.primary, fontSize: layout.moderateScale(22) }]}>{stats.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>TRUST</Text>
            </View>
          </View>
        </View>

        {/* Global CTA */}
        <Pressable
          style={[styles.createButton, {
            backgroundColor: colors.primary,
            marginHorizontal: layout.scale(20),
            height: layout.scale(64),
            borderRadius: radius.xl,
            marginBottom: layout.scale(40),
          }, shadows.glow]}
          onPress={() => setShowCreateModal(true)}
        >
          <WebPlus size={layout.moderateScale(22)} color="#000" strokeWidth={3} />
          <Text style={[styles.createButtonText, { fontSize: layout.moderateScale(15) }]}>LIST NEW ASSETS</Text>
        </Pressable>

        {/* Tab Controls */}
        <View style={[styles.tabsWrapper, { paddingHorizontal: layout.scale(20), marginBottom: layout.scale(24) }]}>
          <Pressable
            style={[styles.tabItem, activeTab === 'listings' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('listings')}
          >
            <Text style={[styles.tabLabel, {
              color: activeTab === 'listings' ? colors.text : colors.textMuted,
              fontSize: layout.moderateScale(11),
            }]}>MY ASSETS</Text>
          </Pressable>
          <Pressable
            style={[styles.tabItem, activeTab === 'saved' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabLabel, {
              color: activeTab === 'saved' ? colors.text : colors.textMuted,
              fontSize: layout.moderateScale(11),
            }]}>WATCHLIST</Text>
          </Pressable>
          <Pressable
            style={[styles.tabItem, activeTab === 'history' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabLabel, {
              color: activeTab === 'history' ? colors.text : colors.textMuted,
              fontSize: layout.moderateScale(11),
            }]}>LOGS</Text>
          </Pressable>
        </View>

        {/* Dynamic Content */}
        <View style={[styles.contentArea, { paddingHorizontal: layout.scale(20) }]}>
          {listingsLoading ? (
            <ListingsGridSkeleton />
          ) : (
            <>
              {activeTab === 'listings' && (
                userListings.length > 0 ? (
                  userListings.map((l) => <ListingCard key={l.id} listing={l} showStatus />)
                ) : (
                  <View style={[styles.emptyView, { paddingVertical: layout.scale(80) }]}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: layout.moderateScale(11) }]}>NO ACTIVE ASSETS IN PORTFOLIO</Text>
                  </View>
                )
              )}
              {activeTab === 'saved' && (
                savedListings.length > 0 ? (
                  savedListings.map((l) => <ListingCard key={l.id} listing={l} />)
                ) : (
                  <View style={[styles.emptyView, { paddingVertical: layout.scale(80) }]}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: layout.moderateScale(11) }]}>WATCHLIST IS EMPTY</Text>
                  </View>
                )
              )}
              {activeTab === 'history' && (
                <View style={[styles.emptyView, { paddingVertical: layout.scale(80) }]}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: layout.moderateScale(11) }]}>NO TRANSACTION LOGS RECORDED</Text>
                </View>
              )}
            </>
          )}
        </View>

        <Pressable style={[styles.logoutBtn, { marginTop: layout.scale(40), height: layout.touchTarget }]} onPress={handleLogout}>
          <WebLogOut size={layout.moderateScale(18)} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error, fontSize: layout.moderateScale(12) }]}>SECURE SIGN OUT</Text>
        </Pressable>
      </ScrollView>

      <CreateListingModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => { setActiveTab('listings'); fetchUserListings(); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    // paddingBottom dynamic
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSubtitle: { fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  headerTitle: { fontWeight: '900', letterSpacing: -0.5 },
  settingsButton: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  profileCard: { borderWidth: 1.5 },
  profileMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileImage: { backgroundColor: '#111' },
  profileInfo: { marginLeft: 20, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  profileName: { fontWeight: '900', letterSpacing: -0.5 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  statusText: { fontWeight: '900', letterSpacing: 1 },
  joinedText: { fontWeight: '700', letterSpacing: 0.5, opacity: 0.6 },
  divider: { height: 1, width: '100%' },
  statsRibbon: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  createButtonText: { fontWeight: '900', letterSpacing: 1.5, color: '#000' },
  tabsWrapper: { flexDirection: 'row' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabLabel: { fontWeight: '900', letterSpacing: 1 },
  contentArea: {
    // paddingHorizontal dynamic
  },
  emptyView: { alignItems: 'center' },
  emptyText: { fontWeight: '900', letterSpacing: 1.5, opacity: 0.5 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  logoutText: { fontWeight: '900', letterSpacing: 1.5 },
});
