const Layout = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto w-full max-w-400 px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Layout;