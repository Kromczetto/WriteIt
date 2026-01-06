import { useState } from 'react';
import axios from 'axios';

type Props = {
  workId: string;
  average: number;
  count: number;
  userRating: number | null;
  onRated: () => void;
};

const Rating = ({
  workId,
  average,
  count,
  userRating,
  onRated,
}: Props) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [localRating, setLocalRating] =
    useState<number | null>(null);

  const effectiveRating =
    userRating ?? localRating ?? average;

  const rate = async (value: number) => {
    if (userRating !== null) return;

    setLocalRating(value);
    setHovered(null);

    try {
      await axios.post(
        `/review/${workId}`,
        { rating: value },
        { withCredentials: true }
      );
      onRated();
    } catch {
      setLocalRating(null);
    }
  };

  return (
    <div>
      <div style={{ fontSize: 18 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span
            key={n}
            onClick={() => rate(n)}
            onMouseEnter={() =>
              userRating === null &&
              setHovered(n)
            }
            onMouseLeave={() => setHovered(null)}
            style={{
              cursor:
                userRating === null
                  ? 'pointer'
                  : 'default',
              color:
                (hovered ?? effectiveRating) >= n
                  ? '#facc15'
                  : '#d1d5db',
              userSelect: 'none',
            }}
          >
            ★
          </span>
        ))}
      </div>

      <div style={{ fontSize: 13, color: '#6b7280' }}>
        {average.toFixed(1)} ({count} votes)
        {userRating !== null && (
          <span> · Your rating: {userRating}</span>
        )}
      </div>
    </div>
  );
};

export default Rating;
