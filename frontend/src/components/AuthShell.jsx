// Painel lateral das telas de login/cadastro: floresta com a lanterna acesa.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth-art" aria-hidden="true">
        <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="beam" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#e0a030" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#e0a030" stopOpacity="0" />
            </radialGradient>
          </defs>
          <polygon points="200,90 40,600 360,600" fill="url(#beam)" />
          <circle cx="200" cy="90" r="9" fill="#f6d68a" />
          {[[30, 470, 1.2], [90, 500, 0.9], [310, 480, 1.1], [370, 510, 0.8], [150, 540, 0.7], [255, 545, 0.75]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#0c1813">
              <polygon points="0,-150 -42,-60 -22,-60 -55,0 -18,0 -18,30 18,30 18,0 55,0 22,-60 42,-60" />
            </g>
          ))}
          <ellipse cx="200" cy="420" rx="26" ry="70" fill="#0c1813" opacity="0.85" />
          <circle cx="200" cy="335" r="20" fill="#0c1813" opacity="0.85" />
        </svg>
        <p className="auth-art-text">Viu algo estranho na mata? Conte para a cidade inteira.</p>
      </aside>
      <section className="auth-form">
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
      </section>
    </div>
  );
}
