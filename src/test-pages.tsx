// Simple test to verify pages compile correctly
import React from 'react';
import { HomePage } from './pages/HomePage';
import { BetsPage } from './pages/BetsPage';
import { StatsPage } from './pages/StatsPage';
import { BalancePage } from './pages/BalancePage';

// This file just imports all pages to verify they compile
export const TestPages = () => {
  return (
    <div>
      <HomePage />
      <BetsPage />
      <StatsPage />
      <BalancePage />
    </div>
  );
};