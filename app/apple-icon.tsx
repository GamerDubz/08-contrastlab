import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: 152,
            height: 152,
            borderRadius: '50%',
            border: '12px solid #0a0a0a',
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '50%', height: '100%', background: '#0a0a0a' }} />
          <div style={{ width: '50%', height: '100%', background: '#ffffff' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
