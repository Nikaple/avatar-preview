'use client';

import JSON5 from '@/utils/json5';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const initialImagesValue = `[
  {
    url: 'https://placehold.co/300x400/png',
    position: [0, 0],
    width: 300,
  },
  {
    url: 'https://placehold.co/300x400/png',
    position: [300, 0],
    clip: [50, 50, 50, 50],
    width: 300,
  }
]`;

export default function Home() {
  const [w, setW] = useState('600');
  const [h, setH] = useState('400');
  const [images, setImages] = useState(initialImagesValue);
  const [size, setSize] = useState('1');
  const [debug, setDebug] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');

  const handleImportFromURL = () => {
    const urlString = prompt('Please paste the API URL');
    if (!urlString) return;

    try {
      const url = new URL(urlString);
      const params = url.searchParams;

      setW(params.get('w') || '');
      setH(params.get('h') || '');
      setSize(params.get('size') || '1');
      setDebug(params.get('debug') === 'true');

      const imagesParam = params.get('images');
      if (imagesParam) {
        try {
          // Attempt to parse and pretty-print the JSON
          const imagesObj = JSON.parse(imagesParam);
          setImages(JSON.stringify(imagesObj, null, 2));
        } catch (e) {
          // If parsing fails, just set the raw string
          setImages(imagesParam);
        }
      }
    } catch (error) {
      alert('Invalid URL. Please check the URL and try again.');
    }
  };

  const handleCopyURL = () => {
    const params = new URLSearchParams();
    params.append('w', w);
    params.append('h', h);
    params.append('images', images);
    if (size) params.append('size', size);
    if (debug) params.append('debug', 'true');

    const url = `${window.location.origin}/api/merge?${params.toString()}`;

    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      },
      () => {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000);
      },
    );
  };

  const generatePreview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPreviewImage(null);

    try {
      const params = new URLSearchParams();
      params.append('w', w);
      params.append('h', h);
      params.append('images', images);
      if (size) params.append('size', size);
      if (debug) params.append('debug', 'true');

      const response = await fetch(`/api/merge?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setPreviewImage(imageUrl);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [w, h, images, size, debug]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (w && h && images) {
        try {
          // Basic validation for images format
          JSON5.parse(images);
          generatePreview();
        } catch (error) {
          setError('Invalid JSON format for images.');
        }
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [w, h, images, size, debug, generatePreview]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Avatar preview</h1>
            <a
              href="https://github.com/Nikaple/avatar-preview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={24}
                height={24}
                className="dark:invert"
              />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Configuration</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="w"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Width (w)
                  </label>
                  <input
                    id="w"
                    type="number"
                    value={w}
                    onChange={(e) => setW(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="h"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Height (h)
                  </label>
                  <input
                    id="h"
                    type="number"
                    value={h}
                    onChange={(e) => setH(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Images (JSON5 format)
                </label>
                <textarea
                  id="images"
                  rows={12}
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                  placeholder="Enter image configurations"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Size (optional)
                  </label>
                  <input
                    id="size"
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 2"
                  />
                </div>
                <div className="flex items-center justify-start pt-6">
                  <input
                    id="debug"
                    type="checkbox"
                    checked={debug}
                    onChange={(e) => setDebug(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="debug"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Debug Mode
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={handleImportFromURL}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Import from URL
                </button>
                <button
                  type="button"
                  onClick={handleCopyURL}
                  disabled={!previewImage || isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {copySuccess || 'Copy Preview URL'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Area */}
          <div className="bg-white p-6 rounded-lg shadow flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="w-full flex-grow relative bg-gray-100 rounded-md min-h-[400px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Loading preview...</p>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-red-600 bg-red-50 p-4 rounded-md max-w-full">
                    <p className="font-semibold">Error:</p>
                    <p className="break-all">{error}</p>
                  </div>
                </div>
              )}
              {previewImage && !error && (
                <Image
                  src={previewImage}
                  alt="Generated Preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
              )}
              {!isLoading && !error && !previewImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400">
                    Image preview will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-gray-600 text-sm border-t border-gray-200 mt-8">
        <a
          href="https://stats.uptimerobot.com/c6IcMg4lLK"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900"
        >
          Uptime Status
        </a>
      </footer>
    </div>
  );
}
