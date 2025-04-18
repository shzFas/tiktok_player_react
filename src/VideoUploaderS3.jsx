import React, { useState } from 'react';

const VideoUploaderS3 = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      setIsUploading(true);
      const res = await fetch('http://localhost:5000/s3/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Ошибка при загрузке');

      const data = await res.json();
      setUploadResult(data);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Загрузка видео в S3</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <br />
      <button onClick={handleUpload} disabled={isUploading || !videoFile}>
        {isUploading ? 'Загрузка...' : 'Загрузить видео'}
      </button>

      {uploadResult && (
        <div style={{ marginTop: '10px' }}>
          <strong>Видео загружено в S3:</strong><br />
          <a href={uploadResult.fileUrl} target="_blank" rel="noreferrer">
            {uploadResult.fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoUploaderS3;
