import { useState, useRef } from 'react';

export default function UploadSection({ onUploadComplete, uploadedFiles, setUploadedFiles }) {
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setProgress(0);
    setStatusMessage('File selected and ready to index.');
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const startIndexing = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(20); 
    setStatusMessage('Sending document to the server...');

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${baseUrl}/api/Document/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setProgress(100);
        setStatusMessage('Text extracted successfully.');
        
        const data = await response.json();
        
        console.log("Success: Data received from server");
        console.log("Total Characters:", data.totalCharacters);
        console.log("Text Preview:", data.previewText);

        setTimeout(() => {
          const newFile = {
            id: Date.now().toString(),
            name: selectedFile.name,
            size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
            chunks: "Pending",
            uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Extracted'
          };
          
          const updated = [newFile, ...uploadedFiles];
          setUploadedFiles(updated);
          
          if (onUploadComplete) {
            onUploadComplete(newFile);
          }
          
          setUploading(false);
          setSelectedFile(null);
          setProgress(0);
          setStatusMessage('');
        }, 1500);

      } else {
        setStatusMessage('Error: Server rejected the file.');
        setUploading(false);
        alert("Upload failed. Status: " + response.status);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setStatusMessage('Error: Connection failed.');
      setUploading(false);
      alert("Failed to connect to the server. Check if the API is running and CORS is enabled.");
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Knowledge Base Core</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload and index documents to feed your custom niche-domain knowledge database.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 bg-white ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/40 ring-4 ring-indigo-50'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.csv,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
          dragActive ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-100 text-slate-600'
        }`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-slate-700 mb-1">
          {dragActive ? 'Drop your document here' : 'Drag and drop your document here'}
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mb-4">
          Supports PDF only.
        </p>

        {!selectedFile && !uploading && (
          <button
            type="button"
            onClick={triggerFileSelect}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
          >
            Browse files
          </button>
        )}

        {/* Selected File Details */}
        {selectedFile && !uploading && (
          <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="truncate max-w-[240px]">
                  <p className="text-xs font-semibold text-slate-700 truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-400">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <button
              type="button"
              onClick={startIndexing}
              className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Process & Chunk Document</span>
            </button>
          </div>
        )}

        {/* Indexing Progress Indicator */}
        {uploading && (
          <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-indigo-600">Simulating RAG Pipeline...</span>
              <span className="text-xs font-bold text-indigo-700">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              {/* Spinner */}
              <svg className="animate-spin h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-[11px] font-medium text-slate-500 animate-pulse">{statusMessage}</p>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
