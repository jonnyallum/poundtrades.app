export type UserType = 'private' | 'business' | 'direct' | 'admin';
export type ListingStatus = 'active' | 'pending' | 'sold';

export interface Listing {
    id: string | number;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    images: string[];
    status: ListingStatus;
    userType: UserType;
    createdAt: string;
    userId: string;
    latitude?: number;
    longitude?: number;
}

export type Category = {
    id: string;
    name: string;
    icon: string;
    color?: string;
};
