export interface District {
  name: string;
  deliveryCharge: number;
  estimatedDays: number;
}

export const bangladeshiDistricts: District[] = [
  // Dhaka Division
  { name: 'Dhaka', deliveryCharge: 60, estimatedDays: 1 },
  { name: 'Faridpur', deliveryCharge: 100, estimatedDays: 2 },
  { name: 'Gazipur', deliveryCharge: 80, estimatedDays: 1 },
  { name: 'Gopalganj', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Kishoreganj', deliveryCharge: 100, estimatedDays: 2 },
  { name: 'Madaripur', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Manikganj', deliveryCharge: 100, estimatedDays: 2 },
  { name: 'Munshiganj', deliveryCharge: 80, estimatedDays: 2 },
  { name: 'Narayanganj', deliveryCharge: 70, estimatedDays: 1 },
  { name: 'Narsingdi', deliveryCharge: 90, estimatedDays: 2 },
  { name: 'Rajbari', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Shariatpur', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Tangail', deliveryCharge: 100, estimatedDays: 2 },

  // Chittagong Division
  { name: 'Chittagong', deliveryCharge: 100, estimatedDays: 2 },
  { name: 'Bandarban', deliveryCharge: 150, estimatedDays: 4 },
  { name: 'Brahmanbaria', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Chandpur', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Comilla', deliveryCharge: 100, estimatedDays: 2 },
  { name: 'Cox\'s Bazar', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Feni', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Khagrachhari', deliveryCharge: 150, estimatedDays: 4 },
  { name: 'Lakshmipur', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Noakhali', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Rangamati', deliveryCharge: 150, estimatedDays: 4 },

  // Rajshahi Division
  { name: 'Rajshahi', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Bogra', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Joypurhat', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Naogaon', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Natore', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Chapainawabganj', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Pabna', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Sirajganj', deliveryCharge: 120, estimatedDays: 3 },

  // Khulna Division
  { name: 'Khulna', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Bagerhat', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Chuadanga', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Jessore', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Jhenaidah', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Kushtia', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Magura', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Meherpur', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Narail', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Satkhira', deliveryCharge: 130, estimatedDays: 3 },

  // Sylhet Division
  { name: 'Sylhet', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Habiganj', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Moulvibazar', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Sunamganj', deliveryCharge: 130, estimatedDays: 3 },

  // Barisal Division
  { name: 'Barisal', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Barguna', deliveryCharge: 140, estimatedDays: 4 },
  { name: 'Bhola', deliveryCharge: 140, estimatedDays: 4 },
  { name: 'Jhalokati', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Patuakhali', deliveryCharge: 140, estimatedDays: 4 },
  { name: 'Pirojpur', deliveryCharge: 130, estimatedDays: 3 },

  // Rangpur Division
  { name: 'Rangpur', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Dinajpur', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Gaibandha', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Kurigram', deliveryCharge: 140, estimatedDays: 4 },
  { name: 'Lalmonirhat', deliveryCharge: 140, estimatedDays: 4 },
  { name: 'Nilphamari', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Panchagarh', deliveryCharge: 140, estimatedDays: 4 },
  { name: 'Thakurgaon', deliveryCharge: 130, estimatedDays: 3 },

  // Mymensingh Division
  { name: 'Mymensingh', deliveryCharge: 120, estimatedDays: 3 },
  { name: 'Jamalpur', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Netrokona', deliveryCharge: 130, estimatedDays: 3 },
  { name: 'Sherpur', deliveryCharge: 130, estimatedDays: 3 }
];

export const getDistrictByName = (name: string): District | undefined => {
  return bangladeshiDistricts.find(district => 
    district.name.toLowerCase() === name.toLowerCase()
  );
};

export const getDeliveryCharge = (districtName: string): number => {
  const district = getDistrictByName(districtName);
  return district ? district.deliveryCharge : 150; // Default charge for unknown districts
};

export const getEstimatedDeliveryDays = (districtName: string): number => {
  const district = getDistrictByName(districtName);
  return district ? district.estimatedDays : 5; // Default days for unknown districts
};