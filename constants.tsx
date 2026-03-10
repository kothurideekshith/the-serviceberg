
import React from 'react';
import { 
  Droplets, Fuel, Wrench, Truck, Sparkles, Wind, Filter, Heart, Baby, ChefHat, Zap, Car, Scissors, Home, Hammer, Camera, Package, RefreshCw, PawPrint, Paintbrush, Bug, Droplet, PlusCircle, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Service, CategoryData, Provider } from './types';

export interface TrainService {
  id: string;
  name: string;
  image: string;
}

export const TRAIN_SERVICES: TrainService[] = [
  { id: 'fuel', name: 'Fuel Delivery', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200' },
  { id: 'towing', name: 'Mechanic & Towing', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200' },
  { id: 'beauty', name: 'Womens Beauty', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1200' },
  { id: 'elderly', name: 'Elderly Care', image: 'https://images.unsplash.com/photo-1581579538393-ee5f141cb17e?auto=format&fit=crop&q=80&w=1200' },
  { id: 'baby', name: 'Baby Sitting', image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200' },
  { id: 'cooks', name: 'Cooks', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200' },
  { id: 'electrical', name: 'Electrical Works', image: 'https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=1200' },
  { id: 'pet', name: 'Pet Services', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1200' },
  { id: 'cleaners', name: 'Cleaners', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200' },
  { id: 'painting', name: 'Painting', image: 'https://images.unsplash.com/photo-1562259949-e8e76833c057?auto=format&fit=crop&q=80&w=1200' },
  { id: 'mens_grooming', name: 'Mens Grooming', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200' },
  { id: 'pest_control', name: 'Pest Control', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200' },
  { id: 'handyman', name: 'Handyman', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200' },
  { id: 'water_cans', name: 'Water Cans', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1200' },
  { id: 'car_cleaning', name: 'Car / Bike Cleaning', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1200' },
  { id: 'moving', name: 'Packing and Moving', image: 'https://images.unsplash.com/photo-1603860391994-08fe37618991?auto=format&fit=crop&q=80&w=1200' },
  { id: 'more', name: 'And More Services', image: 'https://images.unsplash.com/photo-1454165833767-027eeaf19677?auto=format&fit=crop&q=80&w=1200' },
  { id: 'appliances', name: 'Home Appliances repair', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200' },
  { id: 'gadgets', name: 'Gadget repair', image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a49dd5?auto=format&fit=crop&q=80&w=1200' },
  { id: 'advice', name: 'Experts Advice', image: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&q=80&w=1200' },
];

// Map specific sub-categories to clear, isometric-style imagery queries
export const SUB_SERVICE_ICONS: Record<string, string> = {
  "AC": "https://img.icons8.com/isometric/512/air-conditioner.png",
  "Washing Machine": "https://img.icons8.com/isometric/512/washing-machine.png",
  "Refrigerator": "https://img.icons8.com/isometric/512/refrigerator.png",
  "Television": "https://img.icons8.com/isometric/512/plasma-tv.png",
  "Chimney": "https://img.icons8.com/isometric/512/kitchen-extractor-fan.png",
  "Microwave": "https://img.icons8.com/isometric/512/microwave.png",
  "Stove": "https://img.icons8.com/isometric/512/cooker.png",
  "Water Purifier": "https://img.icons8.com/isometric/512/water-cooler.png",
  "Geyser": "https://img.icons8.com/isometric/512/boiler.png",
  "Air Cooler": "https://img.icons8.com/isometric/512/fan.png",
  "Mobile": "https://img.icons8.com/isometric/512/smartphone.png",
  "Laptop": "https://img.icons8.com/isometric/512/laptop.png",
  "iPad": "https://img.icons8.com/isometric/512/tablet-pc.png",
  "Desktop": "https://img.icons8.com/isometric/512/monitor.png",
  "Lawyer": "https://img.icons8.com/isometric/512/judge.png",
  "Solicitor": "https://img.icons8.com/isometric/512/briefcase.png",
  "Car & Bike": "https://img.icons8.com/isometric/512/car.png",
  "Homeopathy": "https://img.icons8.com/isometric/512/pill.png",
  "Cooking": "https://img.icons8.com/isometric/512/chef-hat.png",
  "Health": "https://img.icons8.com/isometric/512/heart-health.png",
  "Nutrition": "https://img.icons8.com/isometric/512/apple.png",
  "Yoga": "https://img.icons8.com/isometric/512/lotus.png",
  "Computer": "https://img.icons8.com/isometric/512/source-code.png",
  "Chartered Accountant": "https://img.icons8.com/isometric/512/calculator.png"
};

const subCategoryMap: Record<string, string[]> = {
  fuel: ["Petrol", "Diesel", "EV Charging", "Lubricants", "Premium Fuel"],
  towing: ["Periodic Service", "Brakes & Suspension", "Engine Work", "Diagnostics", "Flatbed", "Rope Towing", "Wheel Lift"],
  beauty: ["Facial", "Hair Care", "Waxing", "Nails", "Threading"],
  elderly: ["Health Monitoring", "Companionship", "Daily Assistance", "Special Care"],
  baby: ["Hourly Sitter", "Night Care", "Infant Support", "Nanny Services"],
  cooks: ["Full Time", "One Time Meal", "Party Specialist", "Diabetic Cuisine"],
  electrical: ["Switchboard Repair", "Fan Repair", "Wiring", "Lights & Geyser"],
  pet: ["Grooming", "Dog Walking", "Vet Consult", "Training", "Boarding"],
  cleaners: ["Full Home", "Kitchen Deep Clean", "Sofa Cleaning", "Bathroom Clean"],
  painting: ["Interior", "Exterior", "Waterproofing", "Texture Painting"],
  mens_grooming: ["Haircut", "Shave & Beard", "Facial", "Massage"],
  pest_control: ["Cockroach", "Termite", "Bed Bugs", "Rodent Control"],
  handyman: ["Carpentry", "Plumbing", "Drilling & Mounting", "Furniture Assembly"],
  water_cans: ["20L Standard", "Sparkling Water", "Dispenser Service"],
  car_cleaning: ["Exterior Wash", "Interior Detailing", "Ceramic Coating", "Complete Spa"],
  moving: ["Local Shifting", "Intercity", "Office Move", "Packaging Only"],
  more: ["Maintenance", "Support", "Assistance", "Other"],
  appliances: ["AC", "Washing Machine", "Refrigerator", "Television", "Chimney", "Microwave", "Stove", "Water Purifier", "Geyser", "Air Cooler"],
  gadgets: ["Mobile", "Laptop", "iPad", "Desktop"],
  advice: ["Lawyer", "Solicitor", "Car & Bike", "Homeopathy", "Cooking", "Health", "Nutrition", "Yoga", "Computer", "Chartered Accountant"]
};

const generateMockProviders = (categoryId: string, categoryName: string): Provider[] => {
  const providers: Provider[] = [];
  const brandPrefixes = ['Elite', 'Classic', 'Express', 'Modern', 'Summit', 'Global', 'Precision', 'Titan', 'Apex'];
  const locations = ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5'];
  const subs = subCategoryMap[categoryId] || subCategoryMap['more'];

  for (let i = 0; i < 4; i++) {
    const providerId = `p-${categoryId}-${i}`;
    const services: Service[] = subs.flatMap((sub, sIdx) => {
      const isOffer = sIdx === 0;
      const serviceCount = 3 + Math.floor(Math.random() * 4); // 3 to 6 services
      return Array.from({ length: serviceCount }).map((_, iIdx) => ({
        id: `s-${providerId}-${sIdx}-${iIdx}`,
        name: iIdx === 0 ? `${sub} Professional Repair` : `${sub} ${['Deep Clean', 'Maintenance', 'Inspection', 'Standard Service', 'Premium Care'][iIdx % 5]}`,
        description: `High-performance ${sub.toLowerCase()} solutions for your home. Expert treatment with industry-leading standards. Our certified artisans ensure every detail is handled with precision and care.`,
        icon: 'Sparkles',
        price: `₹${(199 + (sIdx * 100) + (iIdx * 50))}`,
        image: SUB_SERVICE_ICONS[sub] || `https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800`,
        category: categoryId,
        subCategory: sub,
        rating: 4.5 + (Math.random() * 0.5),
        reviews: `${50 + (i * 10) + (iIdx * 5)}+`,
        time: '45-60 min',
        offer: (isOffer && iIdx === 0) ? 'Flat ₹200 Off' : undefined
      }));
    });

    providers.push({
      id: providerId,
      name: `${brandPrefixes[i]} ${categoryName} Hub`,
      description: `Premium service agency based in ${locations[i % locations.length]}. High-performance solutions for precision ${categoryName.toLowerCase()}.`,
      image: `https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800`,
      coverImage: `https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1200`,
      rating: 4.5 + (Math.random() * 0.5),
      reviews: `${1000 + (i * 200)}+`,
      services,
      location: locations[i % locations.length],
      isActive: true
    });
  }
  return providers;
};

export const CATEGORY_MAP: Record<string, CategoryData> = TRAIN_SERVICES.reduce((acc, cat) => {
  acc[cat.id] = {
    id: cat.id,
    name: cat.name,
    heroImage: cat.image.replace('w=1200', 'w=1600'),
    providers: generateMockProviders(cat.id, cat.name),
    subCategories: subCategoryMap[cat.id] || subCategoryMap['more']
  };
  return acc;
}, {} as Record<string, CategoryData>);

export const SERVICES: Service[] = Object.values(CATEGORY_MAP).flatMap(cat => 
  cat.providers.flatMap(p => p.services)
);
