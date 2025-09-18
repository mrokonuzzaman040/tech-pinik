interface ImageBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export class ImageBBUploader {
  private apiKey: string;
  private baseUrl = 'https://api.imgbb.com/1/upload';

  constructor() {
    this.apiKey = process.env.IMAGEBB_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ImageBB API key is required. Please set IMAGEBB_API_KEY environment variable.');
    }
  }

  /**
   * Upload image to ImageBB
   * @param imageFile - File object or base64 string
   * @param name - Optional name for the image
   * @returns Promise with ImageBB response
   */
  async uploadImage(imageFile: File | string, name?: string): Promise<ImageBBResponse> {
    try {
      let base64Image: string;

      // Convert File to base64 if needed
      if (imageFile instanceof File) {
        base64Image = await this.fileToBase64(imageFile);
      } else {
        base64Image = imageFile;
      }

      // Remove data:image/...;base64, prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

      const formData = new FormData();
      formData.append('key', this.apiKey);
      formData.append('image', cleanBase64);
      
      if (name) {
        formData.append('name', name);
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ImageBB API error: ${response.status} ${response.statusText}`);
      }

      const result: ImageBBResponse = await response.json();

      if (!result.success) {
        throw new Error('ImageBB upload failed');
      }

      return result;
    } catch (error) {
      console.error('ImageBB upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images to ImageBB
   * @param images - Array of File objects or base64 strings
   * @param namePrefix - Optional prefix for image names
   * @returns Promise with array of ImageBB responses
   */
  async uploadMultipleImages(
    images: (File | string)[],
    namePrefix?: string
  ): Promise<ImageBBResponse[]> {
    const uploadPromises = images.map((image, index) => {
      const name = namePrefix ? `${namePrefix}_${index + 1}` : undefined;
      return this.uploadImage(image, name);
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Convert File to base64 string
   * @param file - File object
   * @returns Promise with base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Validate image file
   * @param file - File object to validate
   * @param maxSizeInMB - Maximum file size in MB (default: 32MB - ImageBB limit)
   * @returns boolean indicating if file is valid
   */
  static validateImageFile(file: File, maxSizeInMB: number = 32): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
      };
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: `File size too large. Maximum size is ${maxSizeInMB}MB.`
      };
    }

    return { valid: true };
  }

  /**
   * Get optimized image URL from ImageBB response
   * @param response - ImageBB response
   * @param size - Size preference ('thumb', 'medium', 'full')
   * @returns Optimized image URL
   */
  static getOptimizedUrl(response: ImageBBResponse, size: 'thumb' | 'medium' | 'full' = 'medium'): string {
    switch (size) {
      case 'thumb':
        return response.data.thumb.url;
      case 'medium':
        return response.data.medium.url;
      case 'full':
      default:
        return response.data.display_url;
    }
  }
}

// Export a default instance
export const imageBBUploader = new ImageBBUploader();