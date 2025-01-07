import React from 'react'

const Navbar = () => {
  return (
    <>
    <body>
        <nav className="navbar navbar-expand-lg" style={{ alignItems: 'center' }}>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <a className="navbar-brand">
                        <img src="/images/logo/logoNavbar.png" alt="Logo" className="navbar-logo" />
                    </a>
                    <a className="nav-link">
                        <div className="marquee-container d-flex justify-content-between">
                            <div className="marquee-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', display: 'block' }}>
                                <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 15s linear infinite' }}>
                                    Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ    Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ    Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ
                                </div>
                            </div>
                        </div>
                    </a>
                </ul>
            </div>
        </nav>
    </body>
    </>
  )
}

export default Navbar