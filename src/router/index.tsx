import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: window.location.pathname || '/',
  navigate: () => {},
});

export const BrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useLocation = () => {
  const { path } = useContext(RouterContext);
  return { pathname: path };
};

export const NavLink: React.FC<{
  to: string;
  children: React.ReactNode;
  style?: (props: { isActive: boolean }) => React.CSSProperties;
  className?: string;
}> = ({ to, children, style, className }) => {
  const { path, navigate } = useContext(RouterContext);
  const isActive = path === to || (to !== '/' && path.startsWith(to));

  const computedStyle = style ? style({ isActive }) : undefined;

  return (
    <a
      href={to}
      className={className}
      style={{ cursor: 'pointer', ...computedStyle }}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};

export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to }) => {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to);
  }, [to, navigate]);
  return null;
};

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useContext(RouterContext);
  let matchedChild: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (matchedChild) return;
    if (React.isValidElement(child)) {
      const routePath = child.props.path;
      if (routePath === '*' || routePath === path || (routePath !== '/' && path.startsWith(routePath))) {
        matchedChild = child;
      }
    }
  });

  return <>{matchedChild}</>;
};

export const Route: React.FC<{ path: string; element: React.ReactNode }> = ({ element }) => {
  return <>{element}</>;
};
