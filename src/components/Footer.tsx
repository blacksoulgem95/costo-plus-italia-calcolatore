import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-muted py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground font-mono"> 
          Questo progetto è stato creato con 🖤 da{" "}
          <a 
            href="https://www.sofiavicedomini.me" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline hover:text-primary/80"
          >
            Sofia Vicedomini
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          ⚠️ Il progetto è ancora in fase di sviluppo e non mi assumo responsabilità per come viene utilizzato.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
