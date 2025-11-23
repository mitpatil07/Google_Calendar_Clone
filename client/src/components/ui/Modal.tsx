import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);


  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      
      document.body.style.overflow = 'hidden';
      
      modalRef.current?.focus();
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleEscape]);

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/50',
        'animate-fade-in'
      )}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={clsx(
          'relative w-full mx-4',
          sizeStyles[size],
          'bg-white rounded-lg shadow-xl',
          'animate-slide-up',
          'max-h-[90vh] overflow-y-auto'
        )}
        tabIndex={-1}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className={clsx(
                'p-1 rounded-full',
                'text-gray-400 hover:text-gray-600',
                'hover:bg-gray-100',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};