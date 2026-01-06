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
  const rate = async (value: number) => {
    if (userRating !== null) return;

    await axios.post(
      `/review/${workId}`,
      { rating: value },
      { withCredentials: true }
    );

    onRated();
  };

  return (
    <div>
      <div style={{ fontSize: 18 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span
            key={n}
            onClick={() => rate(n)}
            style={{
              cursor:
                userRating === null ? 'pointer' : 'default',
              color:
                (userRating ?? average) >= n
                  ? '#facc15'
                  : '#d1d5db',
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
