import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-muted py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground font-mono"> 
          Questo progetto è stato creato con <span className="text-primary">🖤</span> da{" "}
          <a 
            href="https://www.sofiavicedomini.me" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            Sofia Vicedomini
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          <span className="text-destructive">⚠️</span> Il progetto è ancora in fase di sviluppo e non mi assumo responsabilità per come viene utilizzato.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-3 font-mono">
          © {currentYear} | <span className="text-primary/70">Cost-Plus Calculator</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
