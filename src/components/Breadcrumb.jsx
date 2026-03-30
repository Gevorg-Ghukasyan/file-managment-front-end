import { useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    if (path === "/") {
      return [{ label: "My Drive", path: "/" }];
    } else if (path === "/groups") {
      return [
        { label: "My Drive", path: "/" },
        { label: "Groups", path: "/groups" }
      ];
    } else if (path === "/upload") {
      return [
        { label: "My Drive", path: "/" },
        { label: "Upload", path: "/upload" }
      ];
    }
    
    return [{ label: "My Drive", path: "/" }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "8px", 
      marginBottom: "24px",
      fontSize: "13px",
      color: "#94a3b8"
    }}>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {index > 0 && <span>/</span>}
          <a 
            href={crumb.path}
            style={{
              color: index === breadcrumbs.length - 1 ? "#cbd5e1" : "#64748b",
              textDecoration: "none",
              transition: "color 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.target.style.color = "#f8fafc"}
            onMouseLeave={(e) => e.target.style.color = index === breadcrumbs.length - 1 ? "#cbd5e1" : "#64748b"}
          >
            {crumb.label}
          </a>
        </div>
      ))}
    </nav>
  );
}
