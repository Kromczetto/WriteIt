type RatingProps = {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
  };
  
  const Rating = ({
    value,
    onChange,
    disabled = false,
  }: RatingProps) => {
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span
            key={n}
            onClick={() => !disabled && onChange(n)}
            style={{
              cursor: disabled ? 'default' : 'pointer',
              fontSize: 24,
              color: n <= value ? '#f5b50a' : '#ccc',
              userSelect: 'none',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  export default Rating;
  