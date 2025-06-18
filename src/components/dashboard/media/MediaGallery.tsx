import React, { useState, useRef } from 'react';
import Media from '@/types/Media';
import Loader from '@/components/dashboard/ui/Loader';
import { useServices } from '@/servicesContext';

interface MediaGalleryProps {
  media: Media[];
  loading: boolean;
  error: string | null;
  onUpload?: (mediaId: number) => void;
  allowUpload?: boolean;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  media, 
  loading, 
  error, 
  onUpload,
  allowUpload = true 
}) => {
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mediaService } = useServices();

  if (loading) {
    return <Loader message="Caricamento media..." />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const openLightbox = (item: Media) => {
    setSelectedImage(item);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadError(null);

    try {
      const uploaded = await mediaService.uploadMedia(file, file.name);
      if (onUpload) {
        onUpload(uploaded.id);
      }
    } catch (err) {
      setUploadError('Errore durante il caricamento del file.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isPDF = (item: Media): boolean => {
    return item.mime_type === 'application/pdf';
  };

  const openMedia = (item: Media) => {
    if (isPDF(item)) {
      // Apri il PDF in una nuova scheda
      window.open(item.source_url, '_blank');
    } else {
      // Apri il lightbox per le immagini
      openLightbox(item);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Media</h3>
        {allowUpload && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
            />
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-primary hover:bg-primary-700 text-white font-bold py-1.5 px-3 rounded text-sm flex items-center"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Caricamento...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Carica file
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
          {uploadError}
        </div>
      )}

      {!media.length && !isUploading ? (
        <div className="text-gray-500 italic">Nessun media disponibile</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => {
            if (isPDF(item)) {
              // Render PDF item
              return (
                <div 
                  key={item.id} 
                  className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-gray-100 flex flex-col items-center justify-center h-34"
                  onClick={() => openMedia(item)}
                >
                  <div className="p-4 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs text-gray-600">PDF</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm truncate">
                    {item.title.rendered}
                  </div>
                </div>
              );
            } else {
              // Render image item
              const thumbnail = 
                item.media_details.sizes?.thumbnail?.source_url || 
                item.media_details.sizes?.medium?.source_url || 
                item.source_url;
                
              return (
                <div 
                  key={item.id} 
                  className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                  onClick={() => openMedia(item)}
                >
                  <img 
                    src={thumbnail} 
                    alt={item.alt_text || item.title.rendered} 
                    className="w-full h-34 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm truncate">
                    {item.title.rendered}
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {selectedImage && !isPDF(selectedImage) && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.source_url} 
              alt={selectedImage.alt_text || selectedImage.title.rendered} 
              className="max-h-[90vh] max-w-full object-contain"
            />
            <button 
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 text-black hover:bg-opacity-100"
              onClick={closeLightbox}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
              {selectedImage.title.rendered}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
