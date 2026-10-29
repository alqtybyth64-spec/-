import React from 'react';
import { useApp } from '../context/AppContext';
import { AdSlider } from '../components/home/AdSlider';
import { HeroSection } from '../components/home/HeroSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FeaturedAppsSection } from '../components/home/FeaturedAppsSection';
import { LatestAppsSection } from '../components/home/LatestAppsSection';
import { WebDesignBanner } from '../components/home/WebDesignBanner';
import { DeveloperSection } from '../components/home/DeveloperSection';

export const HomePage: React.FC = () => {
  const { settings } = useApp();
  const visibility = settings.sectionVisibility || {
    hero: true,
    ads: true,
    categories: true,
    featured: true,
    latest: true,
    webDesignRequest: true,
    developer: true,
  };

  const order = settings.sectionOrder || [
    'ads',
    'hero',
    'categories',
    'featured',
    'latest',
    'webDesignRequest',
    'developer',
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case 'ads':
        return visibility.ads ? <AdSlider key="ads" /> : null;
      case 'hero':
        return visibility.hero ? <HeroSection key="hero" /> : null;
      case 'categories':
        return visibility.categories ? <CategoriesSection key="categories" /> : null;
      case 'featured':
        return visibility.featured ? <FeaturedAppsSection key="featured" /> : null;
      case 'latest':
        return visibility.latest ? <LatestAppsSection key="latest" /> : null;
      case 'webDesignRequest':
        return visibility.webDesignRequest ? <WebDesignBanner key="webDesignRequest" /> : null;
      case 'developer':
        return visibility.developer ? <DeveloperSection key="developer" /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-2">
      {order.map((key) => renderSection(key))}
    </div>
  );
};
