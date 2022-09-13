// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import logo from './logo.svg';
import logoWhite from './logo-white.svg';
import logoBlack from './logo-black.svg';
import fontStyle from './latinFont';

import './style.css';

const defaultValue = 'https://fpm.climatepartner.com/label/00000-0000-0000/en';

const qr = new QRCodeStyling({
  width: 300,
  height: 300,
  type: 'svg',
  image: logoBlack,
  errorCorrectionLevel: 'H',
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 10,
  },
});

export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);
  const [color, setColor] = useState('#1e6eb4');
  const [qrstyle, setQrstyle] = useState('rounded');
  const [value, setValue] = useState(defaultValue);
  const [id] = value.match(/\d*\-\d*\-\d*/g) || [];
  const link = `https://climatepartner.com/${id}`;

  function onSelectColor(e) {
    setColor(e.target.value);
  }

  function onSelectStyle(e) {
    setQrstyle(e.target.value);
  }

  const download = (fileExt) => () => {
    const { current } = ref;
    if (current) {
      const svg = current.children[0];
      console.log(svg);
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      const url =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'label.svg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    qr.append(ref.current);
  }, []);

  useEffect(() => {
    const isNegative = color === 'negative';

    qr.update({
      width: size,
      height: size,
      data: value,
      dotsOptions: {
        color: color,
        type: qrstyle,
      },
      backgroundOptions: {
        color: 'none',
      },
    });

    const text = `<g fill="${color}" style="font-family: 'IBM Plex Sans'">
      <text text-anchor="middle" font-size="13" x="150" y="320">${link}</text>
    </g>`;

    setTimeout(() => {
      const svg = ref.current.lastChild;
      const defs = svg.querySelector('defs');
      defs.innerHTML += fontStyle;
      svg.setAttribute('height', 330);
      svg.innerHTML += text;
    }, 0);
  }, [size, value, color, qrstyle, link]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Write some URL to generate the QR:</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="form"
      />

      <select value={color} className="form" onChange={onSelectColor}>
        <option value="#003C91">Blue</option>
        <option value="#000">Black</option>
        <option value="#fff">white</option>
      </select>

      <select value={qrstyle} className="form" onChange={onSelectStyle}>
        <option value="rounded">Rounded</option>
        <option value="dots">Dots</option>
        <option value="classy">Classy</option>
        <option value="classy-rounded">Classy rounded</option>
        <option value="square">Square</option>
        <option value="extra-rounded">Extra rounded</option>
      </select>

      <div ref={ref} />

      <div
        style={{
          display: 'flex',
          margin: 10,
          gap: 10,
          justifyContent: 'center',
        }}
      >
        <button onClick={download('png')}>Download PNG</button>
        <button onClick={download('jpg')}>Download JPG</button>
        <button onClick={download('svg')}>Download SVG</button>
        <button onClick={download('pdf')}>Download PDF</button>
        <button onClick={download('eps')}>Download EPS</button>
      </div>
    </div>
  );
}
