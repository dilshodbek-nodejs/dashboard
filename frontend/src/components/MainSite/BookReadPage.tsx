import React, { useEffect, useState, useRef } from 'react';
import { Document, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDF_URL = '/sample.pdf';

const BookReadPage: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(window.innerWidth > 600 ? 370 : Math.max(window.innerWidth - 32, 220));
  const [height, setHeight] = useState<number>(window.innerWidth > 600 ? 500 : Math.floor((Math.max(window.innerWidth - 32, 220)) * 1.35));
  const bookRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth > 600 ? 370 : Math.max(window.innerWidth - 32, 220);
      setWidth(w);
      setHeight(window.innerWidth > 600 ? 500 : Math.floor(w * 1.35));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render PDF pages to images for flipbook
  useEffect(() => {
    const renderPages = async () => {
      const loadingTask = pdfjs.getDocument(PDF_URL);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          images.push(canvas.toDataURL());
        }
      }
      setPageImages(images);
    };
    renderPages();
  }, [width]);

  return (
    <div style={{ minHeight: '100vh', background: '#0e1a26', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <HTMLFlipBook
        className="custom-flipbook"
        width={width}
        height={height}
        minWidth={220}
        maxWidth={1200}
        minHeight={300}
        maxHeight={1800}
        startPage={0}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        swipeDistance={30}
        clickEventForward={true}
        useMouseEvents={true}
        renderOnlyPageLengthChange={false}
        showPageCorners={true}
        disableFlipByClick={false}
        size="fixed"
        style={{ margin: '0 auto', boxShadow: '0 4px 32px rgba(245,59,87,0.10)', borderRadius: 16, background: 'transparent' }}
        ref={bookRef}
      >
        {/* Cover Page */}
        <div className="page" style={{ background: 'linear-gradient(135deg, #f53b57 0%, #3a8dde 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="page-content cover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <img 
              src="/logo.png" 
              alt="Book Logo" 
              style={{ width: 120, marginBottom: 24, filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.18))' }} 
            />
            <h1 style={{ fontFamily: 'cursive', fontWeight: 700, fontSize: 32, marginBottom: 12, letterSpacing: 1 }}>Kitobni o'qish</h1>
            <h2 style={{ fontWeight: 500, fontSize: 20, marginBottom: 8, opacity: 0.92 }}>Flipbook Tajribasi</h2>
            <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 260, textAlign: 'center' }}>
              Ushbu sahifada PDF kitobni varaqlash, o'qish va haqiqiy kitob tajribasini his qilish mumkin.
            </p>
          </div>
        </div>
        {/* PDF Pages as images */}
        {pageImages.map((img, i) => (
          <div className="page" key={i + 1}>
            <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)' }}>
              <img src={img} alt={`Page ${i + 1}`} style={{ width: '100%', height: 'auto', maxHeight: height - 40, objectFit: 'contain', borderRadius: 5, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            </div>
          </div>
        ))}
      </HTMLFlipBook>
      <div style={{ marginTop: 32, color: '#fff', fontSize: 16, textAlign: 'center', opacity: 0.85 }}>
        <span>PDF faylni varaqlash uchun chap/ongga suring yoki tugmalardan foydalaning.</span>
      </div>
    </div>
  );
};

export default BookReadPage;
