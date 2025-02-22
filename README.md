<div align="center">
  <h1>use-pdf-renderer</h1>
  <p>A React hook for rendering PDF files as images</p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/use-pdf-renderer">
    <img src="https://img.shields.io/npm/v/use-pdf-renderer.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/use-pdf-renderer">
    <img src="https://img.shields.io/npm/dm/use-pdf-renderer.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/omimouni/use-pdf-renderer/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/use-pdf-renderer.svg" alt="license" />
  </a>
</div>

<br />

<h2>Installation</h2>

<pre>npm install use-pdf-renderer pdfjs-dist</pre>

<h2>Usage</h2>

<pre>
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
    &lt;div&gt;
      &lt;input type="file" accept=".pdf" onChange={handleFileChange} /&gt;
      
      {loading && &lt;div&gt;Loading... {(progress * 100).toFixed(0)}%&lt;/div&gt;}
      {error && &lt;div&gt;Error: {error.message}&lt;/div&gt;}
      
      {images.map((image, index) => (
        &lt;img 
          key={index} 
          src={image} 
          alt={`Page ${index + 1}`} 
          style={{ maxWidth: '100%' }} 
        /&gt;
      ))}
    &lt;/div&gt;
  );
}
</pre>

<br />

<h2>API Reference</h2>

<h3>Options</h3>

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scale</td>
      <td>number</td>
      <td>2</td>
      <td>Scale factor for rendering</td>
    </tr>
    <tr>
      <td>quality</td>
      <td>number</td>
      <td>0.8</td>
      <td>Image quality (0-1)</td>
    </tr>
    <tr>
      <td>imageType</td>
      <td>'png' | 'jpeg'</td>
      <td>'png'</td>
      <td>Output format</td>
    </tr>
    <tr>
      <td>withCredentials</td>
      <td>boolean</td>
      <td>false</td>
      <td>Send credentials with request</td>
    </tr>
  </tbody>
</table>

<h3>Return Values</h3>

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>images</td>
      <td>string[]</td>
      <td>Array of rendered page images</td>
    </tr>
    <tr>
      <td>loading</td>
      <td>boolean</td>
      <td>Loading state</td>
    </tr>
    <tr>
      <td>progress</td>
      <td>number</td>
      <td>Progress (0-1)</td>
    </tr>
    <tr>
      <td>error</td>
      <td>Error | null</td>
      <td>Error if any</td>
    </tr>
    <tr>
      <td>renderPdf</td>
      <td>function</td>
      <td>Render PDF from URL</td>
    </tr>
    <tr>
      <td>reset</td>
      <td>function</td>
      <td>Reset viewer state</td>
    </tr>
  </tbody>
</table>

<h2>License</h2>

<p>MIT</p>



