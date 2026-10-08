export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-white dark:bg-[#0D251B] border border-[#E4EAE6] dark:border-[#1A3428] rounded-2xl shadow-sm ${
        hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
