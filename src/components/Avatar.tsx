import { useCallback, useState } from "react";
import { AvatarProps } from "../types/type";



// Avatar Component
const Avatar: React.FC<AvatarProps> = ({ user, size, onlineDotStyle }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setHasError(false);
  }, []);

  const displayName = user.displayName || user.email || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="position-relative me-2">
      {!hasError && user.photoURL ? (
        <img
          src={user.photoURL}
          alt={displayName}
          title={displayName}
          className="rounded-circle"
          style={{
            ...size,
            objectFit: "cover",
            border: "2px solid #dee2e6",
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      ) : (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold"
          style={{
            ...size,
            border: "2px solid #dee2e6",
            fontSize: "14px",
          }}
          title={displayName}
        >
          {initials}
        </div>
      )}
      <span
        className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
        style={onlineDotStyle}
        aria-label="Online"
      />
    </div>
  );
};

export default Avatar