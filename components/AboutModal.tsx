import React from 'react';
import { XIcon, UserIcon, EmailIcon, WhatsAppIcon, ShieldCheckIcon } from './icons';

interface AboutModalProps {
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    const whatsappUrl = "https://wa.me/916005706055";

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 border-2 border-cyan-500/50 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-900/30 relative" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                    
                    <h2 className="text-3xl font-bold text-center text-cyan-400 mb-2">About Combatlas</h2>
                    <p className="text-center text-xs text-cyan-600 tracking-widest mb-6 uppercase">Indian Defense Encyclopedia</p>
                    
                    <div className="mb-6 bg-gray-800/30 p-4 rounded-lg border border-cyan-500/10">
                        <p className="text-gray-300 text-sm leading-relaxed text-center mb-4">
                           <strong>Combatlas</strong> is a specialized interface dedicated to the <strong className="text-cyan-300">Indian Defense Sector</strong>, developed by the <strong className="text-cyan-300">Global Defense Index (GDI)</strong>.
                        </p>
                        <div className="text-center border-t border-cyan-500/10 pt-3">
                             <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Architected By</p>
                             <p className="text-lg text-white font-orbitron mt-1">Global Defense Index</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-8 text-lg font-mono">
                        <span className="text-cyan-400">Jai</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-cyan-400">Hind</span>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                            <ShieldCheckIcon className="w-6 h-6 text-cyan-400 mr-4" />
                            <div>
                                <p className="text-xs text-cyan-300">GDI Lead Developer</p>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white font-mono hover:text-cyan-300 transition-colors">Aaditya Sadhu</a>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                            <WhatsAppIcon className="w-6 h-6 text-cyan-400 mr-4" />
                            <div>
                                <p className="text-xs text-cyan-300">Contact GDI</p>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white font-mono hover:text-cyan-300 transition-colors">+91 6005706055</a>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                            <EmailIcon className="w-6 h-6 text-cyan-400 mr-4" />
                            <div>
                                <p className="text-xs text-cyan-300">Email</p>
                                <a href="mailto:aadityasadhu50@gmail.com" className="text-white font-mono hover:text-cyan-300 transition-colors break-all text-sm">aadityasadhu50@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};