export default function SectionDivider() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      {/* Left line */}
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(233,68,128,0.4))',
        }}
      />

      {/* Star */}
      <div
        style={{
          color: '#e94480',
          filter: 'drop-shadow(0 0 6px rgba(233,68,128,0.5))',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      {/* Right line */}
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(233,68,128,0.4), transparent)',
        }}
      />
    </div>
  )
}
