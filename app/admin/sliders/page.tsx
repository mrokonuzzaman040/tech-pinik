'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface Slider {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  isActive: boolean;
  sortOrder: number;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  position: 'left' | 'center' | 'right';
  createdAt: string;
  updatedAt: string;
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    mobileImage: '',
    link: '',
    buttonText: '',
    isActive: true,
    sortOrder: 1,
    backgroundColor: '#f39c12',
    textColor: '#ffffff',
    buttonColor: '#1e3a8a',
    position: 'center' as 'left' | 'center' | 'right',
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/sliders');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSliders(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSlider ? `/api/sliders/${editingSlider._id}` : '/api/sliders';
      const method = editingSlider ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSliders();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving slider:', error);
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || '',
      description: slider.description || '',
      image: slider.image,
      mobileImage: slider.mobileImage || '',
      link: slider.link || '',
      buttonText: slider.buttonText || '',
      isActive: slider.isActive,
      sortOrder: slider.sortOrder,
      backgroundColor: slider.backgroundColor || '#f39c12',
      textColor: slider.textColor || '#ffffff',
      buttonColor: slider.buttonColor || '#1e3a8a',
      position: slider.position,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        const response = await fetch(`/api/sliders/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchSliders();
        }
      } catch (error) {
        console.error('Error deleting slider:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlider(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      mobileImage: '',
      link: '',
      buttonText: '',
      isActive: true,
      sortOrder: 1,
      backgroundColor: '#f39c12',
      textColor: '#ffffff',
      buttonColor: '#1e3a8a',
      position: 'center',
    });
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchSliders();
      }
    } catch (error) {
      console.error('Error toggling slider status:', error);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const slider = sliders.find(s => s._id === id);
    if (!slider) return;

    const newOrder = direction === 'up' ? slider.sortOrder - 1 : slider.sortOrder + 1;
    
    try {
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sortOrder: newOrder }),
      });

      if (response.ok) {
        fetchSliders();
      }
    } catch (error) {
      console.error('Error reordering slider:', error);
    }
  };

  const filteredSliders = (sliders || []).filter(slider =>
    slider.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Sliders</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage homepage hero sliders and banners
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Slider
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search sliders..."
            />
          </div>
        </div>
      </div>

      {/* Sliders List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredSliders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredSliders.map((slider, index) => (
              <div key={slider._id} className="p-6">
                <div className="flex items-start space-x-6">
                  {/* Preview Images */}
                  <div className="flex-shrink-0">
                    <div className="flex space-x-4">
                      {/* Desktop Preview */}
                      <div className="relative">
                        <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={slider.image}
                            alt={slider.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                          <Monitor className="h-3 w-3 text-gray-500" />
                        </div>
                      </div>
                      
                      {/* Mobile Preview */}
                      {slider.mobileImage && (
                        <div className="relative">
                          <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={slider.mobileImage}
                              alt={`${slider.title} - Mobile`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                            <Smartphone className="h-3 w-3 text-gray-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {slider.title}
                        </h3>
                        {slider.subtitle && (
                          <p className="text-sm text-gray-600 mt-1">
                            {slider.subtitle}
                          </p>
                        )}
                        {slider.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {slider.description}
                          </p>
                        )}
                        
                        <div className="flex items-center mt-3 space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Order:</span>
                            <span className="text-xs font-medium text-gray-900">{slider.sortOrder}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Position:</span>
                            <span className="text-xs font-medium text-gray-900 capitalize">{slider.position}</span>
                          </div>
                          
                          {slider.link && (
                            <div className="flex items-center space-x-1">
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">Has Link</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Color Preview */}
                        <div className="flex items-center mt-2 space-x-2">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: slider.backgroundColor }}
                            title="Background Color"
                          ></div>
                          <div 
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: slider.textColor }}
                            title="Text Color"
                          ></div>
                          <div 
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: slider.buttonColor }}
                            title="Button Color"
                          ></div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          slider.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slider.isActive ? 'Active' : 'Inactive'}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleReorder(slider._id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleReorder(slider._id, 'down')}
                            disabled={index === filteredSliders.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleToggleActive(slider._id, slider.isActive)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title={slider.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {slider.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleEdit(slider)}
                            className="p-1 text-gray-400 hover:text-primary-600"
                            title="Edit Slider"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(slider._id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete Slider"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Monitor className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sliders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first hero slider.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slider
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {editingSlider ? 'Edit Slider' : 'Add New Slider'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Slider title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Slider subtitle"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Slider description"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload
                      onImageUploaded={(url) => setFormData({...formData, image: url})}
                      currentImage={formData.image}
                      label="Desktop Image *"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload
                      onImageUploaded={(url) => setFormData({...formData, mobileImage: url})}
                      currentImage={formData.mobileImage}
                      label="Mobile Image (Optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Shop Now"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value as 'left' | 'center' | 'right'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 1})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Color
                    </label>
                    <input
                      type="color"
                      value={formData.buttonColor}
                      onChange={(e) => setFormData({...formData, buttonColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active (visible on website)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {editingSlider ? 'Update Slider' : 'Create Slider'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
