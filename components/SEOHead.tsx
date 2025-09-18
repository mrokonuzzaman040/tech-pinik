import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  brand?: string;
  category?: string;
  productId?: string;
}

export default function SEOHead({
  title = 'Tech Pinik - Your Ultimate Tech Store',
  description = 'Discover the latest technology products at Tech Pinik. From smartphones to laptops, we have everything you need for your digital lifestyle.',
  keywords = 'technology, electronics, smartphones, laptops, gadgets, tech store, online shopping',
  image = '/logo.png',
  url = 'https://techpinik.com',
  type = 'website',
  price,
  currency = 'BDT',
  availability = 'in_stock',
  brand,
  category,
  productId
}: SEOHeadProps) {
  const fullTitle = title.includes('Tech Pinik') ? title : `${title} | Tech Pinik`;
  const fullUrl = url.startsWith('http') ? url : `https://techpinik.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://techpinik.com${image}`;

  // Generate structured data for products
  const generateProductStructuredData = () => {
    if (type !== 'product' || !price) return null;

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": title,
      "description": description,
      "image": fullImage,
      "brand": {
        "@type": "Brand",
        "name": brand || "Tech Pinik"
      },
      "category": category,
      "sku": productId,
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability === 'in_stock' ? 'InStock' : availability === 'out_of_stock' ? 'OutOfStock' : 'PreOrder'}`,
        "seller": {
          "@type": "Organization",
          "name": "Tech Pinik"
        }
      }
    };
  };

  // Generate structured data for organization
  const generateOrganizationStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Tech Pinik",
      "url": "https://techpinik.com",
      "logo": "https://techpinik.com/logo.png",
      "description": "Your ultimate destination for the latest technology products and gadgets.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+880-XXX-XXXXXX",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://facebook.com/techpinik",
        "https://twitter.com/techpinik",
        "https://instagram.com/techpinik"
      ]
    };
  };

  const productStructuredData = generateProductStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Tech Pinik" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Tech Pinik" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@techpinik" />
      <meta name="twitter:creator" content="@techpinik" />

      {/* Product-specific meta tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
          {brand && <meta property="product:brand" content={brand} />}
          {category && <meta property="product:category" content={category} />}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Structured Data */}
      {productStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData)
          }}
        />
      )}
      
      {type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData)
          }}
        />
      )}

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://i.ibb.co" />
    </Head>
  );
}