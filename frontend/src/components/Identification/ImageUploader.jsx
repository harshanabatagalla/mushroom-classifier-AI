
import React, { useState, useRef } from 'react';
import { useImage } from '@/context/ImageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ImageUploader = () => {
  const { uploadImage, loading } = useImage();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file) => {
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }

    await uploadImage(file);
  };

  return (
    <Card className={`border-2 border-dashed p-4 ${dragActive ? 'border-mushroom-primary bg-mushroom-light/20' : 'border-border'}`}>
      <CardContent className="p-0">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-4 py-10 text-center"
        >
          <div className="rounded-full bg-muted p-6">
            <Upload size={36} className="text-mushroom-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Upload a photo of your mushroom</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop an image, or click to browse
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPEG, PNG, GIF
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
