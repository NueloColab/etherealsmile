'use client'

export default function EnquireButton({ name, price }) {
  function handleClick(e) {
    e.preventDefault()
    const url = `/?service=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}#book`
    window.history.pushState(null, '', url)
    window.dispatchEvent(new Event('popstate'))
    const bookSection = document.getElementById('book')
    if (bookSection) {
      bookSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href={`/?service=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}#book`}
      onClick={handleClick}
      className="btn btn-outline"
      style={{
        padding: '0.4rem 1rem',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      Enquire
    </a>
  )
}
