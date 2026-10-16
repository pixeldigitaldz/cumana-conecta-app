import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-static';
export const alt = 'CumanáConecta — Directorio Oficial de Cumaná, Sucre';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Cargar el logo oficial y convertir a Data URI en base64 para renderizado garantizado en Satori
  let logoDataUri = 'https://cumanaconecta.com/logo.png';
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const fileBuffer = fs.readFileSync(logoPath);
      logoDataUri = `data:image/png;base64,${fileBuffer.toString('base64')}`;
    }
  } catch (e) {
    console.error('Error cargando logo para opengraph-image:', e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0d11',
          padding: '36px',
        }}
      >
        {/* Marco arquitectónico interior */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#11141a',
            border: '2px solid #222630',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Zona segura 1:1 en el centro exacto para evitar recorte en WhatsApp móvil */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '560px',
              height: '500px',
            }}
          >
            {/* Círculo blanco con borde ámbar #fbbf24 conteniendo el logo centrado */}
            <div
              style={{
                width: '136px',
                height: '136px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '4px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
              }}
            >
              <img
                src={logoDataUri}
                alt="Logo Oficial CumanáConecta"
                width={105}
                height={105}
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Título Oficial: Cumaná en blanco y Conecta en ámbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '22px',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '46px',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                Cumaná
              </span>
              <span
                style={{
                  color: '#fbbf24',
                  fontSize: '46px',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                Conecta
              </span>
            </div>

            {/* Subtítulo oficial */}
            <div
              style={{
                color: '#94a3b8',
                fontSize: '17px',
                fontWeight: 600,
                marginTop: '10px',
                textAlign: 'center',
                maxWidth: '520px',
                lineHeight: 1.4,
              }}
            >
              Directorio Oficial de Comercios, Salud 24h y Tiendas con Cashea
            </div>

            {/* Píldora inferior */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '22px',
                padding: '6px 20px',
                backgroundColor: '#161920',
                border: '1px solid #252934',
                borderRadius: '9999px',
              }}
            >
              <span
                style={{
                  color: '#fbbf24',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                }}
              >
                CUMANÁ, ESTADO SUCRE • VE
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
