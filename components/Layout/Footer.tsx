"use client";
import React from "react";

export function Footer() {
  return (
    <footer className="app-footer no-print">
      <div className="footer-container">
        {/* Buy Me a Coffee Callout */}
        <div className="bmac-section">
          <div className="bmac-text">
            <span className="bmac-badge">☕ Support the Project</span>
            <p className="bmac-subtext">
              Free, private &amp; open-source invoice generator. If this tool
              helped save you time, consider buying the developer a cup of
              coffee!
            </p>
          </div>
          <a
            href="https://buymeacoffee.com/etornamahiataku"
            target="_blank"
            rel="noopener noreferrer"
            className="bmac-button"
            aria-label="Buy me a coffee"
          >
            <svg
              className="bmac-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.216 6.415l-.132-.666c-.119-.597-.386-1.144-.774-1.584C18.665 3.447 17.712 3 16.5 3H4.5A2.5 2.5 0 0 0 2 5.5v11A2.5 2.5 0 0 0 4.5 19H16c1.212 0 2.165-.447 2.81-1.165.388-.44.655-.987.774-1.584l.632-3.166A3.498 3.498 0 0 0 22 9.5a3.48 3.48 0 0 0-1.784-3.085zM20 9.5c0 .827-.673 1.5-1.5 1.5h-.724l.443-2.215.113-.565c.09-.452.288-.67.668-.72h1zM4.5 5h12c.491 0 .848.163 1.063.485.207.311.233.722.18 1.183l-1.92 9.6c-.053.461-.173.872-.38 1.183-.215.322-.572.485-1.063.485H4.5A.5.5 0 0 1 4 16.5v-11a.5.5 0 0 1 .5-.5z" />
            </svg>
            <span>Buy me a coffee</span>
          </a>
        </div>

        <div className="footer-divider" />

        {/* Info & Keyboard Shortcuts */}
        <div className="footer-bottom">
          <div className="footer-privacy">
            <span className="privacy-indicator" />
            <span>Your financial data never leaves your browser.</span>
          </div>

          <div className="footer-shortcuts">
            <span className="shortcut-tag">
              <kbd>Tab</kbd> on Rate creates new row
            </span>
            <span className="shortcut-tag">
              <kbd>Ctrl</kbd>+<kbd>P</kbd> to Print / PDF
            </span>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} InvoiceGen • Built for modern
            freelancers &amp; teams.
          </div>
        </div>
      </div>
    </footer>
  );
}
