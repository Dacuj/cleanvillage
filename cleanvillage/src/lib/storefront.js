// Minimal in-memory cache so subcomponents on the landing page can fetch the
// catalog tables without each one making a separate request.

import { useEffect, useState } from 'react';
import {
  listCategories, listBrands, listProducts,
  listVideos, listCourses, listIndustries,
} from './api.js';

const fetchers = {
  categories: listCategories,
  brands: listBrands,
  products: listProducts,
  videos: () => listVideos({ liveOnly: true }),
  courses: listCourses,
  industries: listIndustries,
};

const cache = {};
const inflight = {};
const subscribers = new Set();

function notify() { subscribers.forEach(fn => fn()); }

function ensure(key) {
  if (cache[key] !== undefined) return;
  if (inflight[key]) return;
  inflight[key] = fetchers[key]()
    .then(data => { cache[key] = data; delete inflight[key]; notify(); })
    .catch(err => { console.error(`[storefront] ${key}`, err); cache[key] = []; delete inflight[key]; notify(); });
}

function useStore(key) {
  const [, force] = useState(0);
  useEffect(() => {
    const tick = () => force(n => n + 1);
    subscribers.add(tick);
    ensure(key);
    return () => subscribers.delete(tick);
  }, [key]);
  return cache[key];
}

export const useCategories = () => useStore('categories') || [];
export const useBrands     = () => useStore('brands')     || [];
export const useProducts   = () => useStore('products')   || [];
export const useVideos     = () => useStore('videos')     || [];
export const useCourses    = () => useStore('courses')    || [];
export const useIndustries = () => useStore('industries') || [];

export function invalidateStorefront() {
  for (const k of Object.keys(cache)) delete cache[k];
  notify();
}
