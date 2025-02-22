# use-pdf-renderer

A React hook for rendering PDF files as images

[![npm version](https://img.shields.io/npm/v/use-pdf-renderer.svg)](https://www.npmjs.com/package/use-pdf-renderer)
[![npm downloads](https://img.shields.io/npm/dm/use-pdf-renderer.svg)](https://www.npmjs.com/package/use-pdf-renderer)
[![license](https://img.shields.io/npm/l/use-pdf-renderer.svg)](https://github.com/omimouni/use-pdf-renderer/blob/main/LICENSE)

## Installation

```
npm install use-pdf-renderer pdfjs-dist
```

## Usage

```jsx
import { usePdfRenderer } from 'use-pdf-renderer';
import 'pdfjs-dist/build/pdf.worker.min';

function PdfViewer() {
  const { images, loading, progress, error, renderPdf } = usePdfRenderer();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      renderPdf(url)
        .catch(console.error)
        .finally(() => URL.revokeObjectURL(url));
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      
      {loading && <div>Loading... {(progress * 100).toFixed(0)}%</div>}
      {error && <div>Error: {error.message}</div>}
      
      {images.map((image, index) => (
        <img 
          key={index} 
          src={image} 
          alt={`Page ${index + 1}`} 
          style={{ maxWidth: '100%' }} 
        />
      ))}
    </div>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| scale | number | 2 | Scale factor for rendering |
| quality | number | 0.8 | Image quality (0-1) |
| imageType | 'png' \| 'jpeg' | 'png' | Output format |
| withCredentials | boolean | false | Send credentials with request |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| images | string[] | Array of rendered page images |
| loading | boolean | Loading state |
| progress | number | Progress (0-1) |
| error | Error \| null | Error if any |
| renderPdf | function | Render PDF from URL |
| reset | function | Reset viewer state |

## License

MIT