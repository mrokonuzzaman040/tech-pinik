'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';
import CategoryProducts from '@/components/CategoryProducts';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
}

interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  comparePrice?: number;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface CategoryWithProducts {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  products: Product[];
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sliders
        const slidersResponse = await fetch('/api/sliders');
        const slidersData = await slidersResponse.json();
        if (slidersData.success) {
           setSlides(slidersData.data.map((slider: {
             _id: string;
             title: string;
             subtitle: string;
             description: string;
             image: string;
             buttonText: string;
             buttonLink: string;
           }) => ({
             id: slider._id,
             title: slider.title,
             subtitle: slider.subtitle,
             description: slider.description,
             image: slider.image,
             buttonText: slider.buttonText,
             buttonLink: slider.buttonLink,
           })));
         }

        // Fetch categories
         const categoriesResponse = await fetch('/api/categories');
         const categoriesData = await categoriesResponse.json();
         if (categoriesData.success) {
           setCategories(categoriesData.data.map((cat: Category) => ({
             id: cat._id,
             name: cat.name,
             slug: cat.slug,
             icon: cat.icon,
             image: cat.image,
           })));
         }

        // Fetch products for each category (first 6 categories)
        const categoryProductsData: CategoryWithProducts[] = [];
        const categoriesToShow = categoriesData.data.slice(0, 6);
        
        for (const category of categoriesToShow) {
          const productsResponse = await fetch(`/api/products?category=${category._id}&limit=6`);
          const productsData = await productsResponse.json();
          
          if (productsData.success) {
             categoryProductsData.push({
               id: category._id,
               _id: category._id,
               name: category.name,
               slug: category.slug,
               description: category.description,
               image: category.image || '/logo.png' + encodeURIComponent(category.name),
               products: productsData.data.map((product: Product) => ({
                 id: product._id,
                 _id: product._id,
                 name: product.name,
                 slug: product.slug,
                 price: product.price,
                 comparePrice: product.comparePrice,
                 images: product.images,
                 stock: product.stock,
                 rating: product.rating,
                 reviewCount: product.reviewCount,
                 brand: product.brand,
                 category: product.category
               }))
             });
           }
        }
        
        setCategoryProducts(categoryProductsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Slider */}
        <section className="mb-8">
          <HeroSlider slides={slides} />
        </section>

        {/* Category Slider */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Shop by Category
            </h2>
            <CategorySlider categories={categories} />
          </div>
        </section>

        {/* Category Products */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <CategoryProducts categories={categoryProducts} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 TechPinik. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
