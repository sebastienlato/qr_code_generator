import QRCode from 'qrcode';
import { EmailData, ErrorCorrectionLevel } from '@/state/useQrStore';

export interface QrPayload {
  mode: 'url' | 'email' | 'text';
  url?: string;
  email?: EmailData;
  text?: string;
}

export interface QrOptions {
  size: number;
  color: string;
  bgColor: string;
  margin: number;
  ecLevel: ErrorCorrectionLevel;
  transparentBg: boolean;
}

export interface LogoOptions {
  dataUrl: string;
  scale: number;
  cornerRadius: number;
  safetyRing: boolean;
}

export function buildPayload(payload: QrPayload): string {
  switch (payload.mode) {
    case 'url':
      return payload.url || '';
    case 'email':
      if (!payload.email?.to) return '';
      const { to, subject, body } = payload.email;
      let mailto = `mailto:${to}`;
      const params: string[] = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length) mailto += `?${params.join('&')}`;
      return mailto;
    case 'text':
      return payload.text || '';
    default:
      return '';
  }
}

export function validatePayload(payload: QrPayload): { valid: boolean; error?: string } {
  const data = buildPayload(payload);
  
  if (!data) {
    return { valid: false, error: 'Content cannot be empty' };
  }
  
  if (payload.mode === 'url') {
    try {
      const url = new URL(data);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return { valid: false, error: 'URL must start with http:// or https://' };
      }
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }
  
  if (payload.mode === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!payload.email?.to || !emailRegex.test(payload.email.to)) {
      return { valid: false, error: 'Invalid email address' };
    }
  }
  
  return { valid: true };
}

export async function generateQrSVG(data: string, options: QrOptions): Promise<string> {
  const opts = {
    width: options.size,
    margin: Math.floor(options.margin / 4),
    color: {
      dark: options.color,
      light: options.transparentBg ? '#00000000' : options.bgColor,
    },
    errorCorrectionLevel: options.ecLevel,
    type: 'svg' as const,
  };

  return QRCode.toString(data, opts);
}

export async function composeLogo(
  svg: string,
  logo: LogoOptions,
  qrSize: number
): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');
  
  if (!svgElement) {
    console.error('SVG element not found');
    return svg;
  }

  console.log('Composing logo, dataUrl length:', logo.dataUrl.length);
  console.log('QR Size:', qrSize, 'Logo scale:', logo.scale);

  const logoSize = (qrSize * logo.scale) / 100;
  const x = (qrSize - logoSize) / 2;
  const y = (qrSize - logoSize) / 2;

  console.log('Logo dimensions:', { logoSize, x, y });

  // Create a group for the logo overlay
  const logoGroup = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
  logoGroup.setAttribute('id', 'qr-logo-overlay');

  // Add white background to cover QR pattern under logo
  const coverRect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const coverPadding = logo.safetyRing ? logoSize * 0.15 : logoSize * 0.08;
  coverRect.setAttribute('x', (x - coverPadding).toString());
  coverRect.setAttribute('y', (y - coverPadding).toString());
  coverRect.setAttribute('width', (logoSize + coverPadding * 2).toString());
  coverRect.setAttribute('height', (logoSize + coverPadding * 2).toString());
  coverRect.setAttribute('rx', (logo.cornerRadius + coverPadding / 2).toString());
  coverRect.setAttribute('fill', '#FFFFFF');
  logoGroup.appendChild(coverRect);

  // Create defs for clipPath if it doesn't exist
  let defsElement = svgElement.querySelector('defs');
  if (!defsElement) {
    defsElement = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgElement.insertBefore(defsElement, svgElement.firstChild);
  }

  // Add clipPath for rounded corners
  const clipPath = doc.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  const clipId = 'logo-clip-' + Math.random().toString(36).substr(2, 9);
  clipPath.setAttribute('id', clipId);
  
  const clipRect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
  clipRect.setAttribute('x', x.toString());
  clipRect.setAttribute('y', y.toString());
  clipRect.setAttribute('width', logoSize.toString());
  clipRect.setAttribute('height', logoSize.toString());
  clipRect.setAttribute('rx', logo.cornerRadius.toString());
  
  clipPath.appendChild(clipRect);
  defsElement.appendChild(clipPath);

  // Add the logo image
  const image = doc.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', x.toString());
  image.setAttribute('y', y.toString());
  image.setAttribute('width', logoSize.toString());
  image.setAttribute('height', logoSize.toString());
  image.setAttribute('clip-path', `url(#${clipId})`);
  image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', logo.dataUrl);
  
  logoGroup.appendChild(image);

  // Append the logo group to the end of SVG (ensures it's on top)
  svgElement.appendChild(logoGroup);
  console.log('Added logo group with cover and image');

  const result = new XMLSerializer().serializeToString(doc);
  console.log('Final SVG with logo:', result.substring(0, 500));
  
  return result;
}

export async function toPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    ctx.scale(dpr, dpr);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  });
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getFilename(prefix: string, size: number, ext: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${prefix}-${timestamp}-${size}px.${ext}`;
}
