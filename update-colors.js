#!/usr/bin/env node

/**
 * Color Update Script
 * Replace all old colors with new unified color system
 * Usage: node color-updater.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color Mapping
const colorMap = {
  // Old → New
  '#1a3a52': '#1F4A51',        // TEXT_PRIMARY
  '#5e7a8c': '#6B7280',        // TEXT_SECONDARY
  '#cfe1e8': '#E5E7EB',        // CARD BORDER
  '#e0eef4': '#E5E7EB',        // BORDER
  '#f8fafb': '#F5F5F7',        // GRAY BG
  '#e8f4f8': '#F4FDFC',        // HOVER
  '#2c7da0': '#479AA8',        // PRIMARY/BUTTON
  '#24698a': '#1F4A51',        // DARK VARIANT
  '#d4eaf2': '#DEF1EF',        // LIGHTER TEAL
  'text-\\[#1a3a52\\]': 'style={{ color: \'#1F4A51\' }}',
  'text-\\[#5e7a8c\\]': 'style={{ color: \'#6B7280\' }}',
  'bg-\\[#1a3a52\\]': 'style={{ backgroundColor: \'#1F4A51\' }}',
  'bg-\\[#f8fafb\\]': 'style={{ backgroundColor: \'#F5F5F7\' }}',
  'bg-\\[#2c7da0\\]': 'style={{ backgroundColor: \'#479AA8\' }}',
  'border-\\[#e0eef4\\]': 'style={{ borderColor: \'#E5E7EB\' }}',
};

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    
    for (const [old, newVal] of Object.entries(colorMap)) {
      const regex = new RegExp(old, 'g');
      updated = updated.replace(regex, newVal);
    }
    
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function scanAndUpdate(dirPath) {
  const files = fs.readdirSync(dirPath);
  let updated = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('node_modules') && !file.startsWith('.')) {
        updated += scanAndUpdate(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (updateFile(fullPath)) {
        updated++;
      }
    }
  });
  
  return updated;
}

// Run
const componentsPath = path.join(__dirname, 'src/app/components');
console.log('Starting color system update...\n');
const updated = scanAndUpdate(componentsPath);
console.log(`\n✓ Total files updated: ${updated}`);
console.log('Color system update complete!');
