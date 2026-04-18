import { useState } from 'react';
import { Trophy, Users, Home, Plus, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  onCreateTournament: () => void;
}

export default function Header({ currentView, setView, onCreateTournament }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'players', label: 'Players', icon: Users },
  ];

  return (
    <header className="bg-chess-light border-b border-chess-accent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chess-gold rounded-lg flex items-center justify-center">
              <span className="text-2xl">♟️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Galactic Gambits</h1>
              <p className="text-xs text-gray-400">Chess Tournament Manager</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`nav-link flex items-center space-x-2 ${currentView === item.id ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Create Button */}
          <div className="hidden md:flex items-center">
            <button onClick={onCreateTournament} className="btn-primary flex items-center space-x-2">
              <Plus size={18} />
              <span>New Tournament</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-chess-accent">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`nav-link flex items-center space-x-2 ${currentView === item.id ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
              <button onClick={onCreateTournament} className="btn-primary flex items-center space-x-2 w-fit">
                <Plus size={18} />
                <span>New Tournament</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}